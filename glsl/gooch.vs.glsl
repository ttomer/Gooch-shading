varying vec3 position1;
varying vec3 interpolatedNormal;

void main() {

	position1 = (modelMatrix * vec4(position, 0.0)).xyz;
	interpolatedNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

	// TODO: PART 1D
   
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}