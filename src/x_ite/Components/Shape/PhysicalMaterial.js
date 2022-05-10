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
   "x_ite/Components/Shape/X3DOneSidedMaterialNode",
   "x_ite/Base/X3DCast",
   "x_ite/Base/X3DConstants",
   "standard/Math/Algorithm",
],
function (Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DOneSidedMaterialNode,
          X3DCast,
          X3DConstants,
          Algorithm)
{
"use strict";

   function PhysicalMaterial (executionContext)
   {
      X3DOneSidedMaterialNode .call (this, executionContext);

      this .addType (X3DConstants .PhysicalMaterial);

      this .baseColor = new Float32Array (3);
   }

   PhysicalMaterial .prototype = Object .assign (Object .create (X3DOneSidedMaterialNode .prototype),
   {
      constructor: PhysicalMaterial,
      [Symbol .for ("X_ITE.X3DBaseNode.fieldDefinitions")]: new FieldDefinitionArray ([
         new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",                        new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "baseColor",                       new Fields .SFColor (1, 1, 1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "baseTexture",                     new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "baseTextureMapping",              new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "emissiveColor",                   new Fields .SFColor (0, 0, 0)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "emissiveTexture",                 new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "emissiveTextureMapping",          new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "metallic",                        new Fields .SFFloat (1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "roughness",                       new Fields .SFFloat (1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "metallicRoughnessTexture",        new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "metallicRoughnessTextureMapping", new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "occlusionStrength",               new Fields .SFFloat (1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "occlusionTexture",                new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "occlusionTextureMapping",         new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "normalScale",                     new Fields .SFFloat (1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "normalTexture",                   new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "normalTextureMapping",            new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "transparency",                    new Fields .SFFloat ()),
      ]),
      getTypeName: function ()
      {
         return "PhysicalMaterial";
      },
      getComponentName: function ()
      {
         return "Shape";
      },
      getContainerField: function ()
      {
         return "material";
      },
      initialize: function ()
      {
         X3DOneSidedMaterialNode .prototype .initialize .call (this);

         this .shaderNode = this .getBrowser () .getPhysicalMaterialShader ();

         this ._baseColor                .addInterest ("set_baseColor__",                this);
         this ._baseTexture              .addInterest ("set_baseTexture__",              this);
         this ._metallic                 .addInterest ("set_metallic__",                 this);
         this ._roughness                .addInterest ("set_roughness__",                this);
         this ._metallicRoughnessTexture .addInterest ("set_metallicRoughnessTexture__", this);
         this ._occlusionStrength        .addInterest ("set_occlusionStrength__",        this);
         this ._occlusionTexture         .addInterest ("set_occlusionTexture__",         this);

         this .set_baseColor__ ();
         this .set_baseTexture__ ();
         this .set_metallic__ ();
         this .set_roughness__ ();
         this .set_metallicRoughnessTexture__ ();
         this .set_occlusionStrength__ ();
         this .set_occlusionTexture__ ();
         this .set_transparent__ ();
      },
      set_baseColor__: function ()
      {
         //We cannot use this in Windows Edge:
         //this .baseColor .set (this ._baseColor .getValue ());

         const
            baseColor  = this .baseColor,
            baseColor_ = this ._baseColor .getValue ();

         baseColor [0] = baseColor_ .r;
         baseColor [1] = baseColor_ .g;
         baseColor [2] = baseColor_ .b;
      },
      set_baseTexture__: function ()
      {
         if (this .baseTextureNode)
            this .baseTextureNode ._transparent .removeInterest ("set_transparent__", this);

         this .baseTextureNode = X3DCast (X3DConstants .X3DSingleTextureNode, this ._baseTexture);

         this .setTexture (this .getTextureIndices () .BASE_TEXTURE, this .baseTextureNode);

         if (this .baseTextureNode)
            this .baseTextureNode ._transparent .addInterest ("set_transparent__", this);
      },
      set_metallic__: function ()
      {
         this .metallic = Algorithm .clamp (this ._metallic .getValue (), 0, 1);
      },
      set_roughness__: function ()
      {
         this .roughness = Algorithm .clamp (this ._roughness .getValue (), 0, 1);
      },
      set_metallicRoughnessTexture__: function ()
      {
         this .metallicRoughnessTextureNode = X3DCast (X3DConstants .X3DSingleTextureNode, this ._metallicRoughnessTexture);

         this .setTexture (this .getTextureIndices () .METALLIC_ROUGHNESS_TEXTURE, this .metallicRoughnessTextureNode);
      },
      set_occlusionStrength__: function ()
      {
         this .occlusionStrength = Algorithm .clamp (this ._occlusionStrength .getValue (), 0, 1);
      },
      set_occlusionTexture__: function ()
      {
         this .occlusionTextureNode = X3DCast (X3DConstants .X3DSingleTextureNode, this ._occlusionTexture);

         this .setTexture (this .getTextureIndices () .OCCLUSION_TEXTURE, this .occlusionTextureNode);
      },
      set_transparent__: function ()
      {
         this .setTransparent (Boolean (this .getTransparency () ||
                               (this .baseTextureNode && this .baseTextureNode .getTransparent ())));
      },
      set_textures__: function ()
      {
         const browser = this .getBrowser ();

         if (this .getTextures ())
         {
            const options = ["X3D_MATERIAL_TEXTURES"];

            if (this .baseTextureNode)
               options .push ("X3D_BASE_TEXTURE", "X3D_BASE_TEXTURE_" + this .baseTextureNode .getTextureTypeString ());

            if (this .getEmissiveTexture ())
               options .push ("X3D_EMISSIVE_TEXTURE", "X3D_EMISSIVE_TEXTURE_" + this .getEmissiveTexture () .getTextureTypeString ());

            if (this .metallicRoughnessTextureNode)
               options .push ("X3D_METALLIC_ROUGHNESS_TEXTURE", "X3D_METALLIC_ROUGHNESS_TEXTURE_" + this .metallicRoughnessTextureNode .getTextureTypeString ());

            if (this .occlusionTextureNode)
               options .push ("X3D_OCCLUSION_TEXTURE", "X3D_OCCLUSION_TEXTURE_" + this .occlusionTextureNode .getTextureTypeString ());

            if (this .getNormalTexture ())
               options .push ("X3D_NORMAL_TEXTURE", "X3D_NORMAL_TEXTURE_" + this .getNormalTexture () .getTextureTypeString ());

            const shaderNode = browser .createShader ("PhysicalMaterialTexturesShader", "PBR", options);

            shaderNode._isValid .addInterest ("set_shader__", this, shaderNode);
         }
         else
         {
            this .shaderNode = browser .getPhysicalMaterialShader ();
         }
      },
      set_shader__: function (shaderNode)
      {
         shaderNode ._isValid .removeInterest ("set_shader__", this);

         this .shaderNode = shaderNode;
      },
      getTextureIndices: (function ()
      {
         const textureIndices = {
            BASE_TEXTURE: 0,
            EMISSIVE_TEXTURE: 1,
            METALLIC_ROUGHNESS_TEXTURE: 2,
            OCCLUSION_TEXTURE: 3,
            NORMAL_TEXTURE: 4,
         };

         return function ()
         {
            return textureIndices;
         };
      })(),
      getShader: function (browser, shadow)
      {
         return this .shaderNode;
      },
      setShaderUniforms: function (gl, shaderObject, renderObject, textureTransformMapping, textureCoordinateMapping)
      {
         X3DOneSidedMaterialNode .prototype .setShaderUniforms .call (this, gl, shaderObject, renderObject, textureTransformMapping, textureCoordinateMapping);

         gl .uniform3fv (shaderObject .x3d_BaseColor, this .baseColor);
         gl .uniform1f  (shaderObject .x3d_Metallic,  this .metallic);
         gl .uniform1f  (shaderObject .x3d_Roughness, this .roughness);

         if (this .getTextures ())
         {
            const
               baseTexture              = shaderObject .x3d_BaseTexture,
               metallicRoughnessTexture = shaderObject .x3d_MetallicRoughnessTexture,
               occlusionTexture         = shaderObject .x3d_OcclusionTexture;

            // Base parameters

            if (this .baseTextureNode)
            {
               this .baseTextureNode .setShaderUniformsToChannel (gl, shaderObject, renderObject, baseTexture);

               gl .uniform1i (baseTexture .textureTransformMapping,  textureTransformMapping  .get (this ._baseTextureMapping .getValue ()) || 0);
               gl .uniform1i (baseTexture .textureCoordinateMapping, textureCoordinateMapping .get (this ._baseTextureMapping .getValue ()) || 0);
            }

            // Metallic roughness parameters

            if (this .metallicRoughnessTextureNode)
            {
               this .metallicRoughnessTextureNode .setShaderUniformsToChannel (gl, shaderObject, renderObject, metallicRoughnessTexture);

               gl .uniform1i (metallicRoughnessTexture .textureTransformMapping,  textureTransformMapping  .get (this ._metallicRoughnessTextureMapping .getValue ()) || 0);
               gl .uniform1i (metallicRoughnessTexture .textureCoordinateMapping, textureCoordinateMapping .get (this ._metallicRoughnessTextureMapping .getValue ()) || 0);
            }

            // Occlusion parameters

            if (this .occlusionTextureNode)
            {
               gl .uniform1f (shaderObject .x3d_OcclusionStrength, this .occlusionStrength);

               this .occlusionTextureNode .setShaderUniformsToChannel (gl, shaderObject, renderObject, occlusionTexture);

               gl .uniform1i (occlusionTexture .textureTransformMapping,  textureTransformMapping  .get (this ._occlusionTextureMapping .getValue ()) || 0);
               gl .uniform1i (occlusionTexture .textureCoordinateMapping, textureCoordinateMapping .get (this ._occlusionTextureMapping .getValue ()) || 0);
            }
         }
      },
   });

   return PhysicalMaterial;
});
