"use strict";

//----------------------------------------------------------------------------------------
// atomicGL2SGtransform extends atomicGL2SceneGraph
//----------------------------------------------------------------------------------------
class atomicGL2SGtransform extends atomicGL2SceneGraph {
	constructor(name){
		super("transform", name);
		// attributes
		// type= transform - translation & rotation
		this.translate = [0.0,0.0,0.0];
		this.rotAxis   = [0.0,1.0,0.0];
		this.rotation  = 0.0 ;
		// debug
		//console.log("atomicGL2SGtransform extends atomicGL2SceneGraph::constructor ->"+this.type+" - "+this.name);
	}

	// setTransform
	// -------------------------
	// inputs: 	tr - vec3: translation vector
	//			ax - vec3: rotation axis vector
	//			ro - float: rotationangle
	setTransform(tr,ax,ro){
		this.translate = tr;
		this.rotAxis   = ax;
		this.rotation  = ro ;
	}

	// draw
	// -------------------------
	// inputs: 	AGL - atomicGLContext
	//			AMS - atomicGLMatrixStack
	draw (AGL,AMS){
		// debug
		// console.log("atomicGLSceneGraph::draw("+this.type+","+this.name+", shaderId:"+this.shaderId+")");

		// matrix
		AMS.mvPushMatrix();

		// position & orientation
		AMS.mvTranslate(this.translate[0],this.translate[1],this.translate[2]);
		AMS.mvRotate(this.rotation,this.rotAxis);

		// children
		for (var i=0; i<this.children.length ; i++)
			this.children[i].draw(AGL,AMS);

		// matrix pop
		AMS.mvPopMatrix();
	}
}
