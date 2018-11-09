var Star = function(x,y,z) {

	var star = new THREE.Object3D();
	var material = new THREE.MeshLambertMaterial({color: 0xFFFF00, wireframe: false});
	addBody(star,material,1,16,8);

	function addBody(obj,mat,r,w,h){

		geometry = new THREE.SphereGeometry(r,w,h);
		mesh = new THREE.Mesh(geometry,mat);

		obj.add(mesh);
	}

	scene.add(star);

	star.position.x = x;
	star.position.y = y;
	star.position.z = z;


	//this.updatePosition = function(x,y,z){
	//	star.position.x = x;
	//	star.position.y = y;
	//	star.position.z = z;
	//}
	this.getPositionX = function(){
		return star.position.x;
	}

	this.getPositionY = function(){
		return star.position.y;
	}

	this.getPositionZ = function(){
		return star.position.z;
	}
}
