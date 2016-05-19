"use strict";

//----------------------------------------------------------------------------------------
// atomicGL2SGobject3d extends atomicGL2SceneGraph
//----------------------------------------------------------------------------------------
class atomicGL2SGLight extends atomicGL2SceneGraph {
	constructor(name){
		super("light", name);
		// attributes
		this.light = null;

	}
	// setLight
	// -------------------------
	// inputs: 	light - light
	setLight (light){
		// debug
		this.light = light;
	}

	// draw
	// -------------------------
	// inputs: 	AGL - atomicGLContext
	//			AMS - atomicGLMatrixStack
	draw (AGL, AMS){
		// debug
		//console.log("atomicGL2SGobject3d extends atomicGL2SceneGraph::draw ->"+this.type+" - "+this.name);
		this.light.draw(AMS);
	}
}
