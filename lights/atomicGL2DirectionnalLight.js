// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.3
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGL2DirectionnalLigth
//----------------------------------------------------------------------------------------

"use strict";

class atomicGL2DirectionnalLigth extends atomicGL2Light{

	// constructor
	//------------------------
	// inputs
	//------------------------
	// ccolor	   	: Light color
	// ddirection	: Light direction

	constructor(ccolor, ddirection, nname){
		super(ccolor,nname);
		
		this.direction = ddirection;
	}
}
