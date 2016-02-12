// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.3
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGL2Light
//----------------------------------------------------------------------------------------
"use strict";

  /**
   * @abstract atomicGL2Light
   */
class atomicGL2Light {

	/**
   * 
   * @param {Array[3]:float} color the color of the light
   */
	constructor(color){

		//if this class is instantiate : Error exception Abstract Class
		if (this.getType() == atomicGL2Light)
      throw new TypeError("Cannot construct Abstract instances directly");
   	//if the ccolor parmaters is undefined : Error exception
   	if(typeof(color)!=Array[3] && color.length!=3)
      throw new TypeError("Please instantiate with the color parameter which is an Array of 3 float");

    /**
    * @type {Array[3]:float} color of the light
    */
		this.color = color;

    /**
    * @type {Array[3]:float} position of the light
    */      
    this.position = null;

    /**
    * @type {float} angle of the area of the SpotLight
    */
    this.radius = null;

    /**
    * @type {Array[3]:float} direction of the light
    */
    this.direction = null;
	
	}

	/**
   * @return {Array[3]:float} return the color of the light
   */
	getColor(){
		return this.color;
	}

  /*
  * @type {float} The angle of the area of the SpotLight 
  */
    getRadius(){
    return this.radius;
  }

  /**
  * @type {Array[3]:float} return the position of the light
  */
  getPosition(){
    return this.position;
  }

  /**
    * @type {Array[3]:float} return the direction of the light
    */
  getDirection(){
    return this.direction;
  }

  /**
  * @type {Array[3]:float} return the Type of the light
  */
	getType(){
		return this.constructor ;
	}
}
