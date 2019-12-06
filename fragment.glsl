precision mediump float;

varying vec3 fColor;
varying vec3 fNormal;
varying vec3 fPosition;
varying vec2 fTexCoord;
uniform vec3 diffuseColor;
uniform vec3 diffusePosition; // Titik sumber cahaya
uniform vec3 ambientColor;

uniform sampler2D sampler0;

void main() {
  gl_FragColor = vec4(fColor, 1.0);
  // gl_FragColor = vec4(0.2, 0.5, 0.6, 1.0);
}