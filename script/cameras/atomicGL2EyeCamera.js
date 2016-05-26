"use strict";

// constructor
//------------------------
class atomicGL2EyeCamera extends atomicGL2Camera{
	constructor(){
		super([0.0,0.0,0.0]);
	}

	rotationY(a) {
		this.theta += this.rot*a;
	}

	rotationX(a){
		var displaceY = this.phi + this.rot*a;
		if((displaceY > -90) && (displaceY < 90))
		this.phi = displaceY;
	}	
}