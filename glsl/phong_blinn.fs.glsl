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

	//TODO: PART 1B

	//AMBIENT
	vec3 light_AMB = ambientColorUniform;

	//DIFFUSE
	vec3 lightDir = normalize(lightDirectionUniform);
	vec3 normal = normalize(interpolatedNormal);
	float g = dot(lightDir, normal);
	vec3 light_DFF = vec3(kDiffuseUniform) * clamp(g, 0.0, 1.0);

	//SPECULAR
	vec3 viewDir = normalize(cameraPosition - position1);
	vec3 halfVec = normalize(viewDir + lightDirectionUniform);
	float blinn = clamp(dot(normalize(interpolatedNormal), normalize(halfVec)), 0.0, 1.0);
	float i =pow(blinn, shininessUniform);
	vec3 light_SPC = i * vec3(kSpecularUniform);
	//vec3 light_SPC = vec3(0.0, 0.0, 0.0);

	//TOTAL
	vec3 TOTAL = light_AMB/3.5 + light_DFF + light_SPC;
	gl_FragColor = vec4(TOTAL, 0.0);

}