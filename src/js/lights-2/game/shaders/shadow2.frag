precision highp float;

varying vec2 vTextureCoord;
uniform vec2 resolution;

uniform sampler2D uSampler;
uniform vec3 uLightDirection;
uniform vec4 uLightColor;

uniform vec3 uLightPosition;

uniform int uMaxShadowSteps;
uniform float uTexStep;

const float STEPS = 50.0;

void main(void) {
    vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
    vec2 relativeLightPosition = uLightPosition.xy / resolution;
    relativeLightPosition.y = 1.0 - relativeLightPosition.y;

    vec2 positionTexture = floor(resolution * vTextureCoord);
    vec2 positionLight = floor(resolution * relativeLightPosition);

//    color = vec4(relativeLightPosition.x, relativeLightPosition.y, 0.0, 1.0);
//    color = vec4(vTextureCoord.x, vTextureCoord.y, 0.0, 1.0);
//    vec2 direction = positionLight - positionTexture;
    vec2 direction = positionTexture - positionLight;
    float distance = length(direction);
    float red = 0.0;
    float green = 0.0;
    float alpha = 1.0;
//    color.r = distance;

//    if (positionTexture.x == 300.0) {
//        color.g = 1.0;
        float angle = atan(direction.y, direction.x);
        float step = distance / (STEPS);
//        float angle = atan(direction);

//        float d = 5.0;
        for (float d = 0.0; d < STEPS; d += 1.0) {
            vec2 newPosition = vec2(0.0);
            newPosition.x = positionLight.x + cos(angle) * step * d;
            newPosition.y = positionLight.y + sin(angle) * step * d;
            newPosition = newPosition / resolution;
            vec4 newColor = texture2D(uSampler, newPosition);
            if (newColor.a > 0.0) {
//                color.b = length(newPosition);
//                red = 1.0;
//                green = 1.0 - d / STEPS;
//                alpha = length(newPosition);
                color.rgb = vec3(0.0);
                break;
            }
        }
//        color.r = red;
//        color.g = green;
//        color.a = alpha;
//    }

    gl_FragColor = color;
    //  gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}