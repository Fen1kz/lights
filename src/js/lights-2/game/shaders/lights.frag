precision highp float;

uniform float     time;        // shader playback time (in seconds)
uniform vec2      resolution;  // viewport resolution (in pixels)
uniform vec2      mouse;       // mouse pixel coords. xy: current (if MLB down), zw: click

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform vec3 lightDirection;
uniform vec4 lightColor;

void main(void) {
  // pull the normal vector out of the texture
  vec4 rawNormal = texture2D(uSampler, vTextureCoord);

  // if the alpha channel is zero, then don't do lighting here
  if(rawNormal.a == 0.0) {
    gl_FragColor = vec4(0, 0, 0, 0);
  } else {

    // translate from 0 to 1 to -.5 to .5
    rawNormal -= 0.5;

    // figure out how much the lighting influences this pixel
    float lightWeight =
      dot(normalize(rawNormal.xyz), normalize(lightDirection));

    lightWeight = max(lightWeight, 0.0);

    // and drop the pixel in
    gl_FragColor = lightColor * lightWeight;
  }
//    gl_FragColor = lightColor;
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

























