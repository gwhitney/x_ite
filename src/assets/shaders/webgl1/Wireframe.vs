
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
precision highp int;
#else
precision mediump float;
precision mediump int;
#endif

uniform bool  x3d_ColorMaterial;   // true if a X3DColorNode is attached, otherwise false
uniform bool  x3d_Lighting;        // true if a X3DMaterialNode is attached, otherwise false
uniform x3d_MaterialParameters x3d_FrontMaterial;

uniform mat4 x3d_ProjectionMatrix;
uniform mat4 x3d_ModelViewMatrix;

attribute float x3d_FogDepth;
attribute vec4  x3d_Color;
attribute vec4  x3d_Vertex;

varying float fogDepth; // fog depth
varying vec4  color;    // color
varying vec3  vertex;   // point on geometry

#ifdef X_ITE
attribute vec4 x3d_TexCoord0;
varying   vec3 startPosition;  // line stipple start
varying   vec3 vertexPosition; // current line stipple position
#endif

#ifdef X3D_LOGARITHMIC_DEPTH_BUFFER
varying float depth;
#endif

void
main ()
{
	vec4 position = x3d_ModelViewMatrix * x3d_Vertex;

	fogDepth = x3d_FogDepth;
	vertex   = position .xyz;

	gl_Position = x3d_ProjectionMatrix * position;

	#ifdef X_ITE
	// Line Stipple
	vec4 start = x3d_ProjectionMatrix * x3d_ModelViewMatrix * x3d_TexCoord0;

	startPosition  = start .xyz / start .w;
	vertexPosition = gl_Position .xyz / gl_Position .w;
	#endif

	#ifdef X3D_LOGARITHMIC_DEPTH_BUFFER
	depth = 1.0 + gl_Position .w;
	#endif

	if (x3d_Lighting)
	{
		float alpha = 1.0 - x3d_FrontMaterial .transparency;

		if (x3d_ColorMaterial)
		{
			color .rgb = x3d_Color .rgb;
			color .a   = x3d_Color .a * alpha;
		}
		else
		{
			color .rgb = x3d_FrontMaterial .emissiveColor;
			color .a   = alpha;
		}
	}
	else
	{
		if (x3d_ColorMaterial)
			color = x3d_Color;
		else
			color = vec4 (1.0);
	}
}
