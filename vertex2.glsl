precision mediump float;

attribute vec3 vPosition, vColor, vNormal;
attribute vec2 vTexCoord;

varying vec3 fNormal;
varying vec3 fPosition;
varying vec2 fTexCoord;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;  // Berperan sebagai modelMatrix-nya vektor normal

void main() {
  // fColor = vColor;

  // mat4 translasi = mat4(
  //     1.0, 0.0, 0.0, 0.0,
  //     0.0, 1.0, 0.0, 0.0,
  //     0.0, 0.0, 1.0, 0.0,
  //     0.0, 0.0, -2.0, 1.0 // menjauhi 2 dari kamera
  //   );
  // mat4 skalasi = mat4(
  //   1.5, 0.0, 0.0, 0.0,
  //   0.0, 1.5, 0.0, 0.0,
  //   0.0, 0.0, 1.5, 0.0,
  //   0.0, 0.0, 0.0, 1.0
  // );

  // gl_Position = projectionMatrix*viewMatrix*translasi*skalasi*vec4(vPosition, 1.0);
  // gl_Position = vec4(vPosition, 0.0, 1.0)*to_origin;
  // gl_Position = gl_Position*scaled;
  // gl_Position = gl_Position*inv_origin;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);

  // Transfer koordinat tekstur ke fragment shader
  fTexCoord = vTexCoord;

  // Transfer vektor normal (yang telah ditransformasi) ke fragment shader
  fNormal = normalize(normalMatrix * vNormal);

  // Transfer posisi verteks
  fPosition = vec3(modelMatrix * vec4(vPosition, 1.0));

}