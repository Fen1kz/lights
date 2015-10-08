precision highp float;

const float PI = 3.141592;

varying vec2 vTextureCoord;
uniform vec2 resolution;

uniform sampler2D uSampler;
uniform vec3 uLightDirection;
uniform vec4 uLightColor;

uniform vec3 uLightPosition;

uniform int uMaxShadowSteps;
uniform float uTexStep;

const float STEPS = 50.0;

uniform vec2 pixelMapSize;

uniform vec2 lightPos;
//uniform vec2 lightPositions[25];
//uniform float lightDistances[25];
uniform float lightsCount;
uniform float lightDistance;

//uniform float stepsCount;

vec2 GetLightPos(int lightIndex) {
        float ang = float(lightIndex) / float(lightsCount) * PI * 2.0 + 1.0;
        return lightPos + vec2(cos(ang), sin(ang)) * 100.0 * (lightIndex == 0 ? 0.0 : 1.0);
}

void main() {
        float ang = vTextureCoord.x * 2.0 * PI;

        vec2 lightDir = vec2(cos(ang), sin(ang));

        gl_FragColor = vec4(0.5, 0.0, 0.0, 1.0);

        int lightIndex = int(lightsCount * (1.0 - vTextureCoord.y));

//      float lightDistance = lightDistances[lightIndex];

//        float stepSize = lightDistance / stepsCount;

        for(float dist = 0.0; dist < 256.0/**/; dist += 1.0)
        {
                vec2 samplePoint = (GetLightPos(lightIndex) + lightDir * dist) / pixelMapSize;
                if(texture2D(uSampler, samplePoint).r > 0.5)
                {
                        gl_FragColor = vec4(dist / lightDistance, 0.0, 0.0, 1.0);
                        return;
                }
        }
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//
//        gl_FragColor = texture2D(uSampler, vTextureCoord);
//        gl_FragColor.r = 1.0;
}