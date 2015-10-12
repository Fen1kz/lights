precision mediump float;
varying vec2 vTextureCoord;
uniform float blur;
uniform sampler2D uSampler;
uniform vec2 shaderResolution;
void main(void) {

//float localBlur = blur / shaderResolution.x;
float localBlur = blur / 512.0;

vec4 sum = vec4(0.0);

sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 4.0*localBlur)) * 0.06;
sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 3.0*localBlur)) * 0.09;
sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 2.0*localBlur)) * 0.12;
sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 1.0*localBlur)) * 0.15;
sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 0.0*localBlur)) * 0.16;
sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 1.0*localBlur)) * 0.15;
sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 2.0*localBlur)) * 0.12;
sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 3.0*localBlur)) * 0.09;
sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 4.0*localBlur)) * 0.06;

gl_FragColor = sum;

}