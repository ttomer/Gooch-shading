uniform vec3 lightColorUniform;
uniform vec3 ambientColorUniform;
uniform vec3 lightDirectionUniform;
uniform float kAmbientUniform;
uniform float kDiffuseUniform;
uniform float kSpecularUniform;
uniform float shininessUniform;
varying vec3 position1;
varying vec3 interpolatedNormal;
uniform float alphaXUniform;
uniform float alphaYUniform;

void main() {

	//TODO: PART 1C

	//AMBIENT
	vec3 light_AMB = ambientColorUniform;

	//DIFFUSE
	vec3 lightDir = normalize(lightDirectionUniform);
	vec3 normal = normalize(interpolatedNormal);
	float g = dot(lightDir, normal);
	vec3 light_DFF = vec3(kDiffuseUniform) * clamp(g, 0.0, 1.0);

	//SPECULAR
	vec3 viewDir = normalize(cameraPosition - position1);
	vec3 h = normalize(viewDir + lightDirectionUniform);
	vec3 t = normalize(cross(normal, vec3(0.0, 1.0, 0.0)));
	vec3 b = normalize(cross(t, normal));
	float part1 = sqrt(dot(lightDir, normal)/dot(viewDir, normal));
	float numer = pow(dot(h, t)/alphaXUniform, 2.0) + pow(dot(h, b), 2.0)/(alphaYUniform/4.8);
	float denom = (1.0 + dot(h, normal));
	float part2 = exp(-2.0 * (numer/denom));
	vec3 final = vec3(kSpecularUniform) * part1 * part2;

	vec3 light_SPC = final;

	//TOTAL
	vec3 TOTAL = light_AMB/3.5 + light_DFF + light_SPC;
	gl_FragColor = vec4(TOTAL, 0.0);

}