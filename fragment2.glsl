precision mediump float;

varying vec3 fNormal;
varying vec3 fPosition;
varying vec2 fTexCoord;

uniform vec3 diffuseColor;
uniform vec3 diffusePosition; // Titik sumber cahaya
uniform vec3 ambientColor;
uniform float shininess;
uniform sampler2D sampler0;


void main() {

  vec4 tex0 = texture2D(sampler0, fTexCoord); // Hasil akhirnya adalah warna (RGBA)

  vec3 ambient = ambientColor * vec3(tex0);

  vec3 lightDirection = diffusePosition - fPosition;
  lightDirection = normalize(lightDirection);

  vec3 normal = normalize(fNormal);
  
  float lightIntensity = dot(normal, lightDirection);
  lightIntensity = clamp(lightIntensity, 0.0, 1.0);

  vec3 diffuse = vec3(tex0) * lightIntensity;

  vec3 reflection = 2. * dot(normal, lightDirection) * normal - lightDirection;

  vec3 to_camera = -1. * fPosition;

  reflection = normalize(reflection);
  to_camera = normalize(to_camera);
  lightIntensity = dot(reflection, to_camera);
  lightIntensity = clamp(lightIntensity, 0.0, 1.0);
  lightIntensity = pow(lightIntensity, shininess);

  vec3 specular;
  if (lightIntensity > 0.0){
    specular = diffuseColor * lightIntensity;
    diffuse = diffuse * (1. - lightIntensity);
  }else{
    specular = vec3(0., 0., 0.);
  }

  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}
