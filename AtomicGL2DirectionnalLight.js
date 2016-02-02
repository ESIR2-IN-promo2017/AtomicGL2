// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.3
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// AtomicGL2DirectionnalLigth
//----------------------------------------------------------------------------------------


class AtomicGL2DirectionnalLigth extends AtomicGL2Light{

	// constructor
	//------------------------
	// inputs
	//------------------------
	// ccolor	   	: Light color
	// ddirection	: Light direction

	constructor(ccolor, ddirection){
		super(ccolor);
		this.direction = ddirection;
	}
}
