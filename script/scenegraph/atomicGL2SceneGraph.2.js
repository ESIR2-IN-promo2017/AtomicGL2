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
		this.name = nname ;

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

			default: console.log("atomicGL:atomicGLSceneGraph("+this.name+"/"+this.type+"):can not add child to "+this.type);
		}
	}

	// draw
	// -------------------------
	// inputs: 	agl - atomicGLContext
	//			ams - atomicGLMatrixStack
	draw (agl,ams){}

	// toDEBUG
	// -------------------------
	toDEBUG (){
		console.log("atomicGLSceneGraph::");
		this.toDEBUG2("--");
	}

	// toDEBUG(param)
	// -------------------------
	// inputs: p - string
	toDEBUG2(p){
		var s = p+this.name+"("+this.type+")";
		console.log(s);
		console.log(p+"----------------------------");

		switch(this.type)
		{
			case "root":
			break;

			case "transform":
				// type= transform - translation & rotation
				console.log(p+ ">translate:["+this.translate[0]+","+this.translate[1]+","+this.translate[2]+"]");
				console.log(p+ ">rotAxis:["+this.rotAxis[0]+","+this.rotAxis[1]+","+this.rotAxis[2]+"]");
				console.log(p+ ">angle:"+this.rotation);
				console.log(p+"----------------------------");
			break;

			case "object":
			break;
		}

		for (var i=0;i<this.children.length;i++)
			this.children[i].toDEBUG2(p+"--");
	}
}
