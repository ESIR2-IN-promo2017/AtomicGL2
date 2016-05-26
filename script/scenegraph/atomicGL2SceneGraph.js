// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.2
// current version date: 2016/01/27
//----------------------------------------------------------------------------------------
// atomicGL2SceneGrpah
//----------------------------------------------------------------------------------------
"use strict";

class atomicGL2SceneGraph {

	// constructor
	//------------------------
	// inputs: 	stype - string
	//			nname - string
 	constructor(stype, nname){
		// attributes
		// -------------------------------------------------
		// type: string - "root" | "transform" | "object3D"
		this.type = stype;
		this.name = nname;

		// children
		this.children = [];
	}

	// methods
	// --------------------------------------------------

	// addChild
	// -------------------------
	// inputs: 	o - atomicGLSceneGrpah
	addChild(o){
		switch (this.type)
		{
			case "root":
				this.children.push(o);
			break;

			case "transform" :
				this.children.push(o);
			break;

			case "rttNode" :
				this.children.push(o);
			break;

			default: console.log("atomicGL:atomicGLSceneGraph("+this.name+"/"+this.type+"):can not add child to "+this.type);
		}
	}

	// draw
	// -------------------------
	// inputs: 	AGL - atomicGLContext
	//			AMS - atomicGLMatrixStack
	draw (AGL,AMS){}

	findNode(id){
		if(this.name == id)
			return this;

		for (var i=0;i<this.children.length;i++)
		{
			if(this.children[i].findNode(id) != null)
				return this.children[i].findNode(id);
		}

		return null;
	}
}
