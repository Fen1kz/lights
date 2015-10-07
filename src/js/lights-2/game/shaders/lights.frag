/**

	Hi all,

	This is just my playground for a bunch of 2D stuff:

	Some distance functions and blend functions
	Cone marched 2D Soft shadows
	Use the mouse to control the 3rd light

*/



//////////////////////////////////////
// Combine distance field functions //
//////////////////////////////////////
precision lowp float;

uniform float     time;        // shader playback time (in seconds)
uniform vec2      resolution;  // viewport resolution (in pixels)
uniform vec2      mouse;       // mouse pixel coords. xy: current (if MLB down), zw: click
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform float testColor;

const float THRESHOLD = 0.75;
const float PI = 3.1415926535897932384626433832795;
const float resY = 256.0;

void main(void) {
  vec2 position = floor(resolution * vTextureCoord);
  float distance = 1.0;
//  gl_FragColor = vec4(0.0);
//  gl_FragColor.a = 1.0;

  for (float y = 0.0; y < resY; y += 1.0) {
        //rectangular to polar filter
        vec2 norm = vec2(vTextureCoord.x, y / resolution.y) * 2.0 - 1.0;
        float theta = PI*1.5 + norm.x * PI;
        float r = (1.0 + norm.y) * 0.5;
//
        //coord which we will sample from occlude map
        vec2 coord = vec2(-r * sin(theta), -r * cos(theta)) / 2.0 + 0.5;

        //sample the occlusion map
        vec4 data = texture2D(uSampler, coord);

        //the current distance is how far from the top we've come
        float dst = y/resolution.y;

//        gl_FragColor = texture2D(uSampler, vec2(dst, r));
        //if we've hit an opaque fragment (occluder), then get new distance
        //if the new distance is below the current, then we'll use that for our ray
        float caster = data.a;
        if (caster > THRESHOLD) {
            distance = min(distance, dst);
//            return;
            //NOTE: we could probably use "break" or "return" here
        }
  }
  gl_FragColor = vec4(vec3(distance), 1.0);
}

/*
void main() {
    const float r_inner=0.0;
    const float r_outer=1.0;
    vec2 position = resolution * vTextureCoord;

    vec2 center = vTextureCoord - vec2(.5);
    //center.xy = vTextureCoord.xy;
//    center.x = .5 - vTextureCoord.x;
//    center.y = .5 - vTextureCoord.y;

    float radius = length(center);
    radius = ( radius - r_inner) / (r_outer - r_inner);

    float angle = atan(center.y, center.x);
    angle = angle * 0.5 / PI + 0.5;

    vec4 color = texture2D(uSampler, vTextureCoord);

//    float distance = (resolution.x - radius) / resolution.x;
//
//
//    //for (float p = .0; p < maxLight; p += 1.0) {
//        if (sampleColor.a == 0.0) {
//            //color = vec4(1.0, .0, .0, 1.0);
//            color = vec4(1.0, .0, .0, 1.0);
//        }
//
////        color.rgb = vec3(1.0 - sampleColor.a);
//    //}
//
//    color.a = 1.0;

    vec4 sampleColor = texture2D(uSampler, vec2(angle, radius));
    color = sampleColor;
//    color.rgb = vec3(radius);

//    color.rgb = vec3((1.0 - radius) * 2.0 - 1.0);
//    if (floor(angle * 100.0) == 33.0) {
//        color.rgb = vec3(1.0, .0, .0);
//    }

//
//    color.rgb += vec3(1.0) * (vTextureCoord.y - .5) * 1.0;

    //vec4 color = texture2D(uSampler, vTextureCoord);

    gl_FragColor = color;
}*/


/*
void main() {
    vec2 position = floor(resolution * vTextureCoord);

    float radius = sqrt(pow(vTextureCoord.x, 2.0) + pow(vTextureCoord.y, 2.0));
    float angle = atan(vTextureCoord.y, vTextureCoord.x);


    vec4 sampleColor = texture2D(uSampler, vec2(radius, angle));
    vec4 color = texture2D(uSampler, vTextureCoord);

    //float z = resolution.y;

    or (float y = .0; y < z; y += 1.0) {
        if (position.y > 10.0) {
            color = vec4(.0);
            color.a = 1.0;
            color.g = 1.0;
        }
    }

    color.rgb += vec3(1.0) * (vTextureCoord.y - .5) * 1.0;

//    vec4 color = texture2D(uSampler, vTextureCoord);

    gl_FragColor = color;
}


*/

























