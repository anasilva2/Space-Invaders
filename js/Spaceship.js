var Spaceship = function (id){

	var spaceship = new THREE.Object3D();

	var material = new THREE.MeshLambertMaterial({color: 0xff0000, side: 2, shading: THREE.FlatShading, wireframe: false});

	switch(id){
		case 1:
			bodySpaceship1(spaceship,material);
			break;
		case 2:
			bodySpaceship2(spaceship,material);
			break;
	}
	

	scene.add(spaceship);

	spaceship.position.x = 0;
	spaceship.position.y = 0;
	spaceship.position.z = 100;

	var spaceshipBB = new THREE.BoundingBoxHelper(spaceship,0xFF0000);
	spaceshipBB.update();
	//scene.add(spaceshipBB);

	this.getBoundingBox = function(){
		return spaceshipBB;
	}

	this.getPositionX = function(){
		return spaceship.position.x;
	}

	this.getPositionY = function(){
		return spaceship.position.y;
	}

	this.getPositionZ = function(){
		return spaceship.position.z;
	}

	this.setPositionX = function(x){
		spaceship.position.x = x;
	}

	this.setPositionY = function(y){
		spaceship.position.y = y;
	}

	this.setPositionZ = function(z){
		spaceship.position.z = z;
	}

	this.setMaterial = function(m){
		material = m;
	}
	/* Faz update da função da nave */
	this.updatePosition = function(x,y,z){
		spaceship.position.x = x;
		spaceship.position.y = y;
		spaceship.position.z = z;
	};

	function bodySpaceship1(spaceship,material){
		addCorpoNave(spaceship, material, 12, 4, 8, 0, 0, 0);
		addCorpoNave(spaceship, material, 8, 4, 2, 2, 0, -8);
		addCorpoNave(spaceship, material, 4, 4, 2, 4, 0, -10);
	}

	function bodySpaceship2(spaceship,material){
		addSpaceshipBody(spaceship,material,3,4,8,0,0,0);  // corpo da nave
		addSpaceshipBody(spaceship,material,1,4,2,0,0,-5); // frente da nave
		addSpaceshipBody(spaceship,material,1,2,6,2,0,0); // asa direita
		addSpaceshipBody(spaceship,material,1,2,4,3,0,1);  
		addSpaceshipBody(spaceship,material,1,2,3,4,0,1.5);
		addSpaceshipBody(spaceship,material,1,2,5,5,0,2.5);
		addSpaceshipBody(spaceship,material,1,2,2,6,0,4);
		addSpaceshipBody(spaceship,material,1,2,6,-2,0,0);  // asa esquerda
		addSpaceshipBody(spaceship,material,1,2,4,-3,0,1);
		addSpaceshipBody(spaceship,material,1,2,3,-4,0,1.5);
		addSpaceshipBody(spaceship,material,1,2,5,-5,0,2.5);
		addSpaceshipBody(spaceship,material,1,2,2,-6,0,4);
		addSpaceshipCanon(spaceship,material,1,2,3,8,0,0,-7.5); // canhao

	}

	function addSpaceshipBody(obj,mat,dx,dy,dz,x,y,z){

		geometry = new THREE.CubeGeometry(dx,dy,dz);
		mesh = new THREE.Mesh(geometry,mat);
		mesh.position.set(x,y,z);

		obj.add(mesh);
	}

	function addSpaceshipCanon(obj,mat,rt,rb,h,sh,x,y,z){

		geometry = new THREE.CylinderGeometry(rt,rb,h,sh);
		geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
		mesh = new THREE.Mesh(geometry,mat);
		mesh.position.set(x,y,z);

		obj.add(mesh);

	}
}

function addTrianguloXY(obj, mat, rot, dx, dy, dz, x, y, z) {
	geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(0,  dy, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(dx, 0, 0));
	geometry.faces.push(new THREE.Face3(0, 1, 2));
	geometry.computeBoundingSphere();
	geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(rot));
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	mesh = new THREE.Mesh(geometry, mat);
	mesh.position.set(x, y, z);
	obj.add(mesh); 
}

function addTrianguloYZ(obj, mat, rot, dx, dy, dz, x, y, z) {
	geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(0,  dy, 0), new THREE.Vector3(0, 0, dz), new THREE.Vector3(0, 0, 0));
	geometry.faces.push(new THREE.Face3(0, 1, 2));
	geometry.computeBoundingSphere();
	geometry.applyMatrix(new THREE.Matrix4().makeRotationX(rot));
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	mesh = new THREE.Mesh(geometry, mat);
	mesh.position.set(x, y, z);
	obj.add(mesh); 
}

function addTrianguloXZ(obj, mat, rot, dx, dy, dz, x, y, z) {
	geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(dx,  0, 0), new THREE.Vector3(0, 0, dz), new THREE.Vector3(0, 0, 0));
	geometry.faces.push(new THREE.Face3(0, 1, 2));
	geometry.computeBoundingSphere();
	geometry.applyMatrix(new THREE.Matrix4().makeRotationY(rot));
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	mesh = new THREE.Mesh(geometry, mat);
	mesh.position.set(x, y, z);
	obj.add(mesh); 
}

function addQuadradoXY(obj, mat, dx, dy, dz, x, y, z) {
	addTrianguloXY(obj, mat, 0, dx, dy, dz, x, y, z); 
	addTrianguloXY(obj, mat, Math.PI, dx, dy, dz, x+dx, y+dy, z);


}

function addQuadradoYZ(obj, mat, dx, dy, dz, x, y, z) {
	addTrianguloYZ(obj, mat, 0, dx, dy, dz, x, y, z); 
	addTrianguloYZ(obj, mat, Math.PI, dx, dy, dz, x, y+dy, z+dz); 
}

function addQuadradoXZ(obj, mat, dx, dy, dz, x, y, z) {
	addTrianguloXZ(obj, mat, 0, dx, dy, dz, x, y, z);
	addTrianguloXZ(obj, mat, Math.PI, dx, dy, dz, x+dx, y, z+dz);
}

function addCorpoNave(obj, mat, dx, dy, dz, x, y, z) {
	addQuadradoXY(obj, mat, dx, dy, dz, x, y, z);
	addQuadradoXY(obj, mat, dx, dy, dz, x, y, z-dz);
	addQuadradoYZ(obj, mat, dx, dy, dz, x, y, z-dz);
	addQuadradoYZ(obj, mat, dx, dy, dz, x+dx, y, z-dz);
	addQuadradoXZ(obj, mat, dx, dy, dz, x, y, z-dz);
	addQuadradoXZ(obj, mat, dx, dy, dz, x, y+dy, z-dz);
}



