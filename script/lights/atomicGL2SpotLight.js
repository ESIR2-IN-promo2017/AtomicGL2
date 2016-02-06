// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.3
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGL2SpotLight
//----------------------------------------------------------------------------------------

"use strict";

class atomicGL2SpotLight extends atomicGL2Light {
	// constructor
	//------------------------
	// inputs
	//------------------------
	// ccolor	   	: Light color
	// pposition 	: Light position
	// ddirection	: Light direction
	// rradius		: Light radius

	constructor(ccolor, pposition, ddirection, rradius, nname){
		//if the direction parmaters is an  incorrect parameter : Error exception
   		if(typeof(ddirection)!=Array && ddirection.length != 3)
      		throw new TypeError("Please instantiate the "+this.getType()+" with the ddirection parameter");

      	//if radius paramater is an incorrect parameter
		if(isNaN(parseFloat(rradius)) && isFinite(rradius))
      		throw new TypeError("Please instantiate the "+this.getType()+" with the radius parameter");

		//if the position parmaters is  an  incorrect parameter : Error exception
   		if(typeof(pposition)!=Array && pposition.length != 3)
      		throw new TypeError("Please instantiate the "+this.getType()+" with the position parameter");

		// attributes
		// -------------------------------------------------
		// GL lights
		super(ccolor,nname);
		this.position = pposition;
		this.direction = ddirection;
		this.radius = rradius;
	}
}
