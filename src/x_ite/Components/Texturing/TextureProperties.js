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

import Fields               from "../../Fields.js";
import X3DFieldDefinition   from "../../Base/X3DFieldDefinition.js";
import FieldDefinitionArray from "../../Base/FieldDefinitionArray.js";
import X3DNode              from "../Core/X3DNode.js";
import X3DConstants         from "../../Base/X3DConstants.js";
import Algorithm            from "../../../standard/Math/Algorithm.js";

function TextureProperties (executionContext)
{
   X3DNode .call (this, executionContext);

   this .addType (X3DConstants .TextureProperties);
}

TextureProperties .prototype = Object .assign (Object .create (X3DNode .prototype),
{
   constructor: TextureProperties,
   [Symbol .for ("X_ITE.X3DBaseNode.fieldDefinitions")]: new FieldDefinitionArray ([
      new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",            new Fields .SFNode ()),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "borderColor",         new Fields .SFColorRGBA ()),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "borderWidth",         new Fields .SFInt32 ()),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "anisotropicDegree",   new Fields .SFFloat (1)),
      new X3DFieldDefinition (X3DConstants .initializeOnly, "generateMipMaps",     new Fields .SFBool ()),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "minificationFilter",  new Fields .SFString ("FASTEST")),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "magnificationFilter", new Fields .SFString ("FASTEST")),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "boundaryModeS",       new Fields .SFString ("REPEAT")),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "boundaryModeT",       new Fields .SFString ("REPEAT")),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "boundaryModeR",       new Fields .SFString ("REPEAT")),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "textureCompression",  new Fields .SFString ("FASTEST")),
      new X3DFieldDefinition (X3DConstants .inputOutput,    "texturePriority",     new Fields .SFFloat ()),
   ]),
   getTypeName: function ()
   {
      return "TextureProperties";
   },
   getComponentName: function ()
   {
      return "Texturing";
   },
   getContainerField: function ()
   {
      return "textureProperties";
   },
   getBorderWidth: function ()
   {
      // https://stackoverflow.com/questions/27760277/webgl-border-color-shader?lq=1
      return Algorithm .clamp (this ._borderWidth .getValue (), 0, 1);
   },
   getBoundaryMode: (function ()
   {
      const boundaryModes = new Map ([
         ["CLAMP",             "CLAMP_TO_EDGE"], // "CLAMP"
         ["CLAMP_TO_EDGE",     "CLAMP_TO_EDGE"],
         ["CLAMP_TO_BOUNDARY", "CLAMP_TO_EDGE"], // "CLAMP_TO_BORDER"
         ["MIRRORED_REPEAT",   "MIRRORED_REPEAT"],
         ["REPEAT",            "REPEAT"],
      ]);

      return function (string)
      {
         const boundaryMode = boundaryModes .get (string);

         if (boundaryMode !== undefined)
            return boundaryMode;

         return "REPEAT";
      };
   })(),
   getBoundaryModeS: function ()
   {
      return this .getBoundaryMode (this ._boundaryModeS .getValue ());
   },
   getBoundaryModeT: function ()
   {
      return this .getBoundaryMode (this ._boundaryModeT .getValue ());
   },
   getBoundaryModeR: function ()
   {
      return this .getBoundaryMode (this ._boundaryModeR .getValue ());
   },
   getMinificationFilter: (function ()
   {
      const minificationFilters = new Map ([
         ["AVG_PIXEL_AVG_MIPMAP",         "LINEAR_MIPMAP_LINEAR"],
         ["AVG_PIXEL",                    "LINEAR"],
         ["AVG_PIXEL_NEAREST_MIPMAP",     "LINEAR_MIPMAP_NEAREST"],
         ["NEAREST_PIXEL_AVG_MIPMAP",     "NEAREST_MIPMAP_LINEAR"],
         ["NEAREST_PIXEL_NEAREST_MIPMAP", "NEAREST_MIPMAP_NEAREST"],
         ["NEAREST_PIXEL",                "NEAREST"],
         ["NICEST",                       "LINEAR_MIPMAP_LINEAR"],
         ["FASTEST",                      "NEAREST"],
      ]);

      return function ()
      {
         if (this ._generateMipMaps .getValue ())
         {
            const minificationFilter = minificationFilters .get (this ._minificationFilter .getValue ());

            if (minificationFilter !== undefined)
               return minificationFilter;

            return this .getBrowser () .getDefaultTextureProperties () .getMinificationFilter ();
         }

         return "LINEAR";
      };
   })(),
   getMagnificationFilter: (function ()
   {
      const magnificationFilters = new Map ([
         ["AVG_PIXEL",     "LINEAR"],
         ["NEAREST_PIXEL", "NEAREST"],
         ["NICEST",        "LINEAR"],
         ["FASTEST",       "NEAREST"],
      ]);

      return function ()
      {
         const magnificationFilter = magnificationFilters .get (this ._magnificationFilter .getValue ());

         if (magnificationFilter !== undefined)
            return magnificationFilter;

         // DEFAULT
         return this .getBrowser () .getDefaultTextureProperties () .getMagnificationFilter ();
      };
   })(),
   getTextureCompression: (function ()
   {
      const textureCompressions = new Map ([
         ["DEFAULT", "RGBA"],
         ["NICEST",  "RGBA"],
         ["FASTEST", "RGBA"],
         ["LOW",     "RGBA"],
         ["MEDIUM",  "RGBA"],
         ["HIGH",    "RGBA"],
      ]);

      return function ()
      {
         const
            browser            = this .getBrowser (),
            gl                 = browser .getContext (),
            compressedTexture  = gl .getExtension ("WEBGL_compressed_texture_etc"), // TODO: find suitable compression.
            textureCompression = compressedTexture ? compressedTexture [textureCompressions .get (this ._textureCompression .getValue ())] : undefined;

         if (textureCompression !== undefined)
            return textureCompression;

         // DEFAULT
         return gl .RGBA;
      };
   })(),
});

export default TextureProperties;
