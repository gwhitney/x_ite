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

import Fields                  from "../../Fields.js";
import X3DFieldDefinition      from "../../Base/X3DFieldDefinition.js";
import FieldDefinitionArray    from "../../Base/FieldDefinitionArray.js";
import X3DOneSidedMaterialNode from "./X3DOneSidedMaterialNode.js";
import X3DCast                 from "../../Base/X3DCast.js";
import X3DConstants            from "../../Base/X3DConstants.js";
import Algorithm               from "../../../standard/Math/Algorithm.js";

function PhysicalMaterial (executionContext)
{
   X3DOneSidedMaterialNode .call (this, executionContext);

   this .addType (X3DConstants .PhysicalMaterial);

   this .baseColor = new Float32Array (3);
}

Object .assign (Object .setPrototypeOf (PhysicalMaterial .prototype, X3DOneSidedMaterialNode .prototype),
{
   initialize ()
   {
      X3DOneSidedMaterialNode .prototype .initialize .call (this);

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
   set_baseColor__ ()
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
   set_baseTexture__ ()
   {
      if (this .baseTextureNode)
         this .baseTextureNode ._transparent .removeInterest ("set_transparent__", this);

      this .baseTextureNode = X3DCast (X3DConstants .X3DSingleTextureNode, this ._baseTexture);

      this .setTexture (this .getTextureIndices () .BASE_TEXTURE, this .baseTextureNode);

      if (this .baseTextureNode)
         this .baseTextureNode ._transparent .addInterest ("set_transparent__", this);
   },
   set_metallic__ ()
   {
      this .metallic = Algorithm .clamp (this ._metallic .getValue (), 0, 1);
   },
   set_roughness__ ()
   {
      this .roughness = Algorithm .clamp (this ._roughness .getValue (), 0, 1);
   },
   set_metallicRoughnessTexture__ ()
   {
      this .metallicRoughnessTextureNode = X3DCast (X3DConstants .X3DSingleTextureNode, this ._metallicRoughnessTexture);

      this .setTexture (this .getTextureIndices () .METALLIC_ROUGHNESS_TEXTURE, this .metallicRoughnessTextureNode);
   },
   set_occlusionStrength__ ()
   {
      this .occlusionStrength = Algorithm .clamp (this ._occlusionStrength .getValue (), 0, 1);
   },
   set_occlusionTexture__ ()
   {
      this .occlusionTextureNode = X3DCast (X3DConstants .X3DSingleTextureNode, this ._occlusionTexture);

      this .setTexture (this .getTextureIndices () .OCCLUSION_TEXTURE, this .occlusionTextureNode);
   },
   set_transparent__ ()
   {
      this .setTransparent (!!(this .getTransparency () || this .baseTextureNode ?.isTransparent ()));
   },
   getBaseTexture ()
   {
      return this .baseTextureNode;
   },
   getTextureIndices: (() =>
   {
      let i = 0;

      const textureIndices = {
         EMISSIVE_TEXTURE: i ++,
         NORMAL_TEXTURE:  i ++,
         BASE_TEXTURE: i ++,
         METALLIC_ROUGHNESS_TEXTURE: i ++,
         OCCLUSION_TEXTURE:  i ++,
      };

      return function ()
      {
         return textureIndices;
      };
   })(),
   getMaterialKey ()
   {
      return "3";
   },
   createShader (key, geometryContext, renderContext)
   {
      const
         browser = this .getBrowser (),
         options = this .getShaderOptions (geometryContext, renderContext);

      if (geometryContext .hasNormals)
      {
         options .push ("X3D_PHYSICAL_MATERIAL", "MANUAL_SRGB");

         if (+this .getTextureBits ())
         {
            if (this .baseTextureNode)
               options .push ("X3D_BASE_TEXTURE", `X3D_BASE_TEXTURE_${this .baseTextureNode .getTextureTypeString ()}`);

            if (this .metallicRoughnessTextureNode)
               options .push ("X3D_METALLIC_ROUGHNESS_TEXTURE", `X3D_METALLIC_ROUGHNESS_TEXTURE_${this .metallicRoughnessTextureNode .getTextureTypeString ()}`);

            if (this .occlusionTextureNode)
               options .push ("X3D_OCCLUSION_TEXTURE", `X3D_OCCLUSION_TEXTURE_${this .occlusionTextureNode .getTextureTypeString ()}`);
         }

         var shaderNode = browser .createShader ("PBRShader", "Default", "PBR", options);
      }
      else
      {
         options .push ("X3D_UNLIT_MATERIAL");

         var shaderNode = browser .createShader ("UnlitShader", "Default", "Unlit", options);

         browser .getShaders () .set (key .replace (/^(\d{1,2})\d*/, "$1") .replace (/\d$/, "0"), shaderNode);
      }

      browser .getShaders () .set (key, shaderNode);

      return shaderNode;
   },
   setShaderUniforms (gl, shaderObject, renderObject, textureTransformMapping, textureCoordinateMapping)
   {
      X3DOneSidedMaterialNode .prototype .setShaderUniforms .call (this, gl, shaderObject, renderObject, textureTransformMapping, textureCoordinateMapping);

      gl .uniform3fv (shaderObject .x3d_BaseColor, this .baseColor);
      gl .uniform1f  (shaderObject .x3d_Metallic,  this .metallic);
      gl .uniform1f  (shaderObject .x3d_Roughness, this .roughness);

      if (+this .getTextureBits ())
      {
         // Base parameters

         if (this .baseTextureNode)
         {
            const
               baseTextureMapping = this ._baseTextureMapping .getValue (),
               baseTexture        = shaderObject .x3d_BaseTexture;

            this .baseTextureNode .setShaderUniforms (gl, shaderObject, renderObject, baseTexture);

            gl .uniform1i (baseTexture .textureTransformMapping,  textureTransformMapping  .get (baseTextureMapping) ?? 0);
            gl .uniform1i (baseTexture .textureCoordinateMapping, textureCoordinateMapping .get (baseTextureMapping) ?? 0);
         }

         // Metallic roughness parameters

         if (this .metallicRoughnessTextureNode)
         {
            const
               metallicRoughnessTextureMapping = this ._metallicRoughnessTextureMapping .getValue (),
               metallicRoughnessTexture        = shaderObject .x3d_MetallicRoughnessTexture;

            this .metallicRoughnessTextureNode .setShaderUniforms (gl, shaderObject, renderObject, metallicRoughnessTexture);

            gl .uniform1i (metallicRoughnessTexture .textureTransformMapping,  textureTransformMapping  .get (metallicRoughnessTextureMapping) ?? 0);
            gl .uniform1i (metallicRoughnessTexture .textureCoordinateMapping, textureCoordinateMapping .get (metallicRoughnessTextureMapping) ?? 0);
         }

         // Occlusion parameters

         if (this .occlusionTextureNode)
         {
            const
               occlusionTextureMapping = this ._occlusionTextureMapping .getValue (),
               occlusionTexture        = shaderObject .x3d_OcclusionTexture;

            gl .uniform1f (shaderObject .x3d_OcclusionStrength, this .occlusionStrength);

            this .occlusionTextureNode .setShaderUniforms (gl, shaderObject, renderObject, occlusionTexture);

            gl .uniform1i (occlusionTexture .textureTransformMapping,  textureTransformMapping  .get (occlusionTextureMapping) ?? 0);
            gl .uniform1i (occlusionTexture .textureCoordinateMapping, textureCoordinateMapping .get (occlusionTextureMapping) ?? 0);
         }
      }
   },
});

Object .defineProperties (PhysicalMaterial,
{
   typeName:
   {
      value: "PhysicalMaterial",
      enumerable: true,
   },
   componentName:
   {
      value: "Shape",
      enumerable: true,
   },
   containerField:
   {
      value: "material",
      enumerable: true,
   },
   specificationRange:
   {
      value: Object .freeze (["4.0", "Infinity"]),
      enumerable: true,
   },
   fieldDefinitions:
   {
      value: new FieldDefinitionArray ([
         new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",                        new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "baseColor",                       new Fields .SFColor (1, 1, 1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "baseTextureMapping",              new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "baseTexture",                     new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "emissiveColor",                   new Fields .SFColor ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "emissiveTextureMapping",          new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "emissiveTexture",                 new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "metallic",                        new Fields .SFFloat (1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "roughness",                       new Fields .SFFloat (1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "metallicRoughnessTextureMapping", new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "metallicRoughnessTexture",        new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "occlusionStrength",               new Fields .SFFloat (1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "occlusionTextureMapping",         new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "occlusionTexture",                new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "normalScale",                     new Fields .SFFloat (1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "normalTextureMapping",            new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "normalTexture",                   new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "transparency",                    new Fields .SFFloat ()),
      ]),
      enumerable: true,
   },
});

export default PhysicalMaterial;
