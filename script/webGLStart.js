// atomicGL2

// MOUSE
var mouseY;
var mouseX;

// KEYBOARD
var currentlyPressedKeys = {};
document.onkeydown 	= handleKeyDown;
document.onkeyup 	= handleKeyUp;

// GL context
var agl = new atomicGL2Context();
// matrix stack
var ams = new atomicGL2MatrixStack();
// clock
var sceneClock = new atomicGL2Clock();


// DRAW
function sceneDraw() {
	agl.initDraw();
	agl.scenegraph.draw(agl,ams);
}

// NEXTFRAME
function nextFrame() {
	handleKeys();
	agl.scenegraph.camera.update();
  requestAnimFrame(nextFrame);
  sceneDraw();
  animate();
}

// ANIMATE
function animate() {
	// increase time
	sceneClock.tick();
}

// KEYBOARD
function handleKeyDown(event) {
	currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;

	// Push [SPACE] to switch mode
	if (event.keyCode == 70) {
		agl.scenegraph.camera.isFreeCam = !agl.scenegraph.camera.isFreeCam;
		agl.scenegraph.camera.walkStep = 0.0;
		agl.scenegraph.camera.up();
	}
}

function handleKeys() {

	// CAMERA MODE
	if(agl.scenegraph.camera.isFreeCam)
	{
		// (Z) Up
		if (currentlyPressedKeys[90]) {
			if(agl.scenegraph.camera.walkStep < 2)
				agl.scenegraph.camera.walkStep += 0.05;
		}
		// (S) Down
		if (currentlyPressedKeys[83]) {
			if(agl.scenegraph.camera.walkStep > -2)
				agl.scenegraph.camera.walkStep -= 0.05;
		}
		
		agl.scenegraph.camera.up();
	}

	// WALK MODE
	else
	{
		agl.scenegraph.camera.walkStep = 0.5;

		// (D) Right
		if (currentlyPressedKeys[68]) {
			agl.scenegraph.camera.right();
		}
		// (Q) Left
		if (currentlyPressedKeys[81]) {
			agl.scenegraph.camera.left();
		}
		// (Z) Up
		if (currentlyPressedKeys[90]) {
			agl.scenegraph.camera.up();
		}
		// (S) Down
		if (currentlyPressedKeys[83]) {
			agl.scenegraph.camera.down();
		}
		// (Space) Jump
		if (currentlyPressedKeys[32]) {
			agl.scenegraph.camera.jump();
		}
	}
}

// MOUSE
function canvasDraw(agl, canvas) {
	if(mouseX != undefined && mouseY != undefined)
	{
		agl.scenegraph.camera.turnright(mouseX);
		agl.scenegraph.camera.turnup(mouseY);

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
	agl.initGL(canvas,[0.15,0.1,0.5]);

	// scenegraph creation from xml file
	var scene = document.getElementById('scene').innerHTML;
	var sgxml = new atomicGL2xml(agl,'scenes/'+scene+'.xml');

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

		canvasDraw(agl, canvas);
	}

	// init Matrix Stack
	ams.initMatrix(agl, 80); // fov = 80 degrees

	// start the animation
	nextFrame();
}
