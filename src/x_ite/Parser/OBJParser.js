/*******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright create3000, Scheffelstraße 31a, Leipzig, Germany 2011 - 2022.
 *
 * All rights reserved. Holger Seelig <holger.seelig@yahoo.de>.
 *
 * The copyright notice above does not evidence any actual of intended
 * publication of such source code, and is an unpublished work by create3000.
 * This material contains CONFIDENTIAL INFORMATION that is the property of
 * create3000.
 *
 * No permission is granted to copy, distribute, or create derivative works from
 * the contents of this software, in whole or in part, without the prior written
 * permission of create3000.
 *
 * NON-MILITARY USE ONLY
 *
 * All create3000 software are effectively free software with a non-military use
 * restriction. It is free. Well commented source is provided. You may reuse the
 * source in any way you please with the exception anything that uses it must be
 * marked to indicate is contains 'non-military use only' components.
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright 2011 - 2022, Holger Seelig <holger.seelig@yahoo.de>.
 *
 * This file is part of the X_ITE Project.
 *
 * X_ITE is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License version 3 only, as published by the
 * Free Software Foundation.
 *
 * X_ITE is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more
 * details (a copy is included in the LICENSE file that accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version 3
 * along with X_ITE.  If not, see <https://www.gnu.org/licenses/gpl.html> for a
 * copy of the GPLv3 License.
 *
 * For Silvio, Joy and Adi.
 *
 ******************************************************************************/

import X3DParser    from "./X3DParser.js";
import X3DOptimizer from "./X3DOptimizer.js";
import Expressions  from "./Expressions.js";
import Vector2      from "../../standard/Math/Numbers/Vector2.js";
import Vector3      from "../../standard/Math/Numbers/Vector3.js";
import Color3       from "../../standard/Math/Numbers/Color3.js";
import DEBUG        from "../DEBUG.js";

// http://paulbourke.net/dataformats/obj/
// https://people.sc.fsu.edu/~jburkardt/data/obj/obj.html

/*
 *  Grammar
 */

// Lexical elements
const Grammar = Expressions ({
   // General
   whitespaces: /[\x20\n\t\r]+/gy,
   whitespacesNoLineTerminator: /[\x20\t]+/gy,
   comment: /#.*?(?=[\n\r])/gy,
   untilEndOfLine: /([^\r\n]+)/gy,

   // Keywords
   mtllib: /\bmtllib\b/gy,
   usemtl: /\busemtl\b/gy,
   newmtl: /\bnewmtl\b/gy,
   Ka: /\bKa\b/gy,
   Kd: /\bKd\b/gy,
   Ks: /\bKs\b/gy,
   Ns: /\bNs\b/gy,
   d: /\bd\b/gy,
   Tr: /\bTr\b/gy,
   illum: /\billum\b/gy,
   map_Kd: /\bmap_Kd\b/gy,
   o: /\bo\b/gy,
   v: /\bv\b/gy,
   vt: /\bvt\b/gy,
   vn: /\bvn\b/gy,
   g: /\bg\b/gy,
   s: /\bs\b/gy,
   off: /\boff\b/gy,
   f: /\bf\b/gy,
   slash: /\//gy,

   // Values
   int32:  /((?:0[xX][\da-fA-F]+)|(?:[+-]?\d+))/gy,
   double: /([+-]?(?:(?:(?:\d*\.\d+)|(?:\d+(?:\.)?))(?:[eE][+-]?\d+)?))/gy,
   constants: /([+-])((?:NAN|INF|INFINITY))/igy,
});

/*
 * Parser
 */

function OBJParser (scene)
{
   X3DParser    .call (this, scene);
   X3DOptimizer .call (this);

   // Optimizer

   this .removeGroups         = true;
   this .removeEmptyGroups    = true;
   this .combineGroupingNodes = false;

   // Globals

   this .smoothingGroup  = 0;
   this .smoothingGroups = new Map ();
   this .groups          = new Map ();
   this .materials       = new Map ();
   this .textures        = new Map ();
   this .point2          = new Vector2 ();
   this .point3          = new Vector3 ();
   this .lastIndex       = 0;
}

