precision lowp float;

uniform float     time;           // shader playback time (in seconds)
uniform vec2      resolution;           // viewport resolution (in pixels)
uniform vec2      mouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	color = vec4(vec3(vTextureCoord.x), 1.0);
    gl_FragColor = color;
}
