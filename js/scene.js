/* global BABYLON */

'use restrict';

var Scene = function(engine) {

  this.meshes = [];

  this.engine = engine;

  this.scene = new BABYLON.Scene(this.engine);
  //this.scene.clearColor = new BABYLON.Color3(0.3, 0.3, 0.3);
  this.scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

  // Camera
  // this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, -20), this.scene);
  this.camera = new BABYLON.ArcRotateCamera('camera', 3 * Math.PI / 2, Math.PI / 8, 50, BABYLON.Vector3.Zero(), this.scene);
  this.camera.checkCollisions = true;
  this.camera.applyGravity = true;
  //this.camera.setTarget(new BABYLON.Vector3(0, 100, -30));
  this.camera.setPosition(new BABYLON.Vector3(160, 80, 100));
  this.camera.attachControl(this.engine.getRenderingCanvas(), true);

  // Light
  this.light = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(0.2, -1, 0), this.scene);
  this.light.position = new BABYLON.Vector3(0, 80, 0);

  // Materials
  this.groundMat = new BABYLON.StandardMaterial('groundMat', this.scene);
  this.groundMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  this.groundMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
  this.groundMat.backFaceCulling = false;

  this.alphaMat = new BABYLON.StandardMaterial('alphaMat', this.scene);
  this.alphaMat.diffuseColor = BABYLON.Color3.White();
  this.alphaMat.alpha = 0;

  // Shadows
  this.shadowGenerator = new BABYLON.ShadowGenerator(2048, this.light);

  // Physics
  this.scene.enablePhysics(null, new BABYLON.CannonJSPlugin());

  // Events
  this.scene.onPointerDown = function(evt, pickResult) {
    if (pickResult.hit) {
      var dir = pickResult.pickedPoint.subtract(this.activeCamera.position);
      dir.normalize();
      pickResult.pickedMesh.applyImpulse(dir.scale(20), pickResult.pickedPoint);
    } else {
      //this.createSpheres(4);
    }
  };

};

Scene.prototype.createGround = function() {

  var width = 100.0;
  var depth = 100.0;
  var height = 50.0;
  var thick = 0.5;
  var stepHeight = 2.0;

  var parts = [];

  // Ground
  var ground = BABYLON.Mesh.CreateGround('ground', width, depth, 1, this.scene);
  ground.material = this.groundMat;
  ground.position.y = -20;
  ground.checkCollisions = true;
  ground.receiveShadows = true;
  parts.push({
    mesh: ground,
    impostor: BABYLON.PhysicsEngine.BoxImpostor
  });

  var border0 = BABYLON.Mesh.CreateBox('border0', 1, this.scene);
  border0.scaling = new BABYLON.Vector3(thick, height, depth);
  border0.material = this.alphaMat;
  border0.position.y = height / 2;
  border0.position.x = -width / 2;
  border0.checkCollisions = true;
  border0.parent = ground;
  parts.push({
    mesh: border0,
    impostor: BABYLON.PhysicsEngine.BoxImpostor
  });

  var border1 = BABYLON.Mesh.CreateBox('border1', 1, this.scene);
  border1.scaling = new BABYLON.Vector3(thick, height, depth);
  border1.material = this.alphaMat;
  border1.position.y = height / 2;
  border1.position.x = width / 2;
  border1.checkCollisions = true;
  border1.parent = ground;
  parts.push({
    mesh: border1,
    impostor: BABYLON.PhysicsEngine.BoxImpostor
  });


  var border2 = BABYLON.Mesh.CreateBox('border2', 1, this.scene);
  border2.scaling = new BABYLON.Vector3(width, height, thick);
  border2.material = this.alphaMat;
  border2.position.y = height / 2;
  border2.position.z = depth / 2;
  border2.checkCollisions = true;
  border2.parent = ground;
  parts.push({
    mesh: border2,
    impostor: BABYLON.PhysicsEngine.BoxImpostor
  });


  var border3 = BABYLON.Mesh.CreateBox('border3', 1, this.scene);
  border3.scaling = new BABYLON.Vector3(width, height, thick);
  border3.material = this.alphaMat;
  border3.position.y = height / 2;
  border3.position.z = -depth / 2;
  border3.checkCollisions = true;
  border3.parent = ground;
  parts.push({
    mesh: border3,
    impostor: BABYLON.PhysicsEngine.BoxImpostor
  });

  // Steps
  for (var idx = 0; idx < 9; idx++) {
    var st = BABYLON.Mesh.CreateBox('step' + idx.toString(), 1, this.scene);
    st.scaling = new BABYLON.Vector3(width - 3 * (idx + 5) * stepHeight, stepHeight, depth - 3 * (idx + 5) * stepHeight);
    st.material = this.groundMat;
    st.position.y = (idx + 1) * stepHeight;
    st.checkCollisions = true;
    st.receiveShadows = true;
    st.parent = ground;
    parts.push({
      mesh: st,
      impostor: BABYLON.PhysicsEngine.BoxImpostor
    });
  }

  // physics 
  this.scene.createCompoundImpostor(parts, {
    mass: 0,
    friction: 0.5,
    restitution: 0.7
  });

};

Scene.prototype.createSpheres = function(num) {
  var y = 50;
  for (var index = 0; index < num; index++) {
    var sphere = BABYLON.Mesh.CreateSphere('Sphere0', 12, 3, this.scene);
    //sphere.material = this.alphaMat;
    sphere.position = new BABYLON.Vector3(Math.random() * 20 - 10, y, Math.random() * 10 - 5);
    this.shadowGenerator.getShadowMap().renderList.push(sphere);
    sphere.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, {
      mass: 1,
      friction: 0.5,
      restitution: 0.5
    });
    // add force
    sphere.applyImpulse(new BABYLON.Vector3(0, -10, 0), sphere.position);
    this.meshes.push(sphere);
    if (this.meshes.length >= 50) {
      var toRemove = this.meshes.shift();
      this.scene.removeMesh(toRemove);
      toRemove.dispose();
    }
    y += 2;
  }
};

Scene.prototype.render = function() {
  this.scene.render();
};
