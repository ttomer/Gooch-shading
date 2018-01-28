/*
 * UBC CPSC 314, Vsep2017
 * Assignment 3 Template
 */

 // Scene Modes
var Part = {
  LIGHTING: 0,
  ANISOTROPIC: 1,
  TOON: 2,
  COUNT: 3
}
var mode = Part.LIGHTING// current mode

// Setup renderer
var canvas = document.getElementById('canvas');
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xFFFFFF); // black background colour
canvas.appendChild(renderer.domElement);

// Adapt backbuffer to window size
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  for (let i = 0; i < Part.COUNT; ++i) {
    cameras[i].aspect = window.innerWidth / window.innerHeight;
    cameras[i].updateProjectionMatrix();
  }
}

// Hook up to event listener
window.addEventListener('resize', resize);

// Disable scrollbar function
window.onscroll = function() {
  window.scrollTo(0, 0);
}

// Setup scenes
var scenes = [
  new THREE.Scene(),
  new THREE.Scene(),
  new THREE.Scene()
]

// Setting up all shared objects
var cameras = []
var controls = []
var worldFrames = []
var floorTextures = []
var floorMaterials = []
var floorGeometries = []
var floors = []

for (let i = 0; i < Part.COUNT; ++i) {
  cameras[i] = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
  cameras[i].position.set(0,10,20);
  cameras[i].lookAt(scenes[i].position);
  scenes[i].add(cameras[i]);

  var pointLight = new THREE.PointLight(0xFFFFFF, 1, 1000);
  pointLight.position.set(5, 8, 5);
  scenes[i].add(pointLight);

  // orbit controls
  controls[i] = new THREE.OrbitControls(cameras[i]);
  controls[i].damping = 0.2;
  controls[i].autoRotate = false;

  worldFrames[i] = new THREE.AxisHelper(2);
  worldFrames[i].position.set(-7.5, 0.1, -7.5);


  floorTextures[i] = new THREE.ImageUtils.loadTexture('images/floor.jpg');
  floorTextures[i].wrapS = floorTextures[i].wrapT = THREE.RepeatWrapping;
  floorTextures[i].repeat.set(1, 1);

  floorMaterials[i] = new THREE.MeshBasicMaterial({
    map: floorTextures[i],
    side: THREE.DoubleSide
  });
  floorGeometries[i] = new THREE.PlaneBufferGeometry(15, 15);
  floors[i] = new THREE.Mesh(floorGeometries[i], floorMaterials[i]);
  floors[i].rotation.x = Math.PI / 2;
  floors[i].parent = worldFrames[i];

  scenes[i].add(worldFrames[i]);
  scenes[i].add(floors[i]);
}
resize();

// LOAD OBJ ROUTINE
// mode is the scene where the model will be inserted
function loadOBJ(mode, file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function(query) {
    if (query.lengthComputable) {
      var percentComplete = query.loaded / query.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };

  var onError = function() {
    console.log('Failed to load ' + file);
  };

  var loader = new THREE.OBJLoader();
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    object.position.set(xOff, yOff, zOff);
    object.rotation.x = xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale, scale, scale);
    object.parent = worldFrames[mode];
    scenes[mode].add(object);
  }, onProgress, onError);
}

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Parameters defining the light
var lightColor = new THREE.Color(1,1,1);
var ambientColor = new THREE.Color(0.4,0.4,0.4);
var lightDirection = new THREE.Vector3(0.49,0.79,0.49);


// Material properties
var kAmbient = 0.4;
var kDiffuse = 0.8;
var kSpecular = 0.8;
var shininess = 10.0;
var alphaX = 0.7;
var alphaY = 0.1;

// Uniforms
var lightColorUniform = {type: "c", value: lightColor};
var ambientColorUniform = {type: "c", value: ambientColor};
var lightDirectionUniform = {type: "v3", value: lightDirection};
var kAmbientUniform = {type: "f", value: kAmbient};
var kDiffuseUniform = {type: "f", value: kDiffuse};
var kSpecularUniform = {type: "f", value: kSpecular};
var shininessUniform = {type: "f", value: shininess};
var alphaXUniform = {type: "f", value: alphaX};
var alphaYUniform = {type: "f", value: alphaY};

// Materials
var phongMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightColorUniform: lightColorUniform,
    ambientColorUniform: ambientColorUniform,
    lightDirectionUniform: lightDirectionUniform,
    kAmbientUniform: kAmbientUniform,
    kDiffuseUniform: kDiffuseUniform,
    kSpecularUniform: kSpecularUniform,
    shininessUniform: shininessUniform

  },
});

var bPhongMaterial = new THREE.ShaderMaterial({
  uniforms: {
  	 lightColorUniform: lightColorUniform,
    ambientColorUniform: ambientColorUniform,
    lightDirectionUniform: lightDirectionUniform,
    kAmbientUniform: kAmbientUniform,
    kDiffuseUniform: kDiffuseUniform,
    kSpecularUniform: kSpecularUniform,
    shininessUniform: shininessUniform

  },
});

