// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.3
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGL2DirectionnalLigth
//----------------------------------------------------------------------------------------


class atomicGL2DirectionnalLigth extends atomicGL2Light{

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

	getDirection(){
		return this.direction;
	}

	getType(){
		return "DirectionnalLight";
	}
}