OBJParser .prototype = Object .assign (Object .create (X3DParser .prototype),
   X3DOptimizer .prototype,
{
   constructor: OBJParser,
   CONSTANTS: new Map ([
      ["NAN", NaN],
      ["INF", Infinity],
      ["INFINITY", Infinity],
   ]),
   getEncoding: function ()
   {
      return "STRING";
   },
   isValid: function ()
   {
      if (!(typeof this .input === "string"))
         return false;

      return !! this .input .match (/^(?:[\x20\n\t\r]+|#.*?[\r\n])*\b(?:mtllib|usemtl|o|g|s|vt|vn|v|f)\b/);
   },
   setInput: function (string)
   {
      this .input = string;
   },
   parseIntoScene: function (success, error)
   {
      this .obj ()
         .then (success)
         .catch (error);
   },
   obj: async function ()
   {
      // Set profile and components.

      const
         browser = this .getBrowser (),
         scene   = this .getScene ();

      scene .setEncoding ("OBJ");
      scene .setProfile (browser .getProfile ("Interchange"));

      await this .loadComponents ();

      // Init nodes.

      this .object          = scene .createNode ("Transform");
      this .group           = scene .createNode ("Group");
      this .defaultMaterial = scene .createNode ("Material");
      this .texCoord        = scene .createNode ("TextureCoordinate");
      this .normal          = scene .createNode ("Normal");
      this .coord           = scene .createNode ("Coordinate");

      this .object .children .push (this .group);

      scene .getRootNodes () .push (this .object);

      // Parse scene.

      await this .statements ();

      this .optimizeSceneGraph (scene .getRootNodes ());

      return this .getScene ();
   },
   comments: function ()
   {
      while (this .comment ())
         ;
   },
   comment: function ()
   {
      this .whitespaces ();

      if (Grammar .comment .parse (this))
         return true;

      return false;
   },
   whitespaces: function ()
   {
      Grammar .whitespaces .parse (this);
   },
   whitespacesNoLineTerminator: function ()
   {
      Grammar .whitespacesNoLineTerminator .parse (this);
   },
   statements: async function ()
   {
      while (await this .statement ())
         ;
   },
   statement: async function ()
   {
      if (await this .mtllibs ())
         return true;

      if (this .usemtl ())
         return true;

      if (this .o ())
         return true;

      if (this .g ())
         return true;

      if (this .s ())
         return true;

      if (this .vts ())
         return true;

      if (this .vns ())
         return true;

      if (this .vs ())
         return true;

      if (this .fs ())
         return true;

      // Skip empty and unknown lines.

      if (Grammar .untilEndOfLine .parse (this))
         return true;

      return false;
   },
   mtllibs: async function ()
   {
      this .comments ();

      if (Grammar .mtllib .parse (this))
      {
         this .whitespacesNoLineTerminator ();

         if (Grammar .untilEndOfLine .parse (this))
         {
            const mtllibs = this .result [1] .trim () .split (/\s+/);

            await Promise .all (mtllibs .map (path => this .mtllib (path)));
         }

         return true;
      }

      return false;
   },
   mtllib: async function (path)
   {
      try
      {
         const
            scene = this .getExecutionContext (),
            url   = new URL (path, scene .getWorldURL ());

         const input = await fetch (url)
            .then (response => response .arrayBuffer ())
            .then (arrayBuffer => $.decodeText ($.ungzip (arrayBuffer)))
            .catch (Function .prototype);

         const parser = new MaterialParser (scene, input);

         parser .parse ();

         for (const [name, material] of parser .materials)
         {
            const nodeName = this .sanitizeName (name);

            if (nodeName)
               scene .addNamedNode (scene .getUniqueName (nodeName), material);

            this .materials .set (name, material);
         }

         for (const [name, texture] of parser .textures)
         {
            const nodeName = this .sanitizeName (name);

            if (nodeName)
               scene .addNamedNode (scene .getUniqueName (nodeName), texture);

            this .textures .set (name, texture);
         }
      }
      catch (error)
      {
         console .warn (error);
      }
   },
   usemtl: function ()
   {
      this .comments ();

      if (Grammar .usemtl .parse (this))
      {
         this .whitespacesNoLineTerminator ();

         if (Grammar .untilEndOfLine .parse (this))
         {
            const name = this .result [1];

            this .material = this .materials .get (name) || this .defaultMaterial;
            this .texture  = this .textures .get (name);

            const smoothingGroup = this .smoothingGroups .get (this .group .getNodeName ());

            if (smoothingGroup)
               smoothingGroup .delete (this .smoothingGroup);
         }

         return true;
      }

      return false;
   },
   o: function ()
   {
      this .comments ();

      if (Grammar .o .parse (this))
      {
         this .whitespacesNoLineTerminator ();

         if (Grammar .untilEndOfLine .parse (this))
         {
            const
               scene    = this .getExecutionContext (),
               nodeName = this .sanitizeName (this .result [1]);

            if (this .group .children .length)
            {
               this .object = scene .createNode("Transform");
               this .group  = scene .createNode ("Group");

               this .object .children .push (this .group);
               scene .getRootNodes () .push (this .object);
            }

            if (nodeName)
               scene .addNamedNode (scene .getUniqueName (nodeName), this .object);
         }

         return true;
      }

      return false;
   },
   g: function ()
   {
      this .comments ();

      if (Grammar .g .parse (this))
      {
         this .whitespacesNoLineTerminator ();

         if (Grammar .untilEndOfLine .parse (this))
         {
            const
               scene    = this .getExecutionContext (),
               name     = this .result [1],
               nodeName = this .sanitizeName (name),
               group    = this .groups .get (name);

            if (group)
            {
               this .group = group;
            }
            else
            {
               if (this .group .children .length)
               {
                  this .group = scene .createNode ("Group");

                  this .object .children .push (this .group);
               }
            }

            this .groups .set (name, this .group);

            if (nodeName)
               scene .addNamedNode (scene .getUniqueName (nodeName), this .group);

            this .smoothingGroup = 0;
         }

         return true;
      }

      return false;
   },
   s: function ()
   {
      this .comments ();

      if (Grammar .s .parse (this))
      {
         this .whitespacesNoLineTerminator ();

         if (Grammar .off .parse (this))
         {
            this .smoothingGroup = 0;
            return true;
         }

         if (this .int32 ())
         {
            this .smoothingGroup = this .value;
            return true;
         }

         return true;
      }

      return false;
   },
   vts: function ()
   {
      const point = this .texCoord .point;

      let result = false;

      while (this .vt (point))
         result = true;

      return result;
   },
   vt: function (point)
   {
      this .comments ();

      if (Grammar .vt .parse (this))
      {
         if (this .vec2 ())
         {
            point .push (this .point2);

            return true;
         }

         throw new Error ("Expected a texture coordinate.");
      }

      return false;
   },
   vns: function ()
   {
      const vector = this .normal .vector;

      let result = false;

      while (this .vn (vector))
         result = true;

      return result;
   },
   vn: function (vector)
   {
      this .comments ();

      if (Grammar .vn .parse (this))
      {
         if (this .vec3 ())
         {
            vector .push (this .point3);

            return true;
         }

         throw new Error ("Expected a normal vector.");
      }

      return false;
   },
   vs: function ()
   {
      const point = this .coord .point;

      let result = false;

      while (this .v (point))
         result = true;

      return result;
   },
   v: function (point)
   {
      this .comments ();

      if (Grammar .v .parse (this))
      {
         if (this .vec3 ())
         {
            point .push (this .point3);

            return true;
         }

         throw new Error ("Expected a vertex coordinate.");
      }

      return false;
   },
   fs: function ()
   {
      this .comments ();

      if (Grammar .f .lookahead (this))
      {
         try
         {
            this .shape    = this .smoothingGroups .get (this .group .getNodeName ()) .get (this .smoothingGroup);
            this .geometry = this .shape .geometry;
         }
         catch (error)
         {
            const
               scene      = this .getExecutionContext (),
               appearance = scene .createNode ("Appearance");

            this .geometry = scene .createNode ("IndexedFaceSet");
            this .shape    = scene .createNode ("Shape");

            appearance .material        = this .material;
            appearance .texture         = this .texture;
            this .geometry .creaseAngle = this .smoothingGroup ? Math .PI : 0;
            this .shape .appearance     = appearance;
            this .shape .geometry       = this .geometry;

            this .group .children .push (this .shape);

            if (!this .smoothingGroups .has (this .group .getNodeName ()))
               this .smoothingGroups .set (this .group .getNodeName (), new Map ());

            this .smoothingGroups .get (this .group .getNodeName ()) .set (this .smoothingGroup, this .shape);
         }

         while (this .f ())
            ;

         if (this .geometry .texCoordIndex .length)
            this .geometry .texCoord = this .texCoord;

         if (this .geometry .normalIndex .length)
            this .geometry .normal = this .normal;

         this .geometry .coord = this .coord;

         return true;
      }

      return false;
   },
   f: function ()
   {
      this .comments ();

      if (Grammar .f .parse (this))
      {
         const
            geometry           = this .geometry,
            texCoordIndex      = geometry .texCoordIndex,
            normalIndex        = geometry .normalIndex,
            coordIndex         = geometry .coordIndex,
            numTexCoordIndices = texCoordIndex .length,
            numNormalIndices   = normalIndex .length,
            numTexCoords       = this .texCoord .point .length,
            numNormals         = this .normal .vector .length,
            numCoords          = this .coord .point .length;

         while (this .indices (texCoordIndex, normalIndex, coordIndex, numTexCoords, numNormals, numCoords))
            ;

         if (texCoordIndex .length !== numTexCoordIndices)
            texCoordIndex .push (-1);

         if (normalIndex .length !== numNormalIndices)
            normalIndex .push (-1);

         coordIndex .push (-1);

         return true;
      }

      return false;
   },
   indices: function (texCoordIndex, normalIndex, coordIndex, numTexCoords, numNormals, numCoords)
   {
      if (this .int32 ())
      {
         coordIndex .push (this .index (this .value, numCoords));

         if (Grammar .slash .parse (this))
         {
            if (this .int32 ())
            {
               texCoordIndex .push (this .index (this .value, numTexCoords));
            }

            if (Grammar .slash .parse (this))
            {
               if (this .int32 ())
               {
                  normalIndex .push (this .index (this .value, numNormals));
               }
            }
         }

         return true;
      }

      return false;
   },
   index: function (index, length)
   {
      if (index === 0)
         throw new Error ("Invalid index.");

      if (index < 0)
         return length + index;

      return index - 1;
   },
   int32: function ()
   {
      this .whitespaces ();

      if (Grammar .int32 .parse (this))
      {
         this .value = parseInt (this .result [1]);

         return true;
      }

      return false;
   },
   double: function ()
   {
      this .whitespaces ();

      if (Grammar .double .parse (this))
      {
         this .value = parseFloat (this .result [1]);

         return true;
      }

      if (Grammar .constants .parse (this))
      {
         this .value = this .CONSTANTS .get (this .result [2] .toUpperCase ());

         if (this .result [1] === "-")
            this .value = - this .value;

         return true;
      }

      return false;
   },
   vec2: function ()
   {
      if (this .double ())
      {
         this .point2 .x = this .value;

         if (this .double ())
         {
            this .point2 .y = this .value;

            return true;
         }
      }

      return false;
   },
   vec3: function ()
   {
      if (this .double ())
      {
         this .point3 .x = this .value;

         if (this .double ())
         {
            this .point3 .y = this .value;

            if (this .double ())
            {
               this .point3 .z = this .value;

               return true;
            }
         }
      }

      return false;
   },
});

function MaterialParser (scene, input)
{
   this .executionContext = scene;
   this .input            = input;
   this .material         = scene .createNode ("Material");
   this .materials        = new Map ();
   this .textures         = new Map ();
   this .color3           = new Color3 ();
   this .name             = "";
}

MaterialParser .prototype =
{
   CONSTANTS: new Map ([
      ["NAN", NaN],
      ["INF", Infinity],
      ["INFINITY", Infinity],
   ]),
   parse: function ()
   {
      try
      {
         this .statements ();
      }
      catch (error)
      {
         if (DEBUG)
            console .log (error);
      }
   },
   comments: function ()
   {
      while (this .comment ())
         ;
   },
   comment: function ()
   {
      this .whitespaces ();

      if (Grammar .comment .parse (this))
         return true;

      return false;
   },
   whitespaces: function ()
   {
      Grammar .whitespaces .parse (this);
   },
   whitespacesNoLineTerminator: function ()
   {
      Grammar .whitespacesNoLineTerminator .parse (this);
   },
   statements: function ()
   {
      while (this .statement ())
		   ;
   },
   statement: function ()
   {
      if (this .newmtl ())
         return true;

      if (this .Ka ())
         return true;

      if (this .Kd ())
         return true;

      if (this .Ks ())
         return true;

      if (this .Ns ())
         return true;

      if (this .d ())
         return true;

      if (this .Tr ())
         return true;

      if (this .illum ())
         return true;

      if (this .map_Kd ())
         return true;

      // Skip empty and unknown lines.

      if (Grammar .untilEndOfLine .parse (this))
         return true;

      return false;
   },
   newmtl: function ()
   {
      this .comments ();

      if (Grammar .newmtl .parse (this))
      {
         this .whitespacesNoLineTerminator ();

         this .name = "";

         if (Grammar .untilEndOfLine .parse (this))
         {
            this .name = this .result [1];

            this .material = this .executionContext .createNode ("Material");

            this .materials .set (this .name, this .material);

            return true;
         }

         Grammar .untilEndOfLine .parse (this);

         return true;
      }

      return false;
   },
   Ka: function ()
   {
      this .comments ();

      if (Grammar .Ka .parse (this))
      {
         if (this .col3 ())
         {
            const hsv = this .color3 .getHSV ([ ]);

            this .material .ambientIntensity = hsv [2];

            return true;
         }

         Grammar .untilEndOfLine .parse (this);

         return true;
      }

      return false;
   },
   Kd: function ()
   {
      this .comments ();

      if (Grammar .Kd .parse (this))
      {
         if (this .col3 ())
         {
            this .material .diffuseColor = this .color3;

            return true;
         }

         Grammar .untilEndOfLine .parse (this);

         return true;
      }

      return false;
   },
   Ks: function ()
   {
      this .comments ();

      if (Grammar .Ks .parse (this))
      {
         if (this .col3 ())
         {
            this .material .specularColor = this .color3;

            return true;
         }

         Grammar .untilEndOfLine .parse (this);

         return true;
      }

      return false;
   },
   Ns: function ()
   {
      this .comments ();

      if (Grammar .Ns .parse (this))
      {
         if (this .double ())
         {
            this .material .shininess = this .value / 1000;

            return true;
         }

         Grammar .untilEndOfLine .parse (this);

         return true;
      }

      return false;
   },
   d: function ()
   {
      this .comments ();

      if (Grammar .d .parse (this))
      {
         if (this .double ())
         {
            this .material .transparency = 1 - this .value;

            return true;
         }

         Grammar .untilEndOfLine .parse (this);

         return true;
      }

      return false;
   },
   Tr: function ()
   {
      this .comments ();

      if (Grammar .Tr .parse (this))
      {
         if (this .double ())
         {
            this .material .transparency = this .value;

            return true;
         }

         Grammar .untilEndOfLine .parse (this);

         return true;
      }

      return false;
   },
   illum: function ()
   {
      this .comments ();

      if (Grammar .illum .parse (this))
      {
         if (this .int32 ())
         {
            // Don't know what to do with illum value in X3D.
            return true;
         }

         Grammar .untilEndOfLine .parse (this);

         return true;
      }

      return false;
   },
   map_Kd: function ()
   {
      this .comments ();

      if (Grammar .map_Kd .parse (this))
      {
         this .whitespacesNoLineTerminator ();

         if (Grammar .untilEndOfLine .parse (this))
         {
            const string = this .result [1];

            if (string .length && this .name .length)
            {
               const paths = string .trim () .split (/\s+/);

               if (paths .length)
               {
                  const
                     scene   = this .executionContext,
                     texture = scene .createNode ("ImageTexture"),
                     path    = paths .at (-1) .replace (/\\/g, "/");

                  texture .url = [path];

                  this .textures .set (this .name, texture);
               }
            }

            return true;
         }

         Grammar .untilEndOfLine .parse (this);

         return true;
      }

      return false;
   },
   int32: function ()
   {
      this .whitespaces ();

      if (Grammar .int32 .parse (this))
      {
         this .value = parseInt (this .result [1]);

         return true;
      }

      return false;
   },
   double: function ()
   {
      this .whitespaces ();

      if (Grammar .double .parse (this))
      {
         this .value = parseFloat (this .result [1]);

         return true;
      }

      if (Grammar .constants .parse (this))
      {
         this .value = this .CONSTANTS .get (this .result [2] .toUpperCase ());

         if (this .result [1] === "-")
            this .value = - this .value;

         return true;
      }

      return false;
   },
   col3: function ()
   {
      if (this .double ())
      {
         this .color3 .r = this .value;

         if (this .double ())
         {
            this .color3 .g = this .value;

            if (this .double ())
            {
               this .color3 .b = this .value;

               return true;
            }
         }
      }

      return false;
   },
};

export default OBJParser;
