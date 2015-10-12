precision mediump float;
varying vec2 vTextureCoord;
uniform float blur;
uniform sampler2D uSampler;
uniform vec2 shaderResolution;
void main(void) {

//float localBlur = blur / shaderResolution.x;
float localBlur = blur / 512.0;

vec4 sum = vec4(0.0);

sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*localBlur, vTextureCoord.y)) * 0.06;
sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*localBlur, vTextureCoord.y)) * 0.09;
sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*localBlur, vTextureCoord.y)) * 0.12;
sum += texture2D(uSampler, vec2(vTextureCoord.x - 1.0*localBlur, vTextureCoord.y)) * 0.15;
sum += texture2D(uSampler, vec2(vTextureCoord.x + 0.0*localBlur, vTextureCoord.y)) * 0.16;
sum += texture2D(uSampler, vec2(vTextureCoord.x + 1.0*localBlur, vTextureCoord.y)) * 0.15;
sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*localBlur, vTextureCoord.y)) * 0.12;
sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*localBlur, vTextureCoord.y)) * 0.09;
sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*localBlur, vTextureCoord.y)) * 0.06;

//sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*localBlur, vTextureCoord.y)) * 0.05;
//sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*localBlur, vTextureCoord.y)) * 0.02;
//sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*localBlur, vTextureCoord.y)) * 0.04;
//sum += texture2D(uSampler, vec2(vTextureCoord.x - localBlur, vTextureCoord.y)) * 0.09;
//sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;
//sum += texture2D(uSampler, vec2(vTextureCoord.x + localBlur, vTextureCoord.y)) * 0.09;
//sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*localBlur, vTextureCoord.y)) * 0.04;
//sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*localBlur, vTextureCoord.y)) * 0.02;
//sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*localBlur, vTextureCoord.y)) * 0.05;

gl_FragColor = sum;

}