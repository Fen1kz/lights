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
  float distance = 1.0;
  vec4 color = vec4(0.0,0.0,0.0,1.0);

  for (float y=0.0; y < SIZE; y+=1.0) {
        //the current distance is how far from the top we've come
        float dst = y / SIZE;
        //rectangular to polar filter
//        vec2 norm = vec2(vTextureCoord.x, dst) * 2.0 - 1.0;
        vec2 norm = vec2(vTextureCoord.x, dst) * vec2(2.0, 1.0);
//        vec2 norm = vec2(vTextureCoord.x, y / resolution.y) * 2.0 - vec2(1.0);
        float angle = norm.x;
//        float r = (1.0 + norm.y) * 0.5;

        color.b = angle;
//        color.g = norm.y;

        //coord which we will sample from occlude map
//        vec2 coord = vec2(-r * sin(theta), -r * cos(theta))/2.0 + 0.5;
//
//        //sample the occlusion map
//        vec4 data = texture2D(uSampler, coord);
//
//
//        //if we've hit an opaque fragment (occluder), then get new distance
//        //if the new distance is below the current, then we'll use that for our ray
//        float caster = data.a;
//        if (caster > THRESHOLD) {
//            distance = min(distance, dst);
//            //NOTE: we could probably use "break" or "return" here
//        }
  }
  gl_FragColor = color;
//  gl_FragColor = vec4(vec3(distance), 1.0);
}