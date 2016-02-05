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
	constructor(ccolor, nname){
		if (new.target === atomicGL2Light) {
      		throw new TypeError("Cannot construct Abstract instances directly");
   		}
   	
		// attributes
		// -------------------------------------------------
		// GL lights
		this.color = ccolor;
		this.name = nname;
	}

	getName(){
		return this.name;
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

	getType(){
		return null;
	}
}
