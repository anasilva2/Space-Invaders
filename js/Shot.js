var Shot = function(){
	
	var shot = new THREE.Object3D();
	var material = new THREE.MeshLambertMaterial({color: 0xFFFFFF, wireframe: false});
	addBody(shot,material,1,1,5,10);


	function addBody(obj,mat,rt,rb,h,sh){

		geometry = new THREE.CylinderGeometry(rt,rb,h,sh);
		geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
		mesh = new THREE.Mesh(geometry,mat);

		obj.add(mesh);


	}

	var shotBB = new THREE.BoundingBoxHelper(shot);


	this.getBoundingBox = function(){
		return shotBB;
	}

	scene.add(shot);
	
	this.getPositionX = function(){
		return shot.position.x;
	}

	this.getPositionY = function(){
		return shot.position.y;
	}

	this.getPositionZ = function(){
		return shot.position.z;
	}

	this.setPositionZ = function(z){
		shot.position.z = z;
	}

	this.updatePosition = function(x,y,z){
		shot.position.x = x;
		shot.position.y = y;
		shot.position.z = z;
	}

	this.getShotObject = function(){
		return shot;
	}

	this.setMaterial = function(m){
		material = m;
	}

}