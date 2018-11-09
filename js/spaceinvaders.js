var camera, scene,backgroundCamera, backgroundScene, renderer, material, mesh;
var InvadersArray = [], shotsArray = [];
var spaceShip;
var LArrowKey = false, RArrowKey = false;
var xmin = -120, xmax = 120, zmin = -150, zmax = 150;
var vf = 0, a = 2;
var t = 0;
var spacePosition_Buffer_X, invaderDestroyed, invaderCollided;
var gameStarted = false, gamePaused = false, gameOver = false,camera3active = false;
var ambLight = null,dirLight = null, dirLightPaused = null;
var star1, star2, star3, star4, star5, star6;
var pointLight = false;
var light1 = light2 = light3 = light4 = light5 =light6 = null;
var phong = true, game;
var objPaused = null;
var objectGameOver = null;
var numVidas = 3, info3, infoPontuacao,pontuacao = 0;
var spotLight, SpotLight = false;

var maxInvaders = 6;
var invadersVelocity = 0.5;
var invadersMovements = ["N","S","W","E","NE","NW","SE","SW"];
var movements = {
					"N":"S",
					"S":"N",
					"W":"E",
					"E":"W",
					"NE":"SW",
					"SW":"NE",
					"NW":"SE",
					"SE":"NW"
}
var movementsTop = {
					"N":"S",
					"NE":"SE",
					"NW":"SW"
}
var movementsBot = {
					"S":"N",
					"SW":"NW",
					"SE":"NE"
}
var movementsLeft = {
					"W":"E",
					"NW":"NE",
					"SW":"SE"
}
var movementsRight = {
					"E":"W",
					"SE":"SW",
					"NE":"NW"
}
var time = new THREE.Clock();

function game(){

	init();
	animate();
}
function render() {

	if(gamePaused == true){
		var timer = Date.now() * 0.0001;
		objPaused.rotation.y = timer * -5;
	}

	if(gameOver == true){
		var timer = Date.now() * 0.0001;
		objectGameOver.rotation.y = timer * -5;
	}

	renderer.autoClear = false;
    renderer.clear();
	renderer.render(backgroundScene, backgroundCamera);
	renderer.render(scene, camera);

}

function init() {

	var text = "R = Restart the game | 8 = Spaceship 1 | 9 = Spaceship 2  | N = Turn ligths On/Off <br /> E = turns camera left | R = turns camera right | Z = Zoom in | X = Zoom out" + 
					"<br />" + "B = Shoot | Left Arrow = moves spaceship to left | Right Arrow = moves spaceship to right" + 
					" | A = wireframe";
	var info = createInfo(text, '10px', '0px');
	var info2 = createInfo("Invaders Abatidos:", "250px", "525px");
	info2.style.fontSize = "20px";
	infoPontuacao = createInfo(pontuacao,"300px", "525px");
	infoPontuacao.style.fontSize = "25px";
	info3 = createInfo("Select a Spaceship <br /> to start the game", "140px", "525px");
	info3.style.fontSize = "25px";
	var info4 = createInfo("Lifes: ", "365px", "525px");
	info4.style.fontSize = "20px";
	infoVidas = createInfo(numVidas, "400px", "525px");
	infoVidas.style.fontSize = "25px";
	renderer = new THREE.WebGLRenderer({ antialas: true});
	renderer.setClearColor(0x09092a);
	renderer.setSize( window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);
	document.body.appendChild(info);
	document.body.appendChild(info2);
	document.body.appendChild(infoPontuacao);
	document.body.appendChild(info3);
	document.body.appendChild(info4);
	document.body.appendChild(infoVidas);

	createScene();
	createCamera(1);
	createCamaraLifes();
	drawLine1(xmax,zmax);
	drawLine1(xmax,zmin);
	drawLine2(xmax,-zmax);
	drawLine2(xmin,-zmax);
	render();

	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);

}

