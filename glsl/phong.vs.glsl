varying vec3 position1;
varying vec3 interpolatedNormal;
	
void main() {

	position1 = position;
	interpolatedNormal = normal;
   
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

