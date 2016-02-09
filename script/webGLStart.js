	// for mouse
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	var mouseX = 0.0;
	var mouseY = 0.0;
	document.onmousemove = onDocumentMouseMove;

	var currentlyPressedKeys = {};
	//	keyboard callbacks
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

	// atomicGL
	// -------------------------------------------------
	// GL context
	var agl = new atomicGL2Context();
	// matrix stack
	var ams = new atomicGL2MatrixStack();
	// clock
	var sceneClock = new atomicGL2Clock() ;
	// -------------------------------------------------


// draw
// -----------------------------
function sceneDraw(){
	agl.initDraw();



	agl.scenegraph.draw(agl,ams);

}

// nextFrame
// -----------------------------
function nextFrame() {
	handleKeys();
    requestAnimFrame(nextFrame);
    sceneDraw();
    animate();
}

// animate
// ------------------------------
function animate(){
	// increase time
	var textProg = agl.getShaderProgram("textProg");
	textProg.setUniformById(agl,"test",2.2);
	sceneClock.tick() ;
}

// keyboard
// --------------------------------
function handleKeyDown(event) 	{ currentlyPressedKeys[event.keyCode] = true;}
function handleKeyUp(event) 	{currentlyPressedKeys[event.keyCode] = false;}

function handleKeys() {
	if (Math.abs(mouseX)>0.1){
		agl.scenegraph.camera.turnright(1.0*(mouseX*mouseX*mouseX));
	}
	agl.scenegraph.camera.turnup(45*mouseY);
	if (currentlyPressedKeys[67]) // (C) debug
	{
		// debug
		console.log('atomicGL - Rémi COZOT - 2015');
	}
	if (currentlyPressedKeys[68]) // (D) Right
	{
		// debug
		agl.scenegraph.camera.right();		}
	if (currentlyPressedKeys[81]) // (Q) Left
	{
		// debug
		agl.scenegraph.camera.left();			//
	}
	if (currentlyPressedKeys[90]) // (Z) Up
	{
		// debug
		agl.scenegraph.camera.up();			//
	}
	if (currentlyPressedKeys[83]) // (S) Down
	{
		// debug
		agl.scenegraph.camera.down();			//
	}
}

// mouse
// ------------------------------
function onDocumentMouseMove( event ) {
	omouseX = mouseX ;
	mouseX  = ( event.clientX - windowHalfX ) / windowHalfX;
	mouseY  = ( event.clientY - windowHalfY ) / windowHalfY;
}

	//webGLStart
function webGLStart() {
	// init
	// -----------------------------
	// recover OpenGL canvas
	var canvas = document.getElementById("oglcanvas");

	// init OpenGL context
	// canvas, background color
	agl.initGL(canvas,[0.15,0.1,0.5]);

	// scenegraph creation from xml file

	var scene = document.getElementById('id').innerHTML;
	var sgxml = new atomicGL2xml(agl,'./scenes/'+scene+'.xml');

	//var r = new atomicGL2SpotLight([0.5, 0.5, 0.5], [0, 1, 0], [0, 1, 0],1.0,"test");

	// light
	agl.pushLight("Sun",new atomicGL2PointLight([0.5, 0.5, 0.5], [0, 1, 0]));
	agl.ambientLightColor = [0.1,0.05,0.0];	// color

	// init Matrix Stack
	ams.initMatrix(agl,45); // fov = 45 degrees

	// start the animation
	nextFrame();
}
