uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv;

#include ../includes/rotate2D.glsl

void main() 
{
  vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

  // Utilise worldPosition au lieu de position locale pour les vagues
  vec3 newPosition = position;

  // Exemple d'onde simple utilisant les coordonnées mondiales
  newPosition.z += sin(worldPosition.x * 10.0 + uTime * 2.0) * 0.5;

  // Calcul final de la position
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);

  // Passe les UV au fragment shader
  vUv = uv;
}