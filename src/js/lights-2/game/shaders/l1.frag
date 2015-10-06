/**

	Hi all,

	This is just my playground for a bunch of 2D stuff:

	Some distance functions and blend functions
	Cone marched 2D Soft shadows
	Use the mouse to control the 3rd light

*/



//////////////////////////////////////
// Combine distance field functions //
//////////////////////////////////////
precision lowp float;

uniform float     time;        // shader playback time (in seconds)
uniform vec2      resolution;  // viewport resolution (in pixels)
uniform vec2      mouse;       // mouse pixel coords. xy: current (if MLB down), zw: click
uniform sampler2D uSampler;
uniform vec3 lait;
uniform vec3 lights[2];
varying vec2 vTextureCoord;

vec4 shift(float x, float y) {
    vec2 shift = vec2(x, y);
    vec2 position = resolution * vTextureCoord;
    return texture2D(uSampler, (position + shift * vec2(1.0, 1.0)) / resolution);
}

void main() {
//    vec4 color = texture2D(uSampler, vTextureCoord);
//    float d = 5.0;
//
//    color.r = color.r + shift(-d, -d).r;
    vec4 color = vec4(.0);
    vec2 position = floor(resolution * vTextureCoord);

    for (float x = 0.0; x < 10.0; x++) {
        for (float y = 0.0; y < 10.0; y++) {
            vec2 search = vec2(x, y);
            vec2 searchPosition = floor(resolution / 10.0 * search);
            vec2 searchCoord = searchPosition / resolution;
            vec4 light = texture2D(uSampler, searchCoord);

//            if (position == searchPosition) {
//                color = light;
//                color.r = 1.0;
//            }

            if (light.r > 0.0) {
                vec2 distance = normalize(searchPosition - position);
                color.r = length(distance);
            }
        }
    }

    gl_FragColor = color;
}

//    mat3 near = mat3(
//        shift(-d, -d)
//        shift(0.0, -d)
//        shift(d, -d))
//        shift(-d, 0)
//        shift(0.0, 0)
//        shift(d, 0))
//        shift(-d, d)
//        shift(0.0, d)
//        shift(d, d))