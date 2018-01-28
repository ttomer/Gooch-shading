uniform vec3 lightColorUniform;
uniform vec3 ambientColorUniform;
uniform vec3 lightDirectionUniform;
uniform float kAmbientUniform;
uniform float kDiffuseUniform;
uniform float kSpecularUniform;
uniform float shininessUniform;
varying vec3 position1;
varying vec3 interpolatedNormal;

void main() {

	//TODO: PART 1A

	//AMBIENT
	vec3 light_AMB = ambientColorUniform;

	//DIFFUSE
	vec3 lightDir = normalize(lightDirectionUniform);
	vec3 normal = normalize(interpolatedNormal);
	float g = dot(lightDir, normal);
	vec3 light_DFF = vec3(kDiffuseUniform) * clamp(g, 0.0, 1.0);

	//SPECULAR
	vec3 refl = reflect( -lightDirectionUniform, interpolatedNormal);
	float b = clamp(dot(normalize(cameraPosition - position1), normalize(refl)), 0.0, 1.0);


	vec3 light_SPC = pow(b, shininessUniform) * vec3(kSpecularUniform);

	//TOTAL
	vec3 TOTAL = light_AMB/4.0 + light_DFF + light_SPC;
	gl_FragColor = vec4(TOTAL, 0.0);

}