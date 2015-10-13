precision highp float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;
uniform vec2 resolution;
uniform vec2 gameResolution;
uniform vec2 shaderResolution;

uniform sampler2D iChannel0;
uniform vec2 uLightPosition;
uniform vec4 uLightColor;

const float PI = 3.14159265358979323846;

vec2 globalToLocal() {
    return (gameResolution * vTextureCoord) / shaderResolution;
}

vec2 localToGlobal(vec2 local) {
    return (local * shaderResolution) / gameResolution;
}

void main() {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    vec2 mult = gameResolution / shaderResolution;
    float angleCoordOnMap = fract(vTextureCoord.x * (gameResolution.x / shaderResolution.x));

    vec2 localLightPosition = uLightPosition / gameResolution;
    localLightPosition.y = 1.0 - localLightPosition.y;

    float angleOfLMap = angleCoordOnMap * (2.0 * PI);
//    vec2 toLight = vTextureCoord - localLightPosition;// + realCoord * 2.0 - vec2(1.0, 1.0);
    vec2 toLight = vTextureCoord - localLightPosition;// + realCoord * 2.0 - vec2(1.0, 1.0);
//    vec2 toLight = localLightPosition - vTextureCoord;// + realCoord * 2.0 - vec2(1.0, 1.0);
    float angleToPoint = atan(-toLight.y, toLight.x);

//    color.rg = abs(toLight) * 2.0;
//    color.r = length(toLight);
//    color.    r = angleOfLMap / (2.0 * PI);
    angleToPoint = 0.5 + angleToPoint / (2.0 * PI);
    angleCoordOnMap = (shaderResolution.x / gameResolution.x) * angleToPoint;
//    color.g = angleToPoint;

//    vec2 lightPosition = vec2(0.5);
    vec2 samplePoint = vec2(angleToPoint, 0);
//    vec4 LMapColor = texture2D(uSampler, localToGlobal(samplePoint));
    vec4 LMapColor = texture2D(uSampler, samplePoint);
//    color.r = LMapColor.r;

    color.a = 0.0;
    if (length(toLight) > LMapColor.r) {
        color.a = 0.8;
    }


//    color.r = angleCoordOnMap;
//    color.r = angleOfLMap / (2.0 * PI);
//    color.r = angleToPoint;
//    color.rg = abs(toLight);
//    color.rg = samplePoint;
    color = LMapColor;
    color.a = 0.5;

//    color = texture2D(uSampler, realCoord);
//    color.a = 1.0;


//    color.r = (samplePoint.x);

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
//    gl_FragColor = texture2D(uSampler, localToGlobal(realCoord));
//        gl_FragColor.r = 1.0;
    gl_FragColor = color;
}