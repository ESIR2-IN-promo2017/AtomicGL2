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
	// ccolor 		: Light color
	// nname		: nname attribute of the ligth 
	constructor(ccolor){

		//if this class is instantiate : Error exception Abstract Class
		if (this.getType() == atomicGL2Light)
      		throw new TypeError("Cannot construct Abstract instances directly");
   		//if the ccolor parmaters is undefined : Error exception
   		if(typeof(ccolor)!=Array[3] && ccolor.length!=3)
      		throw new TypeError("Please instantiate with the color parameter which is an Array of 3 float");

/*      	if(typeof(nname)!==String)
			nname = "warning : the identifier of the light was not initialized";*/

		// attributes
		// -------------------------------------------------
		// GL lights
		this.color = ccolor;
/*		this.name = nname;*/
		
		this.position = null;
		this.direction = null;
		this.radius = null;
	}

/*	getName(){
		return this.name;
	}
*/
	getColor(){
		return this.color;
	}

	getPosition(){
		return this.position;
	}

	getDirection(){
		return this.direction;
	}

	getRadius(){
		return this.radius;
	}

	getType(){
		return this.constructor ;
	}
}
