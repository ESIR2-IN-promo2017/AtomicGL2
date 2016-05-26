// atomicGL2
var scaleDisplacement = 0.5;
var temp = 0;

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

//nbFrame
var f = 0;
//nb Frame per Second
var fps = 0;

var second = 0.0;

// DRAW
function sceneDraw() {
	AGL.scenegraph.draw(AGL,AMS);
}

// NEXTFRAME
function nextFrame() {
	handleKeys();
	AGL.scenegraph.camera.update();
	requestAnimFrame(nextFrame);
	sceneDraw();
	animate();
	computeFps();
	canvasWriteText();
}

// ANIMATE
function animate() {
	// increase time
	sceneClock.tick();

	var rttRotation = AGL.scenegraph.findNode("rttRotation");
	rttRotation.angle += 0.1*sceneClock.get();

	// temp += 1*sceneClock.get();
	// if(temp%2.0 == 0)
	// 	scaleDisplacement +=0.1;
	// if(scaleDisplacement>3.0)
	// 	scaleDisplacement = 0.5;

	// this.AGL.shaderPrograms.get("scaleProg").setUniformById(AGL,"scaleDisplacement",scaleDisplacement);
}

function computeFps() {
	f += 1;
	second += sceneClock.get();
	if(second > 1000.0){
		second = 0.0;
		fps = f;
		f = 0;
	}
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

	// CAMERA MODE :
	// -DYNAMIC
	// -STATIC
	if(AGL.scenegraph.camera.getType() != atomicGL2StaticCamera)
	{
		// FREE MODE
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
}

// MOUSE
function canvasDraw(AGL, canvas) {
	if(mouseX != undefined && mouseY != undefined)
	{
		if(AGL.scenegraph.camera.getType() != atomicGL2StaticCamera)
		{
			AGL.scenegraph.camera.rotationY(mouseX);
			AGL.scenegraph.camera.rotationX(mouseY);		
		}

		mouseY = 0;
		mouseX = 0;
	}
}

function canvasWriteText(){
	var debugCanvas = document.getElementById("debugCanvas");
	var ctx = debugCanvas.getContext("2d");
	ctx.clearRect(0, 0, 200,100);
	ctx.font = "35px 'Segoe UI'";
	ctx.fillStyle = 'red';
	ctx.fillText(fps + " fps",30,50);
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
	AGL.initGL(canvas,[0.0,0.0,0.0]);
	AGL.initTextureFramebuffer();
	AGL.gl.getExtension('OES_standard_derivatives');
	// scenegraph creation from xml file 	
	var scene = document.getElementById('scene').innerHTML;
	var sgxml = new atomicGL2xml(AGL,'scenes/'+scene+'.xml');

	// pointer lock object forking for cross browser
	canvas.requestPointerLock = canvas.mozRequestPointerLock;
	canvas.exitPointerLock = canvas.mozExitPointerLock;

	document.getElementById("debugCanvas").onclick = function() {
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