var anisotropicMaterial = new THREE.ShaderMaterial({
  uniforms: {

  	 lightColorUniform: lightColorUniform,
    ambientColorUniform: ambientColorUniform,
    lightDirectionUniform: lightDirectionUniform,
    kAmbientUniform: kAmbientUniform,
    kDiffuseUniform: kDiffuseUniform,
    kSpecularUniform: kSpecularUniform,
    shininessUniform: shininessUniform,
    alphaXUniform : alphaXUniform,
    alphaYUniform : alphaYUniform

    },
});  

var toonMaterial = new THREE.ShaderMaterial({
  uniforms: {

  	lightDirectionUniform: lightDirectionUniform

  },
});

// Load shaders
var shaderFiles = [
  'glsl/phong.vs.glsl',
  'glsl/phong.fs.glsl',
  'glsl/phong_blinn.vs.glsl',
  'glsl/phong_blinn.fs.glsl',
  'glsl/anisotropic.vs.glsl',
  'glsl/anisotropic.fs.glsl',
  'glsl/gooch.fs.glsl',
  'glsl/gooch.vs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
  phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
  bPhongMaterial.vertexShader = shaders['glsl/phong_blinn.vs.glsl'];
  bPhongMaterial.fragmentShader = shaders['glsl/phong_blinn.fs.glsl'];
  anisotropicMaterial.fragmentShader = shaders['glsl/anisotropic.fs.glsl'];
  anisotropicMaterial.vertexShader = shaders['glsl/anisotropic.vs.glsl'];
  toonMaterial.fragmentShader = shaders['glsl/gooch.fs.glsl'];
  toonMaterial.vertexShader = shaders['glsl/gooch.vs.glsl'];
  
  phongMaterial.needsUpdate = true;
  bPhongMaterial.needsUpdate = true;
  anisotropicMaterial.needsUpdate = true;
  toonMaterial.needsUpdate = true;
})

/////////////////////////////////
//       LIGHTING SCENE        //
//    RELEVANT TO PART 1.A+B   //
/////////////////////////////////

lighting = {};

// Create spheres for lighting scene
lighting.sphere = new THREE.SphereGeometry(1, 16, 16);

lighting.gouraud = new THREE.Mesh(lighting.sphere, new THREE.MeshLambertMaterial({color: 0xFFFFFF}));
lighting.gouraud.position.set(-3, 1, 1);
scenes[Part.LIGHTING].add(lighting.gouraud);


lighting.phong = new THREE.Mesh(lighting.sphere, phongMaterial);
lighting.phong.position.set(0, 1, 1);
scenes[Part.LIGHTING].add(lighting.phong);

lighting.phong_blinn = new THREE.Mesh(lighting.sphere, bPhongMaterial);
lighting.phong_blinn.position.set(3, 1, 1);
scenes[Part.LIGHTING].add(lighting.phong_blinn);

/////////////////////////////////
//      ANISOTROPIC SCENE      //
//    RELEVANT TO PART 1.C     //
/////////////////////////////////

anisotropic = {};
loadOBJ(Part.ANISOTROPIC, 'obj/armadillo.obj', anisotropicMaterial, 1, 4, 1.1, 4, 0, 3.14, 0);
loadOBJ(Part.ANISOTROPIC, 'obj/bunny.obj', anisotropicMaterial, 1, -2, 0.3, -3, 0, 0, 0);
loadOBJ(Part.ANISOTROPIC, 'obj/car.obj', anisotropicMaterial, 0.04, 4, 0, -4, -1.57, 0, 0);
loadOBJ(Part.ANISOTROPIC, 'obj/male.obj', anisotropicMaterial, 0.04, -4, 0, 4, 0, 0, 0);

// TODO: load your objects here

anisotropic.sphere = new THREE.SphereGeometry(1, 16, 16);
anisotropic.sphere_aniso = new THREE.Mesh(anisotropic.sphere, anisotropicMaterial)
anisotropic.sphere_aniso.position.set(0, 1, 1);
scenes[Part.ANISOTROPIC].add(anisotropic.sphere_aniso);

/////////////////////////////////
//      TOON SCENE             //
//    RELEVANT TO PART 1.D     //
/////////////////////////////////

toon = {};
loadOBJ(Part.TOON, 'obj/armadillo.obj', toonMaterial, 1, 4, 1.1, 4, 0, 3.14, 0);
loadOBJ(Part.TOON, 'obj/bunny.obj', toonMaterial, 1, -2, 0.3, -3, 0, 0, 0);
loadOBJ(Part.TOON, 'obj/car.obj', toonMaterial, 0.04, 4, 0, -4, -1.57, 0, 0);
loadOBJ(Part.TOON, 'obj/male.obj', toonMaterial, 0.04, -4, 0, 4, 0, 0, 0);


// TODO: load your objects here

toon.sphere = new THREE.SphereGeometry(1, 16, 16);
toon.npr_toon = new THREE.Mesh(toon.sphere, toonMaterial);
toon.npr_toon.position.set(0, 1, 1);
scenes[Part.TOON].add(toon.npr_toon);


// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();

function checkKeyboard() {
  if (keyboard.pressed("1"))
    mode = Part.LIGHTING
  else if (keyboard.pressed("2"))
    mode = Part.ANISOTROPIC
  else if (keyboard.pressed("3"))
    mode = Part.TOON
}

// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  requestAnimationFrame(update);
  renderer.render(scenes[mode], cameras[mode]);
}

update();
