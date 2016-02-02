

class AtomicGL2DirectionnalLigth extends AtomicGL2Light{

	// constructor
	//------------------------
	// inputs
	//------------------------
	// ffile: 		texture filename - string
	// ttype:		texture type : color | normal | displacement | specular | opacity - string
	// aagl:		atomicGL context
	constructor(ccolor, ddirection){
		super(ccolor);
		this.direction = ddirection;
	}
}