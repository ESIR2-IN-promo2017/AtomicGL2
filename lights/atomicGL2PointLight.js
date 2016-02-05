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

	constructor(ccolor,pposition,nname){
		// attributes
		// -------------------------------------------------
		// GL lights
		super(ccolor,nname);
		if(typeof(nname)=="undefined")
		{
			nname = "warning : the identifier of the light was not initialized";
		}
		this.position = pposition;
		
	}

	getPosition(){
		return this.position;
	}

	getType(){
		return "PointLight";
	}
}
