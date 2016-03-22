// for mouse
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var mouseY;
var mouseX;

document.onmousemove = handleMouseMove;

var currentlyPressedKeys = {};
//	keyboard callbacks
document.onkeydown 	= handleKeyDown;
document.onkeyup 	= handleKeyUp;

// atomicGL
// -------------------------------------------------
// GL context
var agl = new atomicGL2Context();
// matrix stack
var ams = new atomicGL2MatrixStack();
// clock
var sceneClock = new atomicGL2Clock();
// -------------------------------------------------


// draw
// -----------------------------
function sceneDraw() {
	agl.initDraw();
	agl.scenegraph.draw(agl,ams);
}

// nextFrame
// -----------------------------
function nextFrame() {
	handleKeys();
	agl.scenegraph.camera.update();
  requestAnimFrame(nextFrame);
  sceneDraw();
  animate();
}

// animate
// ------------------------------
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
}

function handleKeys() {
	// (C) debug
	if (currentlyPressedKeys[67]) {
		console.log('atomicGL - Rémi COZOT - 2015');
	}
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

// MOUSE
function handleMouseMove(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}

function degToRad(degrees) {
	var result = Math.PI/180 * degrees;
	return result;
}

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
	var scene = document.getElementById('id').innerHTML;
	var sgxml = new atomicGL2xml(agl, 'scenes/'+scene+'.xml');

	// pointer lock object forking for cross browser
	canvas.requestPointerLock =
		canvas.requestPointerLock ||
		canvas.mozRequestPointerLock;

	document.exitPointerLock =
		document.exitPointerLock ||
		document.mozExitPointerLock;

	canvas.onclick = function() {
		canvas.requestPointerLock();
	}

	// Hook pointer lock state change events for different browsers
	document.addEventListener('pointerlockchange', lockChangeAlert, false);
	document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

	// Hook mouse move events
	document.addEventListener("mousemove", this.moveCallback, false);

	function lockChangeAlert() {
		if(document.pointerLockElement === canvas ||
		document.mozPointerLockElement === canvas) {
			console.log('The pointer lock status is now locked');
	    	document.addEventListener("mousemove", canvasLoop, false);
		} else {
	    	console.log('The pointer lock status is now unlocked');
	    	document.removeEventListener("mousemove", canvasLoop, false);
	  	}
	}

	function canvasLoop(e) {
		var movementX = e.mozMovementX;
		var movementY = e.mozMovementY;

		mouseX = movementX;
		mouseY = movementY;

		canvasDraw(agl, canvas);

		var animation = requestAnimationFrame(canvasLoop);
	}

	// init Matrix Stack
	ams.initMatrix(agl, 45); // fov = 45 degrees

	// start the animation
	nextFrame();
}
