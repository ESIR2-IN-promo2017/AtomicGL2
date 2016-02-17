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
	
	/**
   * @param {Array[3]:float} color the color of the light
   * @param {Array[3]:float} position the position of the Pointlight.
   */
	constructor(color,position,intensity){
		super(color,intensity);
		
		//if the position parmaters is undefined : Error exception
   		if(typeof(position)!=Array && position.length != 3)
      		throw new TypeError("Please instantiate the "+this.getType()+" with the position parameter");

		/**
     	* @type {Array[3]:float} position of the light
     	*/     	
		this.position = position;
	}
}
