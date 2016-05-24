// atomicGL2
var scaleDisplacement = 0.5;

// MOUSE
var mouseY;
var mouseX;

// KEYBOARD
var currentlyPressedKeys = {};
document.onkeydown 	= handleKeyDown;
document.onkeyup 	= handleKeyUp;

// GL context
var AGL = new atomicGL2Context();
// matrix stack
var AMS = new atomicGL2MatrixStack();
// clock
var sceneClock = new atomicGL2Clock();


// DRAW
function sceneDraw() {
	AGL.initDraw();
	AGL.scenegraph.draw(AGL,AMS);
}

// NEXTFRAME
function nextFrame() {
	handleKeys();
	AGL.scenegraph.camera.update();
	requestAnimFrame(nextFrame);
	sceneDraw();
	animate();
}

// ANIMATE
function animate() {
	// increase time
	sceneClock.tick();

	var transformSphere = AGL.scenegraph.findNode("rotate_PointLight0");
	transformSphere.angle += 0.2*sceneClock.get();


	// if(scaleDisplacement == 0.5)
	// 	scaleDisplacement = 2.0;
	// else
	// 	scaleDisplacement = 0.5

	// this.AGL.shaderPrograms.get("deformationProg").setUniformById(AGL,"random",2.0);

	// var transformCube = AGL.scenegraph.findNode("transform_cube");
	// transformCube.angle += 0.1*sceneClock.get();
}

// KEYBOARD
function handleKeyDown(event) {
	currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;

	// Push (F) to switch mode
	if (event.keyCode == 70) {
		AGL.scenegraph.camera.isFreeCam = !AGL.scenegraph.camera.isFreeCam;
		if(AGL.scenegraph.camera.isFreeCam) {
			AGL.scenegraph.camera.isFreeCam = true;
			AGL.scenegraph.camera.jumping   = true;
			AGL.scenegraph.camera.jumpDown  = true;
		} else {
			AGL.scenegraph.camera.walkStep = 0.0;
			AGL.scenegraph.camera.up();
		}
	}
}

function handleKeys() {

	// CAMERA MODE
	if(AGL.scenegraph.camera.isFreeCam)
	{
		// (Z) Up
		if (currentlyPressedKeys[90]) {
			if(AGL.scenegraph.camera.walkStep < 2)
				AGL.scenegraph.camera.walkStep += 0.05;
		}
		// (S) Down
		if (currentlyPressedKeys[83]) {
			if(AGL.scenegraph.camera.walkStep > -2)
				AGL.scenegraph.camera.walkStep -= 0.05;
		}

		AGL.scenegraph.camera.up();
	}

	// WALK MODE
	else
	{
		AGL.scenegraph.camera.walkStep = 0.5;

		// (D) Right
		if (currentlyPressedKeys[68]) {
			AGL.scenegraph.camera.right();
		}
		// (Q) Left
		if (currentlyPressedKeys[81]) {
			AGL.scenegraph.camera.left();
		}
		// (Z) Up
		if (currentlyPressedKeys[90]) {
			AGL.scenegraph.camera.up();
		}
		// (S) Down
		if (currentlyPressedKeys[83]) {
			AGL.scenegraph.camera.down();
		}
		// (Space) Jump
		if (currentlyPressedKeys[32]) {
			AGL.scenegraph.camera.jump();
		}
	}
}

// MOUSE
function canvasDraw(AGL, canvas) {
	if(mouseX != undefined && mouseY != undefined)
	{
		AGL.scenegraph.camera.rotationY(mouseX);
		AGL.scenegraph.camera.rotationX(mouseY);

		mouseY = 0;
		mouseX = 0;
	}
}

//webGLStart
function webGLStart()
{
	// init
	// ---------------------
	// recover OpenGL canvas
	var element = document.pointerLockElement;
	var canvas = document.getElementById("oglcanvas");
	// init OpenGL context
	// canvas, background color
	AGL.initGL(canvas,[0.15,0.1,0.5]);

	AGL.gl.getExtension('OES_standard_derivatives');

	// scenegraph creation from xml file
	var scene = document.getElementById('scene').innerHTML;
	var sgxml = new atomicGL2xml(AGL,'scenes/'+scene+'.xml');

	// pointer lock object forking for cross browser
	canvas.requestPointerLock = canvas.mozRequestPointerLock;
	canvas.exitPointerLock = canvas.mozExitPointerLock;

	canvas.onclick = function() {
		canvas.requestPointerLock();
	}

	// Hook pointer lock state change events for different browsers
	document.addEventListener("mozpointerlockchange", lockChangeAlert, false);

	function lockChangeAlert() {
		if(document.mozPointerLockElement == canvas) {
			console.log('The pointer lock status is now locked');
	    	document.addEventListener("mousemove", canvasLoop, false);
		} else {
	    	console.log('The pointer lock status is now unlocked');
	    	document.removeEventListener("mousemove", canvasLoop, false);
	  	}
	}

	function canvasLoop(e) {
		mouseX = e.mozMovementX;
		mouseY = e.mozMovementY;

		canvasDraw(AGL, canvas);
	}

	// init Matrix Stack
	AMS.initMatrix(AGL, 80); // fov = 80 degrees

	// start the animation
	nextFrame();
}