function createScene() {

	scene = new THREE.Scene();


	ambLight = new THREE.AmbientLight(0x333333);
	scene.add(ambLight);

	star1 = new Star(-70, 0, -100);
	star2 = new Star(-20, 0, -30);
	star3 = new Star(30, 0, -90);
	star4 = new Star(85, 0, -60);
	star5 = new Star(40, 0, 55);
	star6 = new Star(-50, 0, 60);

	dirLight = addDirectionalLight(dirLight,0,150,0);
	dirLightPaused = addDirectionalLight(dirLight,0,50,100);

	light1 = addPointLight(star1, light1);
	light2 = addPointLight(star2, light2);
	light3 = addPointLight(star3, light3);
	light4 = addPointLight(star4, light4);
	light5 = addPointLight(star5, light5);
	light6 = addPointLight(star6, light6);

	

	var buffer_i=0;
	for(var i = 0; i < maxInvaders; i++){
		var movement = Math.floor((Math.random() * invadersMovements.length));
		var invaderMov = invadersMovements[movement];
		var idInvader = Math.floor((Math.random() * 3) + 1);
		var x = Math.floor(Math.random() * (xmax - xmin)) + xmin;
		var z = Math.floor((Math.random() * zmin) + 1);
		var numInvader = Math.floor(Math.random()*500);

		if(InvadersArray.length>1){
			invader = new Invader(invaderMov,numInvader,idInvader,x,0,z);
			InvadersArray.push(invader);
			if(hasInvaderColision(invader,i)==true){
				scene.remove(InvadersArray[i].getInvaderObject());
				scene.remove(InvadersArray[i].getBoundingBox());
				InvadersArray.splice(i,1);
				i=buffer_i;
			}
		}else{
			invader = new Invader(invaderMov,numInvader,idInvader,x,0,z);
			InvadersArray.push(invader);
			buffer_i++;
		}
	}

	var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    var texture = new THREE.Texture();
	var loader = new THREE.ImageLoader(manager);
    loader.load( 'milkyway.jpeg', function (image) {
        texture.image = image;
        texture.needsUpdate = true;
    });


	var backgroundMesh = new THREE.Mesh(/*new THREE.PlaneGeometry(0.78, 0.9, 0),*/new THREE.PlaneGeometry(2, 2, 0), new THREE.MeshBasicMaterial({map: texture}));
	backgroundMesh.material.depthTest = false;
    backgroundMesh.material.depthWrite = false;
	

	backgroundScene = new THREE.Scene();
    backgroundScene.add(backgroundMesh);
	/*for(i=0; i<numColunas; i++) {
		for(j=0; j<numLinhas; j++) {
			if(i>=0 && i<=1)
				new Invader(3,(j-2.5)*14,0,i*-14);
			if(i>=2 && i<=3)
				new Invader(1,(j-2.5)*14,0,i*-14);
			if(i>=4 && i<=5)
				new Invader(2,(j-2.5)*14,0,i*-14);

		}
		
	}*/

}

function createCamera(id) {

	switch(id){
		case 1: // Ortografica
			camera = new THREE.OrthographicCamera(window.innerWidth / - 5, window.innerWidth / 5, window.innerHeight / 5, window.innerHeight / - 5, 1, 1000);
			camera.position.x = 200;
			camera.position.y = 200;
			camera.position.z = 0;
			camera.lookAt(scene.position);
			break;
		case 2: // Perspectiva
			camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
			camera.position.x = 0;  //spacePosition.x;
			camera.position.y = 50;  //spacePosition.y;
			camera.position.z = 190;//spacePosition.z;
			camera.lookAt(scene.position);
			break;
		case 3: // atras da nave
			camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
			break;
	}

	backgroundCamera = new THREE.Camera();
    backgroundScene.add(backgroundCamera);

	//camera.position.x = 200;
	//camera.position.y = 200;
	//camera.position.z = 0;

	//camera.lookAt(scene.position);

}

