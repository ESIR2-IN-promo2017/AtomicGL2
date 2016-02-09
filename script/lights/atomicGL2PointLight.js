// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.3
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGL2PointLight
//----------------------------------------------------------------------------------------

"use strict";

class atomicGL2PointLight extends atomicGL2Light{
	// constructor
	//------------------------
	// inputs
	//------------------------
	// ccolor	   : Light color
	// pposition : Light position

	constructor(ccolor,pposition){
		// attributes
		// -------------------------------------------------
		// GL lights
		super(ccolor);
		
		//if the position parmaters is undefined : Error exception
   		if(typeof(pposition)!=Array && pposition.length != 3)
      		throw new TypeError("Please instantiate the "+this.getType()+" with the position parameter");

		this.position = pposition;
	}
}
