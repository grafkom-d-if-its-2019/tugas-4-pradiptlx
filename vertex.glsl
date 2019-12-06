precision mediump float;

attribute vec3 vPosition;
attribute vec3 vColor;
varying vec3 fColor;
uniform vec3 theta;
uniform float scale;
uniform vec3 bounce;
uniform mat4 modelMatrix, viewMatrix, projectionMatrix;
uniform float center;

void main() {
  fColor = vColor;

  // vec2 transform = vec2(-0.5, 0.5);

  mat4 to_origin = mat4(
    1.0, 0.0, 0.0, -.46,
    0.0, 1.0, 0.0, -.04,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, -2.0, 1.0
  );

  mat4 translation = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, -1.0, 0.0,
    0.0, 0.0, 1.0, 1.0
  );

  // mat4 rotate = mat4(
  //   cos(theta), sin(theta), 0, 0,
  //   -sin(theta), cos(theta), 0, 0,
  //   0, 0, 1.0, 0,
  //   0, 0, 0, 1.0
  // );

  vec4 vecCenter = vec4(center,0,0,1.0);

  mat4 scaled = mat4(
    scale, 0, 0, -(vecCenter.x)*scale + (vecCenter.x),
    0, 1.0, 0, 0,
    0, 0, 1.0, 0,
    0, 0, 0, 1.0
  );

  mat4 bounce = mat4(
    1.0, 0.0, 0.0, bounce.x,
    0.0, 1.0, 0.0, bounce.y,
    0.0, 0.0, 1.0, bounce.z,
    0.0, 0.0, 0.0, 1.0
  );

  // mat4 inv_origin = mat4(
  //   1.0, 0.0, 0.0, +.46,
  //   0.0, 1.0, 0.0, +.04,
  //   0.0, 0.0, 1.0, 0.0,
  //   0.0, 0.0, 0.0, 1.0
  // );

  // gl_Position = projectionMatrix*viewMatrix*to_origin*vec4(vPosition, 1.0);
  // gl_Position = vec4(vPosition, 0.0, 1.0)*to_origin;
  // gl_Position = gl_Position*scaled;
  // gl_Position = gl_Position*inv_origin;
  gl_Position = vec4(vPosition, 1.0)*bounce*scaled;
  gl_Position = projectionMatrix*viewMatrix*to_origin*gl_Position;

}