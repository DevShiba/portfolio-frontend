attribute vec3 position;
attribute vec3 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec2 vUv;
varying vec3 vPosition;

void main(){
  vUv = uv;
  vPosition = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}