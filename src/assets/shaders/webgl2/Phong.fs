#version 300 es

precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
precision highp samplerCube;

#pragma X3D include "include/Fragment.glsl"
#pragma X3D include "include/Material.glsl"
#pragma X3D include "include/Normal.glsl"

#if defined (X3D_AMBIENT_TEXTURE)
uniform x3d_AmbientTextureParameters x3d_AmbientTexture;
#endif

vec3
getAmbientColor (const in vec3 diffuseColor)
{
   // Get ambient parameter.

   vec3 ambientParameter = x3d_Material .ambientIntensity * diffuseColor;

   // Get texture color.

   #if defined (X3D_AMBIENT_TEXTURE)
      vec3 texCoord = getTexCoord (x3d_AmbientTexture .textureTransformMapping, x3d_AmbientTexture .textureCoordinateMapping);

      #if defined (X3D_AMBIENT_TEXTURE_2D)
         return ambientParameter * texture (x3d_AmbientTexture .texture2D, texCoord .st) .rgb;
      #elif defined (X3D_AMBIENT_TEXTURE_3D)
         return ambientParameter * texture (x3d_AmbientTexture .texture3D, texCoord) .rgb;
      #elif defined (X3D_AMBIENT_TEXTURE_CUBE)
         return ambientParameter * texture (x3d_AmbientTexture .textureCube, texCoord) .rgb;
      #endif
   #else
      return ambientParameter;
   #endif
}

#if defined (X3D_DIFFUSE_TEXTURE)
uniform x3d_DiffuseTextureParameters x3d_DiffuseTexture;
#endif

vec4
getDiffuseColor ()
{
   // Get diffuse parameter.

   float alpha            = 1.0 - x3d_Material .transparency;
   vec4  diffuseParameter = x3d_ColorMaterial ? vec4 (color .rgb, color .a * alpha) : vec4 (x3d_Material .diffuseColor, alpha);

   // Get texture color.

   #if defined (X3D_DIFFUSE_TEXTURE)
      vec3 texCoord = getTexCoord (x3d_DiffuseTexture .textureTransformMapping, x3d_DiffuseTexture .textureCoordinateMapping);

      #if defined (X3D_DIFFUSE_TEXTURE_2D)
         return diffuseParameter * texture (x3d_DiffuseTexture .texture2D, texCoord .st);
      #elif defined (X3D_DIFFUSE_TEXTURE_3D)
         return diffuseParameter * texture (x3d_DiffuseTexture .texture3D, texCoord);
      #elif defined (X3D_DIFFUSE_TEXTURE_CUBE)
         return diffuseParameter * texture (x3d_DiffuseTexture .textureCube, texCoord);
      #endif
   #else
      return getTextureColor (diffuseParameter, vec4 (x3d_Material .specularColor, alpha));
   #endif
}

#if defined (X3D_SPECULAR_TEXTURE)
uniform x3d_SpecularTextureParameters x3d_SpecularTexture;
#endif

vec3
getSpecularColor ()
{
   // Get specular parameter.

   vec3 specularParameter = x3d_Material .specularColor;

   // Get texture color.

   #if defined (X3D_SPECULAR_TEXTURE)
      vec3 texCoord = getTexCoord (x3d_SpecularTexture .textureTransformMapping, x3d_SpecularTexture .textureCoordinateMapping);

      #if defined (X3D_SPECULAR_TEXTURE_2D)
         return specularParameter * texture (x3d_SpecularTexture .texture2D, texCoord .st) .rgb;
      #elif defined (X3D_SPECULAR_TEXTURE_3D)
         return specularParameter * texture (x3d_SpecularTexture .texture3D, texCoord) .rgb;
      #elif defined (X3D_SPECULAR_TEXTURE_CUBE)
         return specularParameter * texture (x3d_SpecularTexture .textureCube, texCoord) .rgb;
      #endif
   #else
      return specularParameter;
   #endif
}

#if defined (X3D_EMISSIVE_TEXTURE)
uniform x3d_EmissiveTextureParameters x3d_EmissiveTexture;
#endif

