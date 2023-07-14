export default /* glsl */ `
#if defined (X3D_SKINNING)

in float x3d_CoordIndex;

uniform sampler2D x3d_JointsTexture;
uniform sampler2D x3d_WeightsTexture;
uniform sampler2D x3d_DisplacementsTexture;
uniform sampler2D x3d_JointMatricesTexture;
uniform sampler2D x3d_JointNormalMatricesTexture;

mat4
getJointMatrix (const in int joint)
{
   vec4 a = texelFetch (x3d_JointMatricesTexture, joint * 4 + 0, 0);
   vec4 b = texelFetch (x3d_JointMatricesTexture, joint * 4 + 1, 0);
   vec4 c = texelFetch (x3d_JointMatricesTexture, joint * 4 + 2, 0);
   vec4 d = texelFetch (x3d_JointMatricesTexture, joint * 4 + 3, 0);

   return mat4 (a, b, c, d);
}

mat3
getDisplacementJointMatrix (const in int joint)
{
   mat4 m = getJointMatrix (joint);

   return mat3 (m [0] .xyz, m [1] .xyz, m [2] .xyz);
}

vec4
getSkinningVertex (const in vec4 vertex)
{
   int   coordIndex = int (x3d_CoordIndex);
   ivec4 joints     = ivec4 (texelFetch (x3d_JointsTexture, coordIndex, 0));
   vec4  weights    = texelFetch (x3d_WeightsTexture, coordIndex, 0);
   vec4  d0         = texelFetch (x3d_DisplacementsTexture, coordIndex * 3 + 0, 0);
   vec4  d1         = texelFetch (x3d_DisplacementsTexture, coordIndex * 3 + 1, 0);
   vec4  d2         = texelFetch (x3d_DisplacementsTexture, coordIndex * 3 + 2, 0);
   vec4  skin       = vertex;

   skin .xyz += (getDisplacementJointMatrix (int (d0 .x)) * d0 .yzw)              * d1 .x;
   skin .xyz += (getDisplacementJointMatrix (int (d1 .y)) * vec3 (d1 .zw, d2 .x)) * d2 .y;

   for (int i = 0; i < 4; ++ i)
      skin += (getJointMatrix (joints [i]) * vertex - vertex) * weights [i];

   return skin;
}

#if defined (X3D_NORMALS)
mat3
getJointNormalMatrix (const in int joint)
{
   vec4 a = texelFetch (x3d_JointNormalMatricesTexture, joint * 4 + 0, 0);
   vec4 b = texelFetch (x3d_JointNormalMatricesTexture, joint * 4 + 1, 0);
   vec4 c = texelFetch (x3d_JointNormalMatricesTexture, joint * 4 + 2, 0);

   return mat3 (a .xyz, vec3 (a .w, b .xy), vec3 (b .zw, c .x));
}

vec3
getSkinningNormal (const in vec3 normal)
{
   int   coordIndex = int (x3d_CoordIndex);
   ivec4 joints     = ivec4 (texelFetch (x3d_JointsTexture, coordIndex, 0));
   vec4  weights    = texelFetch (x3d_WeightsTexture, coordIndex, 0);
   vec3  skin       = normal;

   for (int i = 0; i < 4; ++ i)
      skin += (getJointNormalMatrix (joints [i]) * normal - normal) * weights [i];

   return skin;
}
#endif

#else
   #define getSkinningVertex(vertex) (vertex)
   #define getSkinningNormal(normal) (normal)
#endif
`;
