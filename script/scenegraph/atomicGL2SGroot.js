"use strict";

//----------------------------------------------------------------------------------------
// atomicGL2SGroot extends atomicGL2SceneGraph
//----------------------------------------------------------------------------------------

class atomicGL2SGroot extends atomicGL2SceneGraph {
	constructor(name){
		super("root", name);
		// attributes
		// type = root - camera and skybox
		this.camera   = null ;
		this.skyBox   = null ;
		this.shaderId = "" ;
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
	// inputs: 	agl - atomicGLContext
	//			ams - atomicGLMatrixStack
	draw (agl,ams){
		// debug
		// console.log("atomicGLSceneGraph::draw("+this.type+","+this.name+", shaderId:"+this.shaderId+")");

		// initDraw
		agl.initDraw();

		// push matrix
		ams.mvIdentity();
		ams.mvPushMatrix();

		// skyBox ----------------------------------------------------------------
		if (this.skyBox != null)
		{
			ams.mvPushMatrix();

			// position & orientation
			ams.mvTranslate(0.0,0.0,0.0);
			ams.mvRotate(this.camera.phi,[1,0,0]);
			ams.mvRotate(this.camera.theta,[0,1,0]);

			// draw
			this.skyBox.draw(agl,ams,this.shaderId);

			// pop matrix
			ams.mvPopMatrix();
		}

		// camera -----------------------------------------------------------------
		if (this.camera != null){
			ams.mvRotate(this.camera.phi,[1,0,0]);
			ams.mvRotate(this.camera.theta,[0,1,0]);
			ams.mvTranslate(-this.camera.xc,-this.camera.yc,-this.camera.zc);
		}

		// children
		for (var i=0; i<this.children.length ; i++)
			this.children[i].draw(agl,ams);

		// pop
		ams.mvPopMatrix();
	}
}
