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
import Shading                 from "../../Browser/Core/Shading.js";
import X3DCast                 from "../../Base/X3DCast.js";
import X3DConstants            from "../../Base/X3DConstants.js";
import Algorithm               from "../../../standard/Math/Algorithm.js";

function Material (executionContext)
{
   X3DOneSidedMaterialNode .call (this, executionContext);

   this .addType (X3DConstants .Material);

   if (executionContext .getSpecificationVersion () <= 3.3)
      this .getMaterialKey = getMaterialKey;

   this .diffuseColor  = new Float32Array (3);
   this .specularColor = new Float32Array (3);
}

Object .assign (Object .setPrototypeOf (Material .prototype, X3DOneSidedMaterialNode .prototype),
{
   initialize ()
   {
      X3DOneSidedMaterialNode .prototype .initialize .call (this);

      this ._ambientIntensity  .addInterest ("set_ambientIntensity__",  this);
      this ._ambientTexture    .addInterest ("set_ambientTexture__",    this);
      this ._diffuseColor      .addInterest ("set_diffuseColor__",      this);
      this ._diffuseTexture    .addInterest ("set_diffuseTexture__",    this);
      this ._specularColor     .addInterest ("set_specularColor__",     this);
      this ._specularTexture   .addInterest ("set_specularTexture__",   this);
      this ._shininess         .addInterest ("set_shininess__",         this);
      this ._shininessTexture  .addInterest ("set_shininessTexture__",  this);
      this ._occlusionStrength .addInterest ("set_occlusionStrength__", this);
      this ._occlusionTexture  .addInterest ("set_occlusionTexture__",  this);

      this .set_ambientIntensity__ ();
      this .set_ambientTexture__ ();
      this .set_diffuseColor__ ();
      this .set_diffuseTexture__ ();
      this .set_specularColor__ ();
      this .set_specularTexture__ ();
      this .set_shininess__ ();
      this .set_shininessTexture__ ();
      this .set_occlusionStrength__ ();
      this .set_occlusionTexture__ ();
      this .set_transparent__ ();
   },
   set_ambientIntensity__ ()
   {
      this .ambientIntensity = Algorithm .clamp (this ._ambientIntensity .getValue (), 0, 1);
   },
   set_ambientTexture__ ()
   {
      this .ambientTextureNode = X3DCast (X3DConstants .X3DSingleTextureNode, this ._ambientTexture);

      this .setTexture (this .getTextureIndices () .AMBIENT_TEXTURE, this .ambientTextureNode);
   },
   set_diffuseColor__ ()
   {
      //We cannot use this in Windows Edge:
      //this .diffuseColor .set (this ._diffuseColor .getValue ());

      const
         diffuseColor  = this .diffuseColor,
         diffuseColor_ = this ._diffuseColor .getValue ();

      diffuseColor [0] = diffuseColor_ .r;
      diffuseColor [1] = diffuseColor_ .g;
      diffuseColor [2] = diffuseColor_ .b;
   },
   set_diffuseTexture__ ()
   {
      if (this .diffuseTextureNode)
         this .diffuseTextureNode ._transparent .removeInterest ("set_transparent__", this);

      this .diffuseTextureNode = X3DCast (X3DConstants .X3DSingleTextureNode, this ._diffuseTexture);

      if (this .diffuseTextureNode)
         this .diffuseTextureNode ._transparent .addInterest ("set_transparent__", this);

      this .setTexture (this .getTextureIndices () .DIFFUSE_TEXTURE, this .diffuseTextureNode);
   },
   set_specularColor__ ()
   {
      //We cannot use this in Windows Edge:
      //this .specularColor .set (this ._specularColor .getValue ());

      const
         specularColor  = this .specularColor,
         specularColor_ = this ._specularColor .getValue ();

      specularColor [0] = specularColor_ .r;
      specularColor [1] = specularColor_ .g;
      specularColor [2] = specularColor_ .b;
   },
   set_specularTexture__ ()
   {
      this .specularTextureNode = X3DCast (X3DConstants .X3DSingleTextureNode, this ._specularTexture);

      this .setTexture (this .getTextureIndices () .SPECULAR_TEXTURE, this .specularTextureNode);
   },
   set_shininess__ ()
   {
      this .shininess = Algorithm .clamp (this ._shininess .getValue (), 0, 1);
   },
   set_shininessTexture__ ()
   {
      this .shininessTextureNode = X3DCast (X3DConstants .X3DSingleTextureNode, this ._shininessTexture);

      this .setTexture (this .getTextureIndices () .SHININESS_TEXTURE, this .shininessTextureNode);
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
      this .setTransparent (!!(this .getTransparency () || this .diffuseTextureNode ?.isTransparent ()));
   },
   getBaseTexture ()
   {
      return this .diffuseTexture;
   },
   getTextureIndices: (() =>
   {
      let i = 0;

      const textureIndices = {
         EMISSIVE_TEXTURE: i ++,
         NORMAL_TEXTURE: i ++,
         AMBIENT_TEXTURE: i ++,
         DIFFUSE_TEXTURE: i ++,
         SPECULAR_TEXTURE: i ++,
         SHININESS_TEXTURE: i ++,
         OCCLUSION_TEXTURE: i ++,
      };

      return function ()
      {
         return textureIndices;
      };
   })(),
   getMaterialKey ()
   {
      return "2";
   },
   createShader (key, geometryContext, renderContext)
   {
      const
         browser = this .getBrowser (),
         options = this .getShaderOptions (geometryContext, renderContext);

      if (geometryContext .hasNormals)
      {
         options .push ("X3D_MATERIAL");

         if (+this .getTextureBits ())
         {
            if (this .ambientTextureNode)
               options .push ("X3D_AMBIENT_TEXTURE", `X3D_AMBIENT_TEXTURE_${this .ambientTextureNode .getTextureTypeString ()}`);

            if (this .diffuseTextureNode)
               options .push ("X3D_DIFFUSE_TEXTURE", `X3D_DIFFUSE_TEXTURE_${this .diffuseTextureNode .getTextureTypeString ()}`);

            if (this .specularTextureNode)
               options .push ("X3D_SPECULAR_TEXTURE", `X3D_SPECULAR_TEXTURE_${this .specularTextureNode .getTextureTypeString ()}`);

            if (this .shininessTextureNode)
               options .push ("X3D_SHININESS_TEXTURE", `X3D_SHININESS_TEXTURE_${this .shininessTextureNode .getTextureTypeString ()}`);

            if (this .occlusionTextureNode)
               options .push ("X3D_OCCLUSION_TEXTURE", `X3D_OCCLUSION_TEXTURE_${this .occlusionTextureNode .getTextureTypeString ()}`);
         }

         switch (this .getMaterialKey (renderContext && renderContext .shadows))
         {
            case "1":
               var shaderNode = browser .createShader ("GouraudShader", "Gouraud", "Gouraud", options);
               break;
            case "2":
               var shaderNode = browser .createShader ("PhongShader", "Default", "Phong", options);
               break;
         }
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

      gl .uniform1f  (shaderObject .x3d_AmbientIntensity, this .ambientIntensity);
      gl .uniform3fv (shaderObject .x3d_DiffuseColor,     this .diffuseColor);
      gl .uniform3fv (shaderObject .x3d_SpecularColor,    this .specularColor);
      gl .uniform1f  (shaderObject .x3d_Shininess,        this .shininess);

      if (+this .getTextureBits ())
      {
         // Ambient parameters

         if (this .ambientTextureNode)
         {
            const
               ambientTextureMapping = this ._ambientTextureMapping .getValue (),
               ambientTexture        = shaderObject .x3d_AmbientTexture;

            this .ambientTextureNode .setShaderUniforms (gl, shaderObject, renderObject, ambientTexture);

            gl .uniform1i (ambientTexture .textureTransformMapping,  textureTransformMapping  .get (ambientTextureMapping) ?? 0);
            gl .uniform1i (ambientTexture .textureCoordinateMapping, textureCoordinateMapping .get (ambientTextureMapping) ?? 0);
         }

         // Diffuse parameters

         if (this .diffuseTextureNode)
         {
            const
               diffuseTextureMapping = this ._diffuseTextureMapping .getValue (),
               diffuseTexture        = shaderObject .x3d_DiffuseTexture;

            this .diffuseTextureNode .setShaderUniforms (gl, shaderObject, renderObject, diffuseTexture);

            gl .uniform1i (diffuseTexture .textureTransformMapping,  textureTransformMapping  .get (diffuseTextureMapping) ?? 0);
            gl .uniform1i (diffuseTexture .textureCoordinateMapping, textureCoordinateMapping .get (diffuseTextureMapping) ?? 0);
         }

         // Specular parameters

         if (this .specularTextureNode)
         {
            const
               specularTextureMapping = this ._specularTextureMapping .getValue (),
               specularTexture        = shaderObject .x3d_SpecularTexture;

            this .specularTextureNode .setShaderUniforms (gl, shaderObject, renderObject, specularTexture);

            gl .uniform1i (specularTexture .textureTransformMapping,  textureTransformMapping  .get (specularTextureMapping) ?? 0);
            gl .uniform1i (specularTexture .textureCoordinateMapping, textureCoordinateMapping .get (specularTextureMapping) ?? 0);
         }

         // Shininess parameters

         if (this .shininessTextureNode)
         {
            const
               shininessTextureMapping = this ._shininessTextureMapping .getValue (),
               shininessTexture        = shaderObject .x3d_ShininessTexture;

            this .shininessTextureNode .setShaderUniforms (gl, shaderObject, renderObject, shininessTexture);

            gl .uniform1i (shininessTexture .textureTransformMapping,  textureTransformMapping  .get (shininessTextureMapping) ?? 0);
            gl .uniform1i (shininessTexture .textureCoordinateMapping, textureCoordinateMapping .get (shininessTextureMapping) ?? 0);
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

function getMaterialKey (shadows)
{
   if (shadows || +this .getTextureBits ())
   {
      return "2";
   }
   else
   {
      switch (this .getBrowser () .getBrowserOptions () .getShading ())
      {
         default:
            return "1";
         case Shading .PHONG:
            return "2";
      }
   }
}

Object .defineProperties (Material,
{
   typeName:
   {
      value: "Material",
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
      value: Object .freeze (["2.0", "Infinity"]),
      enumerable: true,
   },
   fieldDefinitions:
   {
      value: new FieldDefinitionArray ([
         new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",                 new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "ambientIntensity",         new Fields .SFFloat (0.2)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "ambientTextureMapping",    new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "ambientTexture",           new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "diffuseColor",             new Fields .SFColor (0.8, 0.8, 0.8)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "diffuseTextureMapping",    new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "diffuseTexture",           new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "specularColor",            new Fields .SFColor ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "specularTextureMapping",   new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "specularTexture",          new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "emissiveColor",            new Fields .SFColor ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "emissiveTextureMapping",   new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "emissiveTexture",          new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "shininess",                new Fields .SFFloat (0.2)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "shininessTextureMapping",  new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "shininessTexture",         new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "occlusionStrength",        new Fields .SFFloat (1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "occlusionTextureMapping",  new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "occlusionTexture",         new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "normalScale",              new Fields .SFFloat (1)),
         new X3DFieldDefinition (X3DConstants .inputOutput, "normalTextureMapping",     new Fields .SFString ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "normalTexture",            new Fields .SFNode ()),
         new X3DFieldDefinition (X3DConstants .inputOutput, "transparency",             new Fields .SFFloat ()),
      ]),
      enumerable: true,
   },
});

export default Material;
