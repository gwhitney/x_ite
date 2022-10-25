/* -*- Mode: JavaScript; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
 *******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright create3000, Scheffelstraße 31a, Leipzig, Germany 2011.
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
 * Copyright 2015, 2016 Holger Seelig <holger.seelig@yahoo.de>.
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
 * along with X_ITE.  If not, see <http://www.gnu.org/licenses/gpl.html> for a
 * copy of the GPLv3 License.
 *
 * For Silvio, Joy and Adi.
 *
 ******************************************************************************/


define ([
   "x_ite/Fields",
   "x_ite/Base/X3DFieldDefinition",
   "x_ite/Base/FieldDefinitionArray",
   "x_ite/Components/Rendering/X3DLineGeometryNode",
   "x_ite/Base/X3DCast",
   "x_ite/Base/X3DConstants",
],
function (Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DLineGeometryNode,
          X3DCast,
          X3DConstants)
{
"use strict";

   function IndexedLineSet (executionContext)
   {
      X3DLineGeometryNode .call (this, executionContext);

      this .addType (X3DConstants .IndexedLineSet);

      this .fogCoordNode = null;
      this .colorNode    = null;
      this .normalNode   = null;
      this .coordNode    = null;
   }

   IndexedLineSet .prototype = Object .assign (Object .create (X3DLineGeometryNode .prototype),
   {
      constructor: IndexedLineSet,
      [Symbol .for ("X_ITE.X3DBaseNode.fieldDefinitions")]: new FieldDefinitionArray ([
         new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOnly,      "set_colorIndex", new Fields .MFInt32 ()),
         new X3DFieldDefinition (X3DConstants .inputOnly,      "set_coordIndex", new Fields .MFInt32 ()),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "colorPerVertex", new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "colorIndex",     new Fields .MFInt32 ()),
         new X3DFieldDefinition (X3DConstants .initializeOnly, "coordIndex",     new Fields .MFInt32 ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "attrib",         new Fields .MFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "fogCoord",       new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "color",          new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "normal",         new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput,    "coord",          new Fields .SFNode ()),
      ]),
      getTypeName: function ()
      {
         return "IndexedLineSet";
      },
      getComponentName: function ()
      {
         return "Rendering";
      },
      getContainerField: function ()
      {
         return "geometry";
      },
      initialize: function ()
      {
         X3DLineGeometryNode .prototype .initialize .call (this);

         this ._set_colorIndex .addFieldInterest (this ._colorIndex);
         this ._set_coordIndex .addFieldInterest (this ._coordIndex);
         this ._attrib         .addInterest ("set_attrib__",   this);
         this ._fogCoord       .addInterest ("set_fogCoord__", this);
         this ._color          .addInterest ("set_color__",    this);
         this ._normal         .addInterest ("set_normal__",   this);
         this ._coord          .addInterest ("set_coord__",    this);

         this .set_attrib__ ();
         this .set_fogCoord__ ();
         this .set_color__ ();
         this .set_normal__ ();
         this .set_coord__ ();
      },
      set_attrib__: function ()
      {
         const attribNodes = this .getAttrib ();

         for (const attribNode of attribNodes)
         {
            attribNode .removeInterest ("requestRebuild", this);
            attribNode ._attribute_changed .removeInterest ("updateVertexArrays", this);
         }

         attribNodes .length = 0;

         for (const node of this ._attrib)
         {
            const attribNode = X3DCast (X3DConstants .X3DVertexAttributeNode, node);

            if (attribNode)
               attribNodes .push (attribNode);
         }

         for (const attribNode of attribNodes)
         {
            attribNode .addInterest ("requestRebuild", this);
            attribNode ._attribute_changed .addInterest ("updateVertexArrays", this);
         }

         this .updateVertexArrays ();
      },
      set_fogCoord__: function ()
      {
         if (this .fogCoordNode)
            this .fogCoordNode .removeInterest ("requestRebuild", this);

         this .fogCoordNode = X3DCast (X3DConstants .FogCoordinate, this ._fogCoord);

         if (this .fogCoordNode)
            this .fogCoordNode .addInterest ("requestRebuild", this);
      },
      set_color__: function ()
      {
         if (this .colorNode)
         {
            this .colorNode .removeInterest ("requestRebuild", this);
            this .colorNode ._transparent .removeInterest ("set_transparent__", this);
         }

         this .colorNode = X3DCast (X3DConstants .X3DColorNode, this ._color);

         if (this .colorNode)
         {
            this .colorNode .addInterest ("requestRebuild", this);
            this .colorNode ._transparent .addInterest ("set_transparent__", this);

            this .set_transparent__ ();
         }
         else
            this .setTransparent (false);
      },
      set_transparent__: function ()
      {
         this .setTransparent (this .colorNode .getTransparent ());
      },
      set_normal__: function ()
      {
         if (this .normalNode)
            this .normalNode .removeInterest ("requestRebuild", this);

         this .normalNode = X3DCast (X3DConstants .X3DNormalNode, this ._normal);

         if (this .normalNode)
            this .normalNode .addInterest ("requestRebuild", this);
      },
      set_coord__: function ()
      {
         if (this .coordNode)
            this .coordNode .removeInterest ("requestRebuild", this);

         this .coordNode = X3DCast (X3DConstants .X3DCoordinateNode, this ._coord);

         if (this .coordNode)
            this .coordNode .addInterest ("requestRebuild", this);
      },
      getColorPerVertexIndex: function (index)
      {
         if (index < this ._colorIndex .length)
            return this ._colorIndex [index];

         return this ._coordIndex [index];
      },
      getColorIndex: function (index)
      {
         if (index < this ._colorIndex .length)
            return this ._colorIndex [index];

         return index;
      },
      getPolylineIndices: function ()
      {
         const
            coordIndex = this ._coordIndex,
            polylines  = [ ];

         let polyline = [ ];

         if (coordIndex .length)
         {
            for (let i = 0, length = coordIndex .length; i < length; ++ i)
            {
               const index = coordIndex [i];

               if (index >= 0)
                  // Add vertex.
                  polyline .push (i);

               else
               {
                  // Negativ index.
                  // Add polylines.
                  polylines .push (polyline);

                  polyline = [ ];
               }
            }

            if (coordIndex [coordIndex .length - 1] >= 0)
            {
               polylines .push (polyline);
            }
         }

         return polylines;
      },
      build: function ()
      {
         if (! this .coordNode || this .coordNode .isEmpty ())
            return;

         const
            coordIndex     = this ._coordIndex,
            polylines      = this .getPolylineIndices (),
            colorPerVertex = this ._colorPerVertex .getValue (),
            attribNodes    = this .getAttrib (),
            numAttribNodes = attribNodes .length,
            attribArrays   = this .getAttribs (),
            fogCoordNode   = this .fogCoordNode,
            colorNode      = this .colorNode,
            coordNode      = this .coordNode,
            fogDepthArray  = this .getFogDepths (),
            colorArray     = this .getColors (),
            vertexArray    = this .getVertices ();

         // Fill GeometryNode

         let face = 0;

         for (const polyline of polylines)
         {
            // Create two vertices for each line.

            if (polyline .length > 1)
            {
               for (let line = 0, l_end = polyline .length - 1; line < l_end; ++ line)
               {
                  for (let l = line, i_end = line + 2; l < i_end; ++ l)
                  {
                     const
                        i     = polyline [l],
                        index = coordIndex [i];

                     for (let a = 0; a < numAttribNodes; ++ a)
                        attribNodes [a] .addValue (index, attribArrays [a]);

                     if (fogCoordNode)
                        fogCoordNode .addDepth (index, fogDepthArray);

                     if (colorNode)
                     {
                        if (colorPerVertex)
                           colorNode .addColor (this .getColorPerVertexIndex (i), colorArray);
                        else
                           colorNode .addColor (this .getColorIndex (face), colorArray);
                     }

                     coordNode .addPoint (index, vertexArray);
                  }
               }
            }

            ++ face;
         }
      },
   });

   return IndexedLineSet;
});
