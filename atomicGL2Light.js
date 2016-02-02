// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.3
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGL2Light
//----------------------------------------------------------------------------------------

class atomicGL2Light {
	// constructor
	//------------------------
	// inputs
	//------------------------
	// ccolor	   : Light color

	constructor(ccolor){
		// attributes
		// -------------------------------------------------
		// GL lights
		this.color = ccolor;
	}

	getColor(){
		return this.color;
	}

	getPosition(){
		return null;
	}

	getDirection(){
		return null;
	}

	getRadius(){
		return null;
	}
}
