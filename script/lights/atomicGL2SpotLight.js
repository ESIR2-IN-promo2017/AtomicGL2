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

	constructor(color, position, direction, radius){
		//if the direction parmaters is an  incorrect parameter : Error exception
   		if(typeof(direction)!=Array && direction.length != 3)
      		throw new TypeError("Please instantiate the "+this.getType()+" with the ddirection parameter");

      	//if radius paramater is an incorrect parameter
		if(isNaN(parseFloat(radius)) && isFinite(radius))
      		throw new TypeError("Please instantiate the "+this.getType()+" with the radius parameter");

		//if the position parmaters is  an  incorrect parameter : Error exception
   		if(typeof(position)!=Array && position.length != 3)
      		throw new TypeError("Please instantiate the "+this.getType()+" with the position parameter");

		// attributes
		// -------------------------------------------------
		// GL lights
		super(color);
		this.position = position;
		this.direction = direction;
		this.radius = radius;
	}
}
