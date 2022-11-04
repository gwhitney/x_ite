/* -*- Mode: JavaScript; coding: utf-8; tab-width: 3; indent-tabs-mode: tab; c-basic-offset: 3 -*-
 *******************************************************************************
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Copyright create3000, ScheffelstraÃe 31a, Leipzig, Germany 2011.
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
   "x_ite/Components/VolumeRendering/X3DComposableVolumeRenderStyleNode",
   "x_ite/Base/X3DConstants",
   "x_ite/Base/X3DCast",
],
function (Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DComposableVolumeRenderStyleNode,
          X3DConstants,
          X3DCast)
{
"use strict";

   function OpacityMapVolumeStyle (executionContext)
   {
      X3DComposableVolumeRenderStyleNode .call (this, executionContext);

      this .addType (X3DConstants .OpacityMapVolumeStyle);
   }

   OpacityMapVolumeStyle .prototype = Object .assign (Object .create (X3DComposableVolumeRenderStyleNode .prototype),
   {
      constructor: OpacityMapVolumeStyle,
      [Symbol .for ("X_ITE.X3DBaseNode.fieldDefinitions")]: new FieldDefinitionArray ([
         new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",          new Fields .SFBool (true)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",         new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "transferFunction", new Fields .SFNode ()),
      ]),
      getTypeName: function ()
      {
         return "OpacityMapVolumeStyle";
      },
      getComponentName: function ()
      {
         return "VolumeRendering";
      },
      getContainerField: function ()
      {
         return "renderStyle";
      },
      initialize: function ()
      {
         X3DComposableVolumeRenderStyleNode .prototype .initialize .call (this);

         const gl = this .getBrowser () .getContext ();

         if (gl .getVersion () < 2)
            return;

         this ._transferFunction .addInterest ("set_transferFunction__", this);

         this .set_transferFunction__ ();
      },
      set_transferFunction__: function ()
      {
         this .transferFunctionNode = X3DCast (X3DConstants .X3DTexture2DNode, this ._transferFunction);

         if (! this .transferFunctionNode)
            this .transferFunctionNode = X3DCast (X3DConstants .X3DTexture3DNode, this ._transferFunction);

         if (! this .transferFunctionNode)
            this .transferFunctionNode = this .getBrowser () .getDefaultTransferFunction ();
      },
      addShaderFields: function (shaderNode)
      {
         if (! this ._enabled .getValue ())
            return;

         shaderNode .addUserDefinedField (X3DConstants .inputOutput, "transferFunction_" + this .getId (), new Fields .SFNode (this .transferFunctionNode));
      },
      getUniformsText: function ()
      {
         if (! this ._enabled .getValue ())
            return "";

         let string = "";

         string += "\n";
         string += "// OpacityMapVolumeStyle\n";
         string += "\n";

         if (this .transferFunctionNode .getType () .includes (X3DConstants .X3DTexture2DNode))
         {
            string += "uniform sampler2D transferFunction_" + this .getId () + ";\n";

            string += "\n";
            string += "vec4\n";
            string += "getOpacityMapStyle_" + this .getId () + " (in vec4 originalColor)\n";
            string += "{\n";
            string += "   return texture (transferFunction_" + this .getId () + ", originalColor .rg);\n";
            string += "}\n";
         }
         else
         {
            string += "uniform sampler3D transferFunction_" + this .getId () + ";\n";

            string += "\n";
            string += "vec4\n";
            string += "getOpacityMapStyle_" + this .getId () + " (in vec4 originalColor)\n";
            string += "{\n";
            string += "   return texture (transferFunction_" + this .getId () + ", originalColor .rgb);\n";
            string += "}\n";
         }

         return string;
      },
      getFunctionsText: function ()
      {
         if (! this ._enabled .getValue ())
            return "";

         let string = "";

         string += "\n";
         string += "   // OpacityMapVolumeStyle\n";
         string += "\n";
         string += "   textureColor = getOpacityMapStyle_" + this .getId () + " (textureColor);\n";

         return string;
      },
   });

   return OpacityMapVolumeStyle;
});
