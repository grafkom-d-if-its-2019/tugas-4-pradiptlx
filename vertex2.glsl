precision mediump float;

attribute vec3 vPosition, vColor, vNormalCube;
varying vec3 fColor;
uniform mat4 modelMatrix, viewMatrix, projectionMatrix;
uniform vec3 theta;

void main() {
  fColor = vColor;

  mat4 translasi = mat4(
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, -2.0, 1.0 // menjauhi 2 dari kamera
    );
  mat4 skalasi = mat4(
    1.5, 0.0, 0.0, 0.0,
    0.0, 1.5, 0.0, 0.0,
    0.0, 0.0, 1.5, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  gl_Position = projectionMatrix*viewMatrix*translasi*skalasi*vec4(vPosition, 1.0);
  // gl_Position = vec4(vPosition, 0.0, 1.0)*to_origin;
  // gl_Position = gl_Position*scaled;
  // gl_Position = gl_Position*inv_origin;

}