function createCamaraLifes(){
	camera = new THREE.OrthographicCamera(window.innerWidth / - 5, window.innerWidth / 5, window.innerHeight / 5, window.innerHeight / - 5, 1, 1000);
	camera.position.x = 100;
	camera.position.y = 100;
	camera.position.z = 0;
	camera.lookAt(scene.position);
}

function onResize() {

	renderer.setSize( window.innerWidth, window.innerHeight);

	if(window.innerHeight > 0 && window.innerWidth > 0){
		var scale=Math.min(innerWidth,innerHeight)/120;
		camera.left = window.innerWidth / - scale;
		camera.right = window.innerWidth / scale;
		camera.top = window.innerHeight / scale;
		camera.bottom = window.innerHeight / - scale;
		camera.updateProjectionMatrix();
	}

}


function animate() {

	
	if(gameStarted == true && gamePaused == false){

		

		render();

		if(gameStarted == true){

			if(camera3active == true){

				camera.position.x = spaceShip.getPositionX();  //spacePosition.x;
				camera.position.y = spaceShip.getPositionY()+10;  //spacePosition.y;
				camera.position.z = spaceShip.getPositionZ()+15;//spacePosition.z;
				camera.lookAt(scene.position);
			}

			if(SpotLight == true){
				spotLight.position.set(spaceShip.getPositionX(), spaceShip.getPositionY(), spaceShip.getPositionZ()-10);
				spotLight.target.position.set(spaceShip.getPositionX(),0,-50);
				scene.add(spotLight.target);
			}

			if(LArrowKey == true){

				vf = calcutateVelocity(vf,-a,t);
				spacePosition_Buffer_X = calculatePosition(spaceShip.getPositionX(),vf,-a,t);

			}else if(RArrowKey == true){

				vf = calcutateVelocity(vf, a,t);
				spacePosition_Buffer_X = calculatePosition(spaceShip.getPositionX(),vf,a,t);

				
			}else{

				vf = calcutateVelocity(vf, -vf,t);
				spacePosition_Buffer_X = calculatePosition(spaceShip.getPositionX(),vf, -vf,t);
			}

			if(spacePosition_Buffer_X > xmin && spacePosition_Buffer_X+12 < xmax){
				spaceShip.setPositionX(spacePosition_Buffer_X);
			}else{
				vf = 0;
			}
		}

		if(gameStarted == true){

			spaceShip.updatePosition(spaceShip.getPositionX(),spaceShip.getPositionY(),spaceShip.getPositionZ());
			spaceShip.getBoundingBox().update();
		}

		
		t=time.getDelta();
		//t=t+0.0001; //incremento da variavel tempo é muito pequeno para permitir um movimento mais suave.

		if(shotsArray.length > 0){
			for(var i = 0; i < shotsArray.length; i++){

				var shot = shotsArray[i];
				if(shot != null){

					var posZ = shot.getPositionZ();
					shot.setPositionZ(--posZ);
					shot.getBoundingBox().update();

					if(shot.getPositionZ() <= zmin){
						delete shotsArray[i];
						scene.remove(shot.getShotObject());
						scene.remove(shot.getBoundingBox());
					}else{

						if(hasCollision(shot) == true){
							scene.remove(shot.getShotObject());
							scene.remove(shot.getBoundingBox());
							delete shotsArray[i];

							scene.remove(InvadersArray[invaderDestroyed].getInvaderObject());
							scene.remove(InvadersArray[invaderDestroyed].getBoundingBox());
							var index = getIndex(InvadersArray[invaderDestroyed]);
							InvadersArray.splice(index,1);

							pontuacao++;
							infoPontuacao.innerHTML = pontuacao;

						}

					}				
				}
			}
		}

		if(hasCollisionSpaceInvader(spaceShip) == true){
			numVidas--;
			infoVidas.innerHTML = numVidas;
			spaceShip.updatePosition(0,0,100);
		}

		if((InvadersArray.length == 0 && gameStarted == true) || numVidas == 0){
			objectGameOver = textureObject(objectGameOver,'textures/gameover.png');
			scene.add(objectGameOver);
			dirLightPaused.intensity = 1;
			gameStarted = false;
			gameOver = true;
		}

		if(InvadersArray.length > 0){
			for(var i = 0; i < InvadersArray.length; i++){
				var invader = InvadersArray[i];
				if(invader != null){

					var invaderBB = invader.getBoundingBox();
					if(hasInvaderColision(invader,i) == true){
						//scene.remove(invader.getInvaderObject());
						var invader2 = InvadersArray[invaderCollided];
						invader.setMovement(movements[invader.getMovement()]);
						invader2.setMovement(movements[invader2.getMovement()]);
					}

					if(invaderBB.box.min.x < xmin){ //LEFT
						//alert("1 - "+invaderBB.box.min.x + " Mov - " + invader.getMovement());
						invader.setMovement(movementsLeft[invader.getMovement()]);
						//alert("1 - "+invaderBB.box.min.x + " Mov - " + invader.getMovement());
					}

					if(invaderBB.box.max.z > zmax){		//Bot
						//alert("2 - "+invaderBB.box.max.z + " Mov - " + invader.getMovement());
						invader.setMovement(movementsBot[invader.getMovement()]);
						//alert("2 - "+invaderBB.box.max.z + " Mov - " + invader.getMovement());

					}

					if(invaderBB.box.max.x > xmax){		//RIGHT
						//alert("3 - "+invaderBB.box.max.x + " Mov - " + invader.getMovement());
						invader.setMovement(movementsRight[invader.getMovement()]);
						//alert("3 - "+invaderBB.box.max.x + " Mov - " + invader.getMovement());
					}

					if(invaderBB.box.min.z-2 < zmin){		//Top
						//alert("4 - "+invaderBB.box.min.z + " Mov - " + invader.getMovement());
						invader.setMovement(movementsTop[invader.getMovement()]);
						//alert("4 - "+invaderBB.box.min.z + " Mov - " + invader.getMovement());
					}

					Movement(invader);
				}
			}
		}
	}else{
		render();
	}
	requestAnimationFrame(animate);
}

