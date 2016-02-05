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
		//if the position parmaters is undefined : Error exception
   		if(typeof(ddirection)!=Array && ddirection.length != 3)
      		throw new TypeError("Please instantiate the "+this.getType()+" with the ddirection parameter");

		if(typeof(rradius)!=float && ddirection.length != 1)
      		throw new TypeError("Please instantiate the "+this.getType()+" with the radius parameter");
      	

		// attributes
		// -------------------------------------------------
		// GL lights
		super(ccolor,nname);
		this.position = pposition;
		this.direction = ddirection;
		this.radius = rradius;
	}
}
