// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.3
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGL2DirectionnalLight
//----------------------------------------------------------------------------------------

"use strict";

class atomicGL2DirectionnalLight extends atomicGL2Light{

  /**
   * @param {Array[3]:float} direction the direction of the ray of light.
   * @param {Array[3]:float} color the color of the light
   */
	constructor(color, direction){
		super(color);
		
		this.direction = direction;
	}
}
