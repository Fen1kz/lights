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
const float SIZE = 256.0;
const float THRESHOLD = 0.75;

vec2 globalToLocal() {
    return (gameResolution * vTextureCoord) / shaderResolution;
}

vec2 localToGlobal(vec2 local) {
    return (local * shaderResolution) / gameResolution;
}

void main(void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 realCoord = globalToLocal();
//    vec2 realCoord = vTextureCoord;

    float dst = 1.0;
//    for (float y = 0.0; y < SIZE; y += 1.0) {
        float angle = realCoord.x * (2.0 * PI);
//        float distance = y / SIZE;
        float distance = realCoord.y;

//        color.r = abs(angle / (2.0 * PI));
//        color.g = distance;

        vec2 coord = vec2(cos(angle) * distance, sin(angle) * distance) / 2.0 + 0.5;

//        coord = coord / 2.0;

//        color.r = (coord.x);
//        color.g = (coord.y);
        vec4 data = texture2D(uSampler, localToGlobal(coord));
//        vec4 dataS = texture2D(uSampler, realCoord);

        // DEBUG
//        vec2 debugPosition = coord;


//        color = debugData;
        // DEBUG

        color = data;
//        color.a = 0.75;
//        color.rg = vTextureCoord;


//        color.r = abs(sin(angle));
//        color.a = 0.5;

//        color.r = vec2(angle, distance).x;

//        float d = y / SIZE;
//        vec2 coord = vec2(vTextureCoord.x, dst);
//        gl_FragColor = data;
//
        if (data.a > 0.0) {
            dst = min(dst, distance);
        }

    //}
//color = vec4(0.0, 0.0, 0.0, 1.0);
//    color.rg = realCoord;
//    vec4 color2 = vec4(0.0, 0.0, 0.0, 1.0);
//    color2.r = vTextureCoord.x;
//    color.a = 1.0;

//    gl_FragColor = vec4(vec3(dst), 1.0);
    gl_FragColor = color;
}