function calcutateVelocity(vi,a,t){
	return vi+(a*t);
}

function calculatePosition(xi,v,a,t){
	return xi+v+(a*(Math.sqrt(t))/2);
}


function onKeyDown(e){

	switch(e.keyCode){
		case 49: //1
			createCamera(1);
			camera3active = false;
			break;
		case 50: //2
			createCamera(2);
			camera3active = false;
			break;
		case 51: //3
			createCamera(3);
			camera3active = true;
			break;
		case 56: //8
			document.body.removeChild(info3);
			if(gameStarted == false){
				spaceShip = new Spaceship(1);
				gameStarted = true;
			}
			break;
		case 57: //9
			document.body.removeChild(info3);
			if(gameStarted == false){
				spaceShip = new Spaceship(2);
				gameStarted = true;
			}
			break;
		case 65: //A
		case 97: //a

			scene.traverse(function (node){
				if(node instanceof THREE.Mesh){
					node.material.wireframe = !node.material.wireframe;
				}
			});
			break;

		case 66:  //B
		case 98:  //b
			if(spaceShip != null && gamePaused == false){

				var shot = new Shot();
				shot.updatePosition(spaceShip.getPositionX()+4,0,spaceShip.getPositionZ()-12);
				shotsArray.push(shot);
			}
			break;
		case 90: //Z
		case 122: //z
			camera.zoom += 0.2;
			camera.updateProjectionMatrix();
			break;
		case 88: //X
		case 120://x
			camera.zoom -= 0.2;
			camera.updateProjectionMatrix();
			break;
		case 69: //e
		case 101: //E
		    if (camera.position.z < 300) {
		    	camera.position.z += 100;
				camera.lookAt(scene.position);
		    };
			break;
	
		case 37: // left arrow
			LArrowKey = true;
			break;
		case 39: // right arrow
			RArrowKey = true;
			break;

		case 9:
			break;

		case 78: // n
		case 110: //N

			if(dirLight.intensity == 0){

				dirLight.intensity = 3;
			}else{
				dirLight.intensity = 0;
			}
			break;

		case 76: 
		case 108: // L
			ambintensity = ambLight.intensity;
			dirintensity = dirLight.intensity;
			if(ambintensity == 0){
				ambLight.intensity = 1;
			}else{
				ambLight.intensity = 0;
				if(dirintensity != 0){
					dirLight.intensity = 0;
				}
			}

			break;
		case 67: // C
		case 99: // c
			if(pointLight == false){
				light1.intensity = 5;
				light2.intensity = 5;
				light3.intensity = 5;
				light4.intensity = 5;
				light5.intensity = 5;
				light6.intensity = 5;
				
				pointLight = true;
			}else{
				
				light1.intensity = 0;
				light2.intensity = 0;
				light3.intensity = 0;
				light4.intensity = 0;
				light5.intensity = 0;
				light6.intensity = 0;
				pointLight = false;
			}
			break;
		case 71: //G
		case 103: //g
			if(phong == true){
				for(var i = 0; i < InvadersArray.length; i++){
					var icolor = InvadersArray[i].getColor();
					InvadersArray[i].setMaterial(new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x555555, specular: 0xffffff, shininess: 50, shading: THREE.SmoothShading }));
				}
				phong = false;
			}else{
				for(var i = 0; i < InvadersArray.length; i++){
					InvadersArray[i].setMaterial(new THREE.MeshLambertMaterial({color: icolor, wireframe: false}));
					
				}
				phong = true;
			}
			break;

		case 83: //S
		case 115: //s
			if(gamePaused){
				if(dirLightPaused != null){

					dirLightPaused.intensity = 0;
				}
				scene.remove(objPaused);
				gamePaused = false;
			}else{
				if(dirLightPaused != null){

					dirLightPaused.intensity = 1;
				}
				objPaused = textureObject(objPaused,'textures/paused5.png');
				scene.add(objPaused);
				gamePaused = true;
			}
			break;

		case 82: //R
		case 114: //r
			if(gameOver == true){
				for(var i= scene.children.length-1;i >= 0; i--) {
					object = scene.children[i];
     				scene.remove(object);
				}
			}
			
			location.reload();
			
			break;
			
		case 72: //H
		case 104: //h
			if(SpotLight == false){
				addSpotLight();
				SpotLight = true;
			}else{
				scene.remove(spotLight);
				SpotLight = false;
			}
			break;


	}

}

function onKeyUp(e){

	switch(e.keyCode){
		case 37: // left arrow
			LArrowKey = false;
			break;
		case 39: // right arrow
			RArrowKey = false;
			break;
	}

}

function createInfo(text, top, right){
	var info  = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = top;
	info.style.right = right;
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.innerHTML = text;
	return info;
}

function hasCollision(obj){

	for(var i = 0; i < InvadersArray.length; i++){
		var invader = InvadersArray[i];

		if(invader != null && obj != null){

			var invaderBB = invader.getBoundingBox();
			var objBB = obj.getBoundingBox();
			if (!(invaderBB.box.min.x > objBB.box.max.x ||
					 invaderBB.box.max.x < objBB.box.min.x ||
					 invaderBB.box.min.z > objBB.box.max.z ||
					 invaderBB.box.max.z < objBB.box.min.z)){
				invaderDestroyed = i;
				return true;
			}
		}
	}
	return false;
}

function hasCollisionSpaceInvader(obj){
	for(var i = 0; i < InvadersArray.length; i++){
		var invader = InvadersArray[i];

		if( invader != null && obj != null){
			 var invaderBB = invader.getBoundingBox();
			 var objBB = obj.getBoundingBox();
			 if ((invaderBB.box.min.z > objBB.box.min.z && invaderBB.box.max.z < objBB.box.max.z && invaderBB.box.min.x < objBB.box.max.x && invaderBB.box.min.x > objBB.box.min.x) ||
			 	(invaderBB.box.min.z == objBB.box.max.z && invaderBB.box.min.x == objBB.box.max.x) ||
				(invaderBB.box.max.z > objBB.box.min.z && invaderBB.box.max.z < objBB.box.max.z && objBB.box.min.x < invaderBB.box.min.x && objBB.box.max.x > invaderBB.box.max.x) ||
				(invaderBB.box.max.z == objBB.box.min.z && invaderBB.box.min.x == objBB.box.max.x) ||
				(invaderBB.box.min.z > objBB.box.min.z && invaderBB.box.max.z < objBB.box.max.z && invaderBB.box.max.x < objBB.box.max.x && invaderBB.box.max.x > objBB.box.min.x) ||
				(invaderBB.box.max.z == objBB.box.min.z && invaderBB.box.max.x == objBB.box.min.x) ||
				(invaderBB.box.min.z < objBB.box.max.z && invaderBB.box.min.z > objBB.box.min.z && objBB.box.min.x < invaderBB.box.min.x && objBB.box.max.x > invaderBB.box.max.x) ||
				(invaderBB.box.min.z == objBB.box.max.z && invaderBB.box.max.x == objBB.box.min.x)){
				return true;
			}
		}

	}
	return false;
}

function Movement(invader){

	if(invader != null){
		var invaderBB = invader.getBoundingBox();
		var x;
		var z;
		switch(invader.getMovement()){
			

			case "N":
				x = invader.getPositionX();
				z = calculatePosition(invader.getPositionZ(),-invadersVelocity,0,time.getDelta());
				break;
			case "S":
				x = invader.getPositionX();
				z = calculatePosition(invader.getPositionZ(),invadersVelocity,0,time.getDelta());
				break;
			case "W":
				x = calculatePosition(invader.getPositionX(),-invadersVelocity,0,time.getDelta());
				z = invader.getPositionZ();
				break;
			case "E":
				x = calculatePosition(invader.getPositionX(),invadersVelocity,0,time.getDelta());
				z = invader.getPositionZ();
				break;
			case "NW":
				x = calculatePosition(invader.getPositionX(),-invadersVelocity*(1/Math.sqrt(2)),0,time.getDelta());
				z = calculatePosition(invader.getPositionZ(),-invadersVelocity*(1/Math.sqrt(2)),0,time.getDelta());
				break;
			case "NE":
				x = calculatePosition(invader.getPositionX(),invadersVelocity*(1/Math.sqrt(2)),0,time.getDelta());
				z = calculatePosition(invader.getPositionZ(),-invadersVelocity*(1/Math.sqrt(2)),0,time.getDelta());
				break;
			case "SW":
				x = calculatePosition(invader.getPositionX(),-invadersVelocity*(1/Math.sqrt(2)),0,time.getDelta());
				z = calculatePosition(invader.getPositionZ(),invadersVelocity*(1/Math.sqrt(2)),0,time.getDelta());
				break;
			case "SE":
				x = calculatePosition(invader.getPositionX(),invadersVelocity*(1/Math.sqrt(2)),0,time.getDelta());
				z = calculatePosition(invader.getPositionZ(),invadersVelocity*(1/Math.sqrt(2)),0,time.getDelta());
				break;

		}

		//if(invaderBB.box.min.x > xmin && invaderBB.box.min.z > zmin && invaderBB.box.max.x < xmax && invaderBB.box.max.z < zmax){

		invader.updatePosition(x,0,z);
		invaderBB.update();
		//}else{

		//}

	}
}

function hasInvaderColision(invader,idxInvader){
	if(invader != null){
		var invaderBB = invader.getBoundingBox();
		for(var i=0;i<InvadersArray.length;i++){
			invader2 = InvadersArray[i];
			if(i != idxInvader && invader2 != null){
				var invader2BB = invader2.getBoundingBox();
				if(invader.getPositionX() > invader2BB.box.min.x && invader.getPositionX() < invader2BB.box.max.x && invader.getPositionZ() > invader2BB.box.min.z && invader.getPositionZ() < invader2BB.box.max.z){
					invaderCollided = i;
					return true;
				}
				if(invaderBB.box.min.x > invader2BB.box.min.x && invaderBB.box.min.x < invader2BB.box.max.x && invaderBB.box.max.z > invader2BB.box.min.z && invaderBB.box.max.z < invader2BB.box.max.z){
					invaderCollided = i;
					return true;
				}
				if(invaderBB.box.min.x > invader2BB.box.min.x && invaderBB.box.min.x < invader2BB.box.max.x && invaderBB.box.min.z > invader2BB.box.min.z && invaderBB.box.min.z < invader2BB.box.max.z){
					invaderCollided = i;
					return true;
				}
				if(invaderBB.box.max.x > invader2BB.box.min.x && invaderBB.box.max.x < invader2BB.box.max.x && invaderBB.box.min.z > invader2BB.box.min.z && invaderBB.box.min.z < invader2BB.box.max.z){
					invaderCollided = i;
					return true;
				}
				if(invaderBB.box.max.x > invader2BB.box.min.x && invaderBB.box.max.x < invader2BB.box.max.x && invaderBB.box.max.z > invader2BB.box.min.z && invaderBB.box.max.z < invader2BB.box.max.z){
					invaderCollided = i;
					return true;
				}
			}
		}
		return false;
	}
}

function addDirectionalLight(obj,x,y,z){
	obj = new THREE.DirectionalLight( 0xffffff, 0);
	obj.position.set( x, y, z ).normalize();

	scene.add( obj );
	var helper = new THREE.DirectionalLightHelper( obj );
	scene.add(helper);
	return obj;
}

function addPointLight(obj, l) {
	var sphere = new THREE.SphereGeometry( 1, 16, 8 );
	l = new THREE.PointLight( 0xffffff, 0, 50 );
	l.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffff00 } ) ) );
	l.position.set(obj.getPositionX(), obj.getPositionY(), obj.getPositionZ());
	scene.add(l);
	return l;
}

function textureObject(obj,path){

	obj = new THREE.Object3D(); 
	var map = new THREE.TextureLoader().load( path );
	map.wrapS = map.wrapT = THREE.RepeatWrapping;
	map.anisotropy = 11;
	var material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map: map, shading: THREE.FlatShading, side: THREE.DoubleSide } );
	//new THREE.PlaneGeometry( 50, 20, 32 );
	var geometry = new THREE.BoxGeometry(100,80,5);
	var mesh = new THREE.Mesh( geometry, material );
	obj.add(mesh);
	obj.position.set(0, 50, 0);
	return obj;

}

function drawLine1(x,z){
	var material = new THREE.LineBasicMaterial({color: 0xffffff});
	var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-x, 0, z));
    geometry.vertices.push(new THREE.Vector3(x, 0, z));
    //geometry.vertices.push(new THREE.Vector3(10, 0, 0));
    var line = new THREE.Line(geometry, material);
    scene.add(line);
}

function drawLine2(x,z){
	var material = new THREE.LineBasicMaterial({color: 0xffffff});
	var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(x, 0, -z));
    geometry.vertices.push(new THREE.Vector3(x, 0, z));
    //geometry.vertices.push(new THREE.Vector3(10, 0, 0));
    var line = new THREE.Line(geometry, material);
    scene.add(line);
}

function getIndex(item){
	for(var i=0; i < InvadersArray.length; i++){
		if(item.getIdInvader() == InvadersArray[i].getIdInvader()){
			return i;
		}
	}
}

function addSpotLight(){
	spotLight = new THREE.SpotLight(0xffffff, 20, 175, Math.PI/6);
	//spotLight.castShadow = true;
	scene.add(spotLight);
}
