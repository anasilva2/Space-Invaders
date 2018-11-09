var Invader = function(movement,idInvader,id,x, y, z) {

	var mov = movement;
	var idinvader = idInvader;
	var invader = new THREE.Object3D();
	var material = new THREE.MeshLambertMaterial({wireframe: false});


	invader.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
	
	switch(id){

		case 1: // cria o corpo do invader do tipo1
			material.color.set(0x00ff00);
			bodyInvader1(invader,material);
			break;
		case 2: // cria o corpo do invader do tipo2
			material.color.set(0xFFD700);
			bodyInvader2(invader,material);
			break;
		case 3: // cria o corpo do invader do tipo3
			material.color.set(0xFF0000);
			bodyInvader3(invader,material);
			break;
	}

	scene.add(invader);

	invader.position.x = x;
	invader.position.y = y;
	invader.position.z = z;

	var invaderBB = new THREE.BoundingBoxHelper(invader,0xFF0000);
	invaderBB.update();
	//scene.add(invaderBB);

	this.getBoundingBox = function(){
		return invaderBB;
	}
	this.getIdInvader = function(){
		return idinvader;
	}

	this.updatePosition = function(x,y,z){
		invader.position.x = x;
		invader.position.y = y;
		invader.position.z = z;
	}

	this.getInvaderObject = function(){
		return invader;
	}

	this.getMovement = function(){
		return mov;
	}

	this.setMovement = function(movement){
		mov = movement;
	}

	this.getPositionX = function(){
		return invader.position.x;
	}

	this.getPositionZ = function(){
		return invader.position.z;
	}

	this.setMaterial = function(m){
		invader.material = m;
		material.needsUpdate = true;
	}

	this.getColor = function(){
		return material.color;
	}
	this.getMaterial = function(){
		return material;
	}

	function bodyInvader1(invader,material){
		
		//visto no plano x/y com o z a apontar para nos: coordenadas da camara x=0, y=0, z=0.

		addParallelepiped2x1(invader, material, 0, -1.5, 0, 0); //Pe esquerdo.
		addParallelepiped2x1(invader, material, 0, 1.5, 0, 0); //Pe direito.

		addCube1x1(invader,material, -3, 1, 0); // Perna esquerda.
		addCube1x1(invader,material, 3, 1, 0); // Perna direita.

		addParallelepiped2x1(invader, material, -Math.PI/2, -5, 1.5, 0); //Braco esquerdo.
		addParallelepiped2x1(invader, material, -Math.PI/2, 5, 1.5, 0); //Braco direito.

		addCube1x1(invader,material, -2, 6, 0); // Antena esquerda baixo.
		addCube1x1(invader,material, 2, 6, 0); // Antena direita baixo.

		addCube1x1(invader,material, -3, 7, 0); // Antena esquerda cima.
		addCube1x1(invader,material, 3, 7, 0); // Antena direita cima.

		addParallelepiped3x2(invader, material, 0, 0, 2.5, 0); // Nariz.
		addParallelepiped3x2(invader, material, 0, 0, 2.5, 0); // Nariz.
		addParallelepiped3x2(invader, material, 0, 0, 4.5, 0); // Testa meio.

		addCube2x2(invader, material, -2.5, 2.5, 0); // Bochecha esquerda.
		addCube2x2(invader, material, 2.5, 2.5, 0); // Bochecha direita.

		addParallelepiped2x1(invader, material, 0, 2.5, 5, 0); // Testa direita.
		addParallelepiped2x1(invader, material, 0, -2.5, 5, 0); // Testa esquerda.

		addParallelepiped2x1(invader, material, 0, 3.5, 4, 0); // Perto do olho direito.
		addParallelepiped2x1(invader, material, 0, -3.5, 4, 0); // Perto do olho esquerdo.

		addParallelepiped2x1(invader, material, 0, 4.5, 3, 0); // Ombro direito.
		addParallelepiped2x1(invader, material, 0, -4.5, 3, 0); // Ombro esquerdo.

	}

	function bodyInvader2(invader,material) {


		addParallelepiped3x2(invader, material, Math.PI/2, -0.5, 3, 0); // Nariz.
		addParallelepiped3x2(invader, material, Math.PI/2, -0.5, 3, 0); // Nariz.
		addParallelepiped3x2(invader, material, Math.PI/2, -0.5, 6, 0);	// Testa.
		
		addCube1x1(invader,material, 2, 0, 0); // Pe direito.
		
		addCube1x1(invader,material, 3, 1, 0); // Perna direita cima.
		addCube1x1(invader,material, 2, 2, 0); // Perna direita baixo.

		addCube1x1(invader,material, -3, 0, 0); // Pe esquerdo
		
		addCube1x1(invader,material, -4, 1, 0); // Perna esquerda baixo.
		addCube1x1(invader,material, -3, 2, 0); // Perna esquerda cima.

		addCube2x2(invader, material, -3.5, 3.5, 0); // Bochecha esquerda.
		addCube2x2(invader, material, 2.5, 3.5, 0);	// Bochecha direita.

		addCube1x1(invader,material, -2, 3, 0); // Parte da cara junto ao nariz a esquerda.
		addCube1x1(invader,material, 1, 3, 0); // Parte da cara junto ao nariz a direita.

		addParallelepiped2x1(invader, material, 0, -2.5, 5, 0); // Testa Esquerda.
		addParallelepiped2x1(invader, material, 0, 1.5, 5, 0); // Testa Direita.
		
		addCube1x1(invader,material, -2, 6, 0); // Pedaco da cabeca em cima a esquerda.
		addCube1x1(invader,material, 1, 6, 0); // Pedaco da cabeca em cima a direita.

	}

	function bodyInvader3(invader,material) {

		addParallelepiped2x1(invader, material, 0, -3.5, 0, 0); //Perna esquerda.
		addParallelepiped2x1(invader, material, 0, -2.5, 1, 0); //Perna esquerda.
		addParallelepiped2x1(invader, material, 0, -1.5, 2, 0); //Perna esquerda.


		addParallelepiped2x1(invader, material, 0, 1.5, 2, 0); //Perna direita.
		addParallelepiped2x1(invader, material, 0, 2.5, 1, 0); //Perna direita.
		addParallelepiped2x1(invader, material, 0, 3.5, 0, 0); //Perna direita.
		
		addCube1x1(invader,material, 0, 1, 0); //Tronco
		
		addCube2x2(invader, material, -3.5, 3.5, 0); //Ombro esquerdo.
		addCube2x2(invader, material, 3.5, 3.5, 0); //Ombro direito.

		addParallelepiped2x1(invader, material, 0, -1.5, 3, 0); //Bochecha esquerda.
		addParallelepiped2x1(invader, material, 0, 1.5, 3, 0); //Bochecha direita.

		addParallelepiped2x1(invader, material, Math.PI/2, 0, 3.5, 0); //Nariz.
			
		addParallelepiped3x2(invader, material, 0, 0, 5.5, 0); //Testa.
		addParallelepiped2x1(invader, material, 0, -2.5, 5, 0); //Testa esquerda.
		addParallelepiped2x1(invader, material, 0, 2.5, 5, 0); //Testa esquerda.

	}

}


function addCube1x1(obj, mat, x, y, z) {
	
	geometry = new THREE.CubeGeometry(1, 1, 1);
	mesh = new THREE.Mesh(geometry, mat);
	mesh.position.set(x, y, z);
	obj.add(mesh); 

}

function addCube2x2(obj, mat, x, y, z) {
	
	geometry = new THREE.CubeGeometry(2, 2, 1);
	mesh = new THREE.Mesh(geometry, mat);
	mesh.position.set(x, y, z);
	obj.add(mesh); 

}

function addParallelepiped2x1(obj, mat, rot, x, y, z) {
	
	geometry = new THREE.CubeGeometry(2, 1, 1);
	geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(rot));
	mesh = new THREE.Mesh(geometry, mat);
	mesh.position.set(x, y, z);
	obj.add(mesh); 

}

function addParallelepiped3x2(obj, mat, rot, x, y, z) {
	
	geometry = new THREE.CubeGeometry(3, 2, 1);
	geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(rot));
	mesh = new THREE.Mesh(geometry, mat);
	mesh.position.set(x, y, z);
	obj.add(mesh); 

}

