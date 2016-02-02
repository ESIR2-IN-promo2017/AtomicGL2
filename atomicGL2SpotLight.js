// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.3
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGL2SpotLight
//----------------------------------------------------------------------------------------

class atomicGL2SpotLight extends atomicGL2Light {
	// constructor
	//------------------------
	// inputs
	//------------------------
	// ccolor	   	: Light color
	// pposition 	: Light position
	// ddirection	: Light direction
	// rradius		: Light radius

	constructor(ccolor, pposition, ddirection, rradius){
		// attributes
		// -------------------------------------------------
		// GL lights
		super(ccolor);
		this.position = pposition;
		this.direction = ddirection;
		this.radius = rradius;
	}
}
