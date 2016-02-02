// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.3
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGL2PointLight
//----------------------------------------------------------------------------------------
import atomicGL2Light from "AtomicGL2";

class atomicGL2PointLight extends atomicGL2Light {
	// constructor
	//------------------------
	// inputs
	//------------------------
	// ccolor	   : Light color
	// pposition : Light position

	constructor(ccolor, pposition){
		// attributes
		// -------------------------------------------------
		// GL lights
		super(ccolor);
		this.position = pposition;
	}

	getType(){
		return "PointLight";
	}

	getPosition(){
		return this.position;
	}
}
