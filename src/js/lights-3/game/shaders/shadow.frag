precision highp float;

varying vec2 vTextureCoord;
varying vec2 resolution;
uniform vec2 gameResolution;
uniform vec2 shaderResolution;

uniform sampler2D uSampler;
uniform vec3 uLightDirection;
uniform vec4 uLightColor;

uniform sampler2D iChannel0;

const float PI = 3.14159265358979323846;
const float SIZE = 512.0;
const float THRESHOLD = 0.25;

vec2 globalToLocal() {
    return (gameResolution * vTextureCoord) / shaderResolution;
}

vec2 localToGlobal(vec2 local) {
    return (local * shaderResolution) / gameResolution;
}

void main(void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 realCoord = globalToLocal();

    float dst = 1.0;
    for (float y = 0.0; y < SIZE; y += 1.0) {
        float angle = realCoord.x * (2.0 * PI);
        float distance = y / SIZE;
//        float distance = realCoord.y;
        vec2 coord = vec2(cos(angle) * distance, sin(angle) * distance) / 2.0 + 0.5;
        vec4 data = texture2D(uSampler, localToGlobal(coord));
        if (data.a > THRESHOLD) {
            dst = min(dst, distance);
        }

    }
    gl_FragColor = vec4(vec3(dst, 1.0 - dst, 0.0), 1.0 - dst);
}