"use strict";

// constructor
//------------------------
class atomicGL2Camera {
	constructor(position){
		// attributes
		// -------------------------------------------------
		// camera orientation
		this.theta = 0.0;
		this.phi = 0.0;

		// rot
		this.rot = 0.5;

		// camera position
		this.xc = position[0];
		this.yc = position[1];
		this.zc = position[2];
	}

	getType(){
		return this.constructor;
	}

	update(){
	}
}