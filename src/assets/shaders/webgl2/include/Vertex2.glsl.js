export default /* glsl */ `
// Uniforms

uniform mat4 x3d_ProjectionMatrix;
uniform mat4 x3d_ModelViewMatrix;

// Attributes

#if defined (X3D_GEOMETRY_1D) && defined (X3D_STYLE_PROPERTIES)
   in vec3 x3d_LineStipple;
#endif

#if defined (X3D_FOG) && defined (X3D_FOG_COORDS)
   in float x3d_FogDepth;
#endif

#if defined (X3D_COLOR_MATERIAL)
   in vec4 x3d_Color;
#endif

#if ! defined (X3D_GEOMETRY_0D) && ! defined (X3D_GEOMETRY_1D)
   #if defined (X3D_TEXTURE) || defined (X3D_MATERIAL_TEXTURES)
      #if X3D_NUM_TEXTURE_COORDINATES > 0
         in vec4 x3d_TexCoord0;
      #endif

      #if X3D_NUM_TEXTURE_COORDINATES > 1
         in vec4 x3d_TexCoord1;
      #endif

      #if X3D_NUM_TEXTURE_COORDINATES > 2
         in vec4 x3d_TexCoord2;
      #endif

      #if X3D_NUM_TEXTURE_COORDINATES > 3
         in vec4 x3d_TexCoord3;
      #endif
   #endif
#endif

in vec4 x3d_Vertex;

// Varyings

#if defined (X3D_FOG) && defined (X3D_FOG_COORDS)
   out float fogDepth;
#endif

#if defined (X3D_COLOR_MATERIAL)
   out vec4 color;
#endif

#if ! defined (X3D_GEOMETRY_0D) && ! defined (X3D_GEOMETRY_1D)
   #if defined (X3D_TEXTURE) || defined (X3D_MATERIAL_TEXTURES)
      #if X3D_NUM_TEXTURE_COORDINATES > 0
         out vec4 texCoord0;
      #endif

      #if X3D_NUM_TEXTURE_COORDINATES > 1
         out vec4 texCoord1;
      #endif

      #if X3D_NUM_TEXTURE_COORDINATES > 2
         out vec4 texCoord2;
      #endif

      #if X3D_NUM_TEXTURE_COORDINATES > 3
         out vec4 texCoord3;
      #endif
   #endif
#endif

#if defined (X3D_NORMALS)
   uniform mat3 x3d_NormalMatrix;
   in  vec3 x3d_Normal;
   out vec3 normal;

   #if defined (X3D_TEXTURE) || defined (X3D_MATERIAL_TEXTURES)
      out vec3 localNormal;
   #endif
#endif

#if defined (X3D_GEOMETRY_1D) && defined (X3D_STYLE_PROPERTIES)
   flat out float lengthSoFar;
   flat out vec2  startPoint;
   out vec2       midPoint;
#endif

out vec3 vertex;

#if defined (X3D_TEXTURE) || defined (X3D_MATERIAL_TEXTURES)
   out vec3 localVertex;
#endif

#if defined (X3D_LOGARITHMIC_DEPTH_BUFFER)
   out float depth;
#endif

// Main

#pragma X3D include "Utils.glsl"
#pragma X3D include "Skin.glsl"
#pragma X3D include "Particle.glsl"
#pragma X3D include "PointSize.glsl"

void
vertex_main ()
{
   #if defined (X3D_NORMALS)
      vec4 x3d_TransformedVertex = getParticleVertex (getSkinVertex (x3d_Vertex, x3d_Normal));
      vec3 x3d_TransformedNormal = getSkinNormal (x3d_Normal);
   #else
      vec4 x3d_TransformedVertex = getParticleVertex (getSkinVertex (x3d_Vertex, vec3 (0.0)));
   #endif

   vec4 position = x3d_ModelViewMatrix * x3d_TransformedVertex;

   vertex = position .xyz;

   #if defined (X3D_GEOMETRY_0D)
      #if defined (X3D_STYLE_PROPERTIES)
         gl_PointSize = pointSize = getPointSize (vertex);
      #else
         gl_PointSize = 1.0;
      #endif
   #endif

   #if defined (X3D_GEOMETRY_1D) && defined (X3D_STYLE_PROPERTIES)
      lengthSoFar = x3d_LineStipple .z;
      startPoint  = x3d_LineStipple .xy;
      midPoint    = x3d_LineStipple .xy;
   #endif

   #if defined (X3D_FOG) && defined (X3D_FOG_COORDS)
      fogDepth = x3d_FogDepth;
   #endif

   #if defined (X3D_COLOR_MATERIAL)
      color = x3d_Color;
   #endif

   #if ! defined (X3D_GEOMETRY_0D) && ! defined (X3D_GEOMETRY_1D)
      #if defined (X3D_TEXTURE) || defined (X3D_MATERIAL_TEXTURES)
         #if X3D_NUM_TEXTURE_COORDINATES > 0
            texCoord0 = getParticleTexCoord (x3d_TexCoord0);
         #endif

         #if X3D_NUM_TEXTURE_COORDINATES > 1
            texCoord1 = getParticleTexCoord (x3d_TexCoord1);
         #endif

         #if X3D_NUM_TEXTURE_COORDINATES > 2
            texCoord2 = getParticleTexCoord (x3d_TexCoord2);
         #endif

         #if X3D_NUM_TEXTURE_COORDINATES > 3
            texCoord3 = getParticleTexCoord (x3d_TexCoord3);
         #endif
      #endif
   #endif

   #if defined (X3D_NORMALS)
      normal = x3d_NormalMatrix * x3d_TransformedNormal;

      #if defined (X3D_TEXTURE) || defined (X3D_MATERIAL_TEXTURES)
         localNormal = x3d_TransformedNormal;
      #endif
   #endif

   #if defined (X3D_TEXTURE) || defined (X3D_MATERIAL_TEXTURES)
      localVertex = x3d_TransformedVertex .xyz;
   #endif

   gl_Position = x3d_ProjectionMatrix * position;

   #if defined (X3D_LOGARITHMIC_DEPTH_BUFFER)
      depth = 1.0 + gl_Position .w;
   #endif
}
`;
