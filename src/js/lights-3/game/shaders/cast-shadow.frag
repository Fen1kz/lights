precision mediump float;

const float PI = 3.141592;

varying vec2 vTextureCoord;
uniform vec2 resolution;

uniform sampler2D uSampler;

void main() {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 relPosition = vTextureCoord;
    relPosition.x = relPosition.x * 2.0;
    float angleOfLMap = relPosition.x * (2.0 * PI);
    vec2 toLight = relPosition - vec2(0.5, 0.5);
    float angleToPoint = atan(toLight.y, toLight.x);

//    color.rg = toLight;
    color.r = length(toLight);
//    color.r = angleOfLMap / (2.0 * PI);
//    color.g = angleToPoint / (2.0 * PI);

//    vec2 LMapCoord = vec2(0.0);

//        vec2 lightDir = vec2(cos(ang), sin(ang));
//
//        gl_FragColor = vec4(0.5, 0.0, 0.0, 1.0);
//
//        int lightIndex = int(lightsCount * (1.0 - vTextureCoord.y));
//
////      float lightDistance = lightDistances[lightIndex];
//
////        float stepSize = lightDistance / stepsCount;
//
//        for(float dist = 0.0; dist < 256.0/**/; dist += 1.0)
//        {
//                vec2 samplePoint = (GetLightPos(lightIndex) + lightDir * dist) / pixelMapSize;
//                if(texture2D(uSampler, samplePoint).r > 0.5)
//                {
//                        gl_FragColor = vec4(dist / lightDistance, 0.0, 0.0, 1.0);
//                        return;
//                }
//        }
//        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//
//        gl_FragColor = texture2D(uSampler, vTextureCoord);
//        gl_FragColor.r = 1.0;
    gl_FragColor = color;
}