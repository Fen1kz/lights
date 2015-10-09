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

  for (float step = 0.0; step < SIZE; step += 1.0) {
        //the current distance is how far from the top we've come
        float dst = step / SIZE;
        //rectangular to polar filter
//        vec2 norm = vec2(vTextureCoord.x, dst) * 2.0 - 1.0;
//        vec2 norm = vec2(vTextureCoord.x, y / resolution.y) * 2.0 - vec2(1.0);
//        float r = (1.0 + norm.y) * 0.5;

//        color.b = angle / (2.0 * PI);
//        color.g = norm.y;

        vec2 norm = vec2(vTextureCoord.x, dst);// * vec2(2.0, 1.0);
        float angle = norm.x;// * (2.0 * PI);
        //coord which we will sample from occlude map
        vec2 coord = vec2(dst * cos(angle), dst * sin(angle));// / 2.0 + 0.5;

        if (floor(vTextureCoord.y * 256.0) == floor(norm.y * 256.0)) {
//            color.r = dst;
//            color.g = angle;
//            color.rg = coord;
        }

//
//        //sample the occlusion map
        vec4 data = texture2D(uSampler, coord);
//        vec4 data = texture2D(uSampler, vec2(dst, angle));

        color = data;
//        color.a = 1.0;
//        color.r = angle;
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
//  color=
//  float angle = vTextureCoord.x;// * (2.0 * PI);
//  float dst = vTextureCoord.y;
//  vec2 coord = vec2(dst * sin(angle), dst * cos(angle));

//  color = texture2D(uSampler, vec2(dst, angle));
//  color = texture2D(uSampler, coord);
//  color.a = 1.0;
//  color.r = angle;
  gl_FragColor = color;
//  gl_FragColor = vec4(vec3(distance), 1.0);
}