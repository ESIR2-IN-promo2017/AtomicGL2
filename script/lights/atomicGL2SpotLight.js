// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.3
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGL2SpotLight
//----------------------------------------------------------------------------------------

"use strict";

 /**
 * @extends {atomicGL2Light}
 */
class atomicGL2SpotLight extends atomicGL2Light {
	/**
	The constructor of atomicGL2SpotLight
   * @param {Array[3]:float} position the position of the spotlight
   * @param {Array[3]:float} color the color of the spotlight
   * @param {Array[3]:float} direction the direction of the spotlight
   * @param {float} radius the radius of the area of the spotlight
   */
	constructor(color, position, direction, radius){
		//if the direction parmaters is an  incorrect parameter : Error exception
		if(typeof(direction)!=Array && direction.length != 3)
    	throw new TypeError("Please instantiate the "+this.getType()+" with the ddirection parameter");

  	//if radius paramater is an incorrect parameter
		if(isNaN(parseFloat(radius)) && isFinite(radius))
    	throw new TypeError("Please instantiate the "+this.getType()+" with the radius parameter");

		//if the position parmaters is  an  incorrect parameter : Error exception
   	if(typeof(position)!=Array && position.length != 3)
    	throw new TypeError("Please instantiate the "+this.getType()+" with the position parameter");

		super(color);

		/**
     	* @type {Array[3]:float}  of the SpotLight
     	*/
		this.position = position;

		/**
     	* @type {Array[3]:float} direction of the SpotLight
     	*/
		this.direction = direction;

		/**
     	* @type {float} angle of the area of the SpotLight
     	*/
		this.radius = radius;
	}
}
