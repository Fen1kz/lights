precision highp float;

varying vec2 vTextureCoord;
uniform vec2 resolution;

uniform sampler2D uSampler;
uniform vec3 uLightDirection;
uniform vec4 uLightColor;

uniform vec3 uLightPosition;

uniform int uMaxShadowSteps;
uniform float uTexStep;

void main(void) {
  vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
  vec2 relativeLightPosition = uLightPosition.xy / resolution;

//  color = vec4(relativeLightPosition.x, relativeLightPosition.y, 0.0, 1.0);
  color = vec4(vTextureCoord.x, vTextureCoord.y, 0.0, 1.0);

  gl_FragColor = color;
//  gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}