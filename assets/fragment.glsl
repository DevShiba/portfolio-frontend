precision highp float;

uniform float time;
uniform float randomSeed;
uniform float objectOpacity;
uniform float noisePower;
uniform float pixelRatio;
uniform vec2 resolution;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

varying vec3 vPosition;

#include noise;

float lines(vec2 uv, float offset) {
  return smoothstep(
    0.0,
    0.5 + offset * 0.5,
    abs(0.55 * (sin(uv.x * 12.0) + offset * 2.0))
  );
}

vec3 normalizeRGBColor(vec3 color) {
  return color / 255.0;
}

mat2 getRotationMatrix(float angle) {
  return mat2(
    cos(angle), -sin(angle),
    sin(angle), cos(angle)
  );
}

void main() {
  float shaderZoom = 0.0;

  if (resolution.x > 700.0) shaderZoom = 0.25;
  else shaderZoom = 0.4;

  vec3 _color1 = color1;
  vec3 _color2 = color2;
  vec3 _color3 = color3;

  float noise = snoise(vPosition + time * 0.175 + randomSeed * 100.0) * (noisePower * 0.55);

  vec2 baseUv = getRotationMatrix(noise + -1.0) * vPosition.xy * shaderZoom;

  float firstPattern = lines(baseUv, 0.5);
  float secondPattern = lines(baseUv, 0.05);

  vec3 firstColor = mix(_color3, _color2, firstPattern);
  vec3 resultingPattern = mix(firstColor, _color1, secondPattern);

  float grainStrength = 0.075;
  if (pixelRatio > 1.8) grainStrength = 0.125;

  vec2 uvNoise = vPosition.xy;
  uvNoise.y *= rand(vec2(uvNoise.y, randomSeed));
  vec3 grain = vec3(rand(uvNoise) * grainStrength);

  resultingPattern += grain;

  vec3 resColor = mix(_color1, resultingPattern, objectOpacity);

  gl_FragColor = vec4(resColor, 1);
}