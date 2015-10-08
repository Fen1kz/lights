precision lowp float;

uniform float     time;           // shader playback time (in seconds)
uniform vec2      resolution;           // viewport resolution (in pixels)
uniform vec2      mouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

void main() {
	//gl_FragCoord.xy
	//gl_FragColor = clamp(col, 0.0, 1.0);

	vec4 color = texture2D(uSampler, vTextureCoord);

	float gray = dot(color.rgb, vec3(.5,.5,.5));

    color = vec4(vec3(gray), 1);

    gl_FragColor = color;
//	gl_FragColor = vec4(1.0, 0.0, .0, .1);
}
