"use strict";

//----------------------------------------------------------------------------------------
// atomicGL2SGroot extends atomicGL2SceneGraph
//----------------------------------------------------------------------------------------

class atomicGL2SGroot extends atomicGL2SceneGraph {
	constructor(name){
		super("root", name);
		// attributes
		// type = root - camera and skybox
		this.camera   = null;
		this.skyBox   = null;
		this.shaderId = "";
		// debug
		//console.log("atomicGL2SGroot extends atomicGL2SceneGraph::constructor ->"+name);
		}

	// setRootElt
	// -------------------------
	// inputs: 	cam - atomicGLCamera
	//			sk - atomicGLSkyBox
	//			sid - shader id (used by skybox)
	setRootElt (cam,sb,sid){
		this.camera   = cam;
		this.skyBox   = sb;
		this.shaderId = sid;
	}
	
	// draw
	// -------------------------
	// inputs: 	AGL - atomicGLContext
	//			AMS - atomicGLMatrixStack
	draw (AGL,AMS){
		// debug
		// console.log("atomicGLSceneGraph::draw("+this.type+","+this.name+", shaderId:"+this.shaderId+")");

		// initDraw
		AGL.initDraw();

		// push matrix
		AMS.mvIdentity();
		AMS.mvPushMatrix();

		// skyBox ----------------------------------------------------------------
		if (this.skyBox != null)
		{
			AMS.mvPushMatrix();

			// position & orientation
			AMS.mvTranslate(0.0,0.0,0.0);
			AMS.mvRotate(this.camera.phi,[1,0,0]);
			AMS.mvRotate(this.camera.theta,[0,1,0]);

			// draw
			this.skyBox.draw(AGL,AMS,this.shaderId);

			// pop matrix
			AMS.mvPopMatrix();
		}

		// camera -----------------------------------------------------------------
		if (this.camera != null){
			AMS.mvRotate(this.camera.phi,[1,0,0]);
			AMS.mvRotate(this.camera.theta,[0,1,0]);
			AMS.mvTranslate(-this.camera.xc,-this.camera.yc,-this.camera.zc);
		}

		// children
		for (var i=0; i<this.children.length; i++)
			this.children[i].draw(AGL,AMS);

		// pop
		AMS.mvPopMatrix();
	}
}