vec3
getEmissiveColor ()
{
   // Get emissive parameter.

   vec3 emissiveParameter = x3d_Material .emissiveColor;

   // Get texture color.

   #if defined (X3D_EMISSIVE_TEXTURE)
      vec3 texCoord = getTexCoord (x3d_EmissiveTexture .textureTransformMapping, x3d_EmissiveTexture .textureCoordinateMapping);

      #if defined (X3D_EMISSIVE_TEXTURE_2D)
         return emissiveParameter * texture (x3d_EmissiveTexture .texture2D, texCoord .st) .rgb;
      #elif defined (X3D_EMISSIVE_TEXTURE_3D)
         return emissiveParameter * texture (x3d_EmissiveTexture .texture3D, texCoord) .rgb;
      #elif defined (X3D_EMISSIVE_TEXTURE_CUBE)
         return emissiveParameter * texture (x3d_EmissiveTexture .textureCube, texCoord) .rgb;
      #endif
   #else
      return emissiveParameter;
   #endif
}

#if defined (X3D_SHININESS_TEXTURE)
uniform x3d_ShininessTextureParameters x3d_ShininessTexture;
#endif

float
getShininessFactor ()
{
   // Get shininess parameter.

   float shininess = x3d_Material .shininess;

   // Get texture color.

   #if defined (X3D_SHININESS_TEXTURE)
      vec3 texCoord = getTexCoord (x3d_ShininessTexture .textureTransformMapping, x3d_ShininessTexture .textureCoordinateMapping);

      #if defined (X3D_SHININESS_TEXTURE_2D)
         return shininess * texture (x3d_ShininessTexture .texture2D, texCoord .st) .a;
      #elif defined (X3D_SHININESS_TEXTURE_3D)
         return shininess * texture (x3d_ShininessTexture .texture3D, texCoord) .a;
      #elif defined (X3D_SHININESS_TEXTURE_CUBE)
         return shininess * texture (x3d_ShininessTexture .textureCube, texCoord) .a;
      #endif
   #else
      return shininess;
   #endif
}

#if defined (X3D_OCCLUSION_TEXTURE)
uniform x3d_OcclusionTextureParameters x3d_OcclusionTexture;
#endif

float
getOcclusionFactor ()
{
   // Get texture color.

   #if defined (X3D_OCCLUSION_TEXTURE)
      vec3 texCoord = getTexCoord (x3d_OcclusionTexture .textureTransformMapping, x3d_OcclusionTexture .textureCoordinateMapping);

      #if defined (X3D_OCCLUSION_TEXTURE_2D)
         return texture (x3d_OcclusionTexture .texture2D, texCoord .st) .r;
      #elif defined (X3D_OCCLUSION_TEXTURE_3D)
         return texture (x3d_OcclusionTexture .texture3D, texCoord) .r;
      #elif defined (X3D_OCCLUSION_TEXTURE_CUBE)
         return texture (x3d_OcclusionTexture .textureCube, texCoord) .r;
      #endif
   #else
      return 1.0;
   #endif
}

vec4
getMaterialColor ()
{
   #if defined (X3D_NORMALS)
      // Calculate diffuseColor & alpha

      vec4  diffuseColorAlpha = getDiffuseColor ();
      float alpha             = diffuseColorAlpha .a;
      vec3  diffuseColor      = diffuseColorAlpha .rgb;
      vec3  ambientColor      = getAmbientColor (diffuseColor);
      vec3  specularColor     = getSpecularColor ();
      float shininess         = getShininessFactor ();
      float normalScale       = x3d_Material .normalScale;

      // Projective texture

      vec4 P = getProjectiveTextureColor (vec4 (1.0));

      diffuseColor *= P .rgb;
      alpha        *= P .a;

      vec3 finalColor = getMaterialColor (vertex, getNormalVector (normalScale), ambientColor, diffuseColor, specularColor, shininess);

      #if defined (X3D_OCCLUSION_TEXTURE)
      finalColor = mix (finalColor, finalColor * getOcclusionFactor (), x3d_Material .occlusionStrength);
      #endif

      finalColor += getEmissiveColor ();

      return vec4 (finalColor, alpha);
   #else
      float alpha      = 1.0 - x3d_Material .transparency;
      vec3  finalColor = vec3 (0.0);

      if (x3d_ColorMaterial)
      {
         finalColor  = color .rgb;
         alpha      *= color .a;
      }
      else
      {
         finalColor = getEmissiveColor ();
      }

      return vec4 (finalColor, alpha);
   #endif
}

void
main ()
{
   fragment_main ();
}
