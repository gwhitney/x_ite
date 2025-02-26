export default /* glsl */ `#version 300 es

precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;
precision highp samplerCube;

#pragma X3D include "include/Vertex.glsl"
#pragma X3D include "include/Material.glsl"

out vec4 frontColor;

#if ! defined (X3D_GEOMETRY_0D) && ! defined (X3D_GEOMETRY_1D)
   out vec4 backColor;
#endif

vec4
getMaterialColor (const in vec3 N,
                  const in vec3 vertex,
                  const in x3d_MaterialParameters material)
{
   // Get diffuse parameter.

   float alpha = 1.0 - x3d_Material .transparency;

   #if defined (X3D_COLOR_MATERIAL)
      vec4 diffuseParameter = vec4 (color .rgb, color .a * alpha);
   #else
      vec4 diffuseParameter = vec4 (x3d_Material .diffuseColor, alpha);
   #endif

   // Get material color.

   vec3 ambientColor = diffuseParameter .rgb * material .ambientIntensity;

   #if defined (X3D_LIGHTING)
      vec3 finalColor = getMaterialColor (vertex, N, ambientColor, diffuseParameter .rgb, material .specularColor, material .shininess);
   #else
      vec3 finalColor = vec3 (0.0);
   #endif

   finalColor += material .emissiveColor;

   return vec4 (finalColor, diffuseParameter .a);
}

void
main ()
{
   vertex_main ();

   normal     = normalize (normal);
   frontColor = getMaterialColor (normal, vertex, x3d_Material);

   #if ! defined (X3D_GEOMETRY_0D) && ! defined (X3D_GEOMETRY_1D)
      backColor = getMaterialColor (-normal, vertex, x3d_Material);
   #endif
}
`;
