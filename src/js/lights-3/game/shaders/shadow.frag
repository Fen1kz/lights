precision highp float;

varying vec2 vTextureCoord;
varying vec2 resolution;

uniform sampler2D uSampler;
uniform vec3 uLightDirection;
uniform vec4 uLightColor;

uniform int uMaxShadowSteps;
uniform float uTexStep;

const float PI = 3.14159265358979323846;
const float SIZE = 256.0;
const float THRESHOLD = 0.75;

void main(void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

    float dst = 1.0;
    for (float y = 0.0; y < SIZE; y += 1.0) {

        float angle = vTextureCoord.x * 2.0 * (2.0 * PI);
        float distance = y / SIZE;
//        float distance = vTextureCoord.y;
//        color.r = angle / (2.0 * PI);
//        color.g = distance;

        vec2 coord = vec2(cos(angle) * distance, sin(angle) * distance);

        coord = coord / 2.0 + 0.5;

//        color.r = abs(coord.x);
//        color.g = coord.y;
        vec4 data = texture2D(uSampler, coord);
        color = data;
        color.a = 0.5;

//        float d = y / SIZE;
//        vec2 coord = vec2(vTextureCoord.x, dst);
//        gl_FragColor = data;
//
        if (data.a > 0.0) {
            dst = min(dst, distance);
        }

    }
color = vec4(0.0, 0.0, 0.0, 1.0);
    color.g = length(vTextureCoord) * 3.0;
//    vec4 color2 = vec4(0.0, 0.0, 0.0, 1.0);
//    color2.r = vTextureCoord.x;
    color.a = 1.0;

    gl_FragColor = vec4(vec3(dst), 1.0);
    gl_FragColor = color;
}