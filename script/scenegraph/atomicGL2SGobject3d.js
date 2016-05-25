"use strict";

//----------------------------------------------------------------------------------------
// atomicGL2SGobject3d extends atomicGL2SceneGraph
//----------------------------------------------------------------------------------------
class atomicGL2SGobject3d extends atomicGL2SceneGraph {
	constructor(name){
		super("object3D", name);
		// attributes
		// type = object3D - object3D & shaderId
		this.object3D = null;
		//this.shaderId = -1;
		this.shaderId = ""; // also used for skybox
		// debug
		//console.log("atomicGL2SGobject3d extends atomicGL2SceneGraph::constructor ->"+this.type+" - "+this.name);

	}
	// setObject3D
	// -------------------------
	// inputs: 	o - atomicGLObj
	//			sid - shader id
	setObject3D (o,sid){
		// debug
		//console.log("atomicGL2SGobject3d extends atomicGL2SceneGraph::setObject3D ->"+this.type+" - "+this.name);

		this.object3D = o;
		this.shaderId = sid;
	}

	// draw
	// -------------------------
	// inputs: 	AGL - atomicGLContext
	//			AMS - atomicGLMatrixStack
	draw (AGL,AMS){
		// debug
		//console.log("atomicGL2SGobject3d extends atomicGL2SceneGraph::draw ->"+this.type+" - "+this.name);
		this.object3D.draw(AGL,AMS,this.shaderId);
		//this.object3D.draw(AGL,AMS,this.name);
	}
}
