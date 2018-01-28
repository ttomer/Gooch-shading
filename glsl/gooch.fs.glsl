varying vec3 position1;
varying vec3 interpolatedNormal;
uniform vec3 lightDirectionUniform;


void main() {

vec3 u_objectColor = vec3(1.0, 1.0, 1.0);
//vec3 u_coolColor = vec3(159.0/255.0, 148.0/255.0, 255.0/255.0);
//vec3 u_warmColor = vec3(1.0, 0.3, 75.0/255.0);
vec3 u_coolColor = vec3(0.0/255.0, 0.0/255.0, 255.0/255.0);
vec3 u_warmColor = vec3(0.5, 0.0, 0.0/255.0);
float u_alpha = 0.25;
float u_beta = 0.5;

	//TOTAL INTENSITY
	//TODO PART 1D: calculate light intensity	
	
	vec3 l = normalize(lightDirectionUniform);
	vec3 n = normalize(interpolatedNormal);
	vec3 v = normalize(cameraPosition - position1);
	float lightIntensity= 1.0; 

	float cosa = dot(l, n);
	float final = (1.0 + cosa)/2.0;

	vec3 coolColor = u_coolColor + u_objectColor * u_alpha;
	vec3 warmColor = u_warmColor + u_objectColor * u_beta;

	vec3 colorOut = mix(coolColor, warmColor, final);
	
   	vec4 resultingColor = vec4(colorOut, 0.0);

   	//TODO PART 1D: change resultingColor based on lightIntensity (toon shading)

   	//TODO PART 1D: change resultingColor to silhouette objects

	gl_FragColor = resultingColor;
}
