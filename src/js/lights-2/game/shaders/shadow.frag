precision highp float;

vec2 extrude(vec2 other, float angle, float length) {
  float x = length * cos(angle);
  float y = length * sin(angle);

  return vec2(other.x + x, other.y + y);
}

float getHeightAt(vec2 texCoord, float xyAngle, float distance, sampler2D heightMap) {

  vec2 newTexCoord = extrude(texCoord, xyAngle, distance);
  return texture2D(heightMap, newTexCoord).r;
}

float getTraceHeight(float height, float zAngle, float distance) {
  return distance * tan(zAngle) + height;
}

bool isInShadow(vec3 angle, sampler2D heightMap, vec2 texCoord, float step) {

  float distance;
  float height;
  float otherHeight;
  float traceHeight;

  height = texture2D(heightMap, texCoord).r;
//  height = 1.0;
//  step = 1.0 / 512.0;

    step = angle.z / 512.0;

//  step = 1.0 / 512.0 * 4.0;

  for(int i = 0; i < 100; ++i) {
    distance = step * float(i);
    otherHeight = getHeightAt(texCoord, atan(angle.y, angle.x), distance, heightMap);

//  vec2 newTexCoord = extrude(texCoord, atan(angle.y, angle.x), distance);
//  vec2 newTexCoord = extrude(texCoord, .5, distance);
//  otherHeight = texture2D(heightMap, newTexCoord).r;
//    if (i == 10) {
//        gl_FragColor = vec4(otherHeight, height, .0, 1.0);
//        gl_FragColor = vec4(1.0, .0, .0, 1.0);
//        gl_FragColor.r = otherHeight;
//    }

    if(otherHeight > height) {
      traceHeight = getTraceHeight(height, angle.z, distance);
//      if(traceHeight <= otherHeight) {
        return true;
//      }
    }
  }

  return false;
}

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec3 uLightDirection;
uniform vec4 uLightColor;

uniform int uMaxShadowSteps;
uniform float uTexStep;

void main(void) {
  float alpha = 0.0;

  if(isInShadow(uLightDirection, uSampler, vTextureCoord, uTexStep)) {
    alpha = 0.5;
  }

  gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);

//  gl_FragColor = vec4(uTexStep, 0.0, 0.0, 1.0);
}