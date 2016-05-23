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
class atomicGL2Light{

	/**
   *
   * @param {Array[3]:float} color the color of the light
   */
	constructor(color,intensity){

		//if this class is instantiate : Error exception Abstract Class
		if (this.getType() == atomicGL2Light)
	    	throw new TypeError("Cannot construct Abstract instances directly");

		//if the ccolor parmaters is undefined : Error exception
	   	if(typeof(color)!=Array[3] && color.length!=3)
	      throw new TypeError("Please instantiate with the color parameter which is an Array of 3 float");

		if(Number(intensity) === intensity && intensity % 1 !== 0)
	      throw new TypeError("Please instantiate with the intensity parameter which is a float");

	    /**
	    * @type {Array[3]:float} color of the light
	    */
		this.color = color;

	    /**
	    * @type {float} intensity of the light
	    */
	    this.intensity = intensity;

	    /**
	    * @type {Array[3]:float} position of the light
	    */
	    this.position = [0.0,0.0,0.0];

	    /**
	    * @type {float} angle of the area of the SpotLight
	    */
	    this.radius = 0.0;

	    /**
	    * @type {Array[3]:float} direction of the light
	    */
	    this.direction = [0.0,0.0,0.0];

		this.children = null;
	}

	/**
   * @return {Array[3]:float} return the color of the light
   */
	getColor(){
		return this.color;
	}

    /**
    * @return {float} return the intensity of the light
    */
    getIntensity(){
        return this.intensity;
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

<<<<<<< HEAD
    draw(AMS)
    { 
        if(this.position != null)
        {
            this.position[0] = AMS.mvMatrix[12];
            this.position[1] = AMS.mvMatrix[13];
            this.position[2] = AMS.mvMatrix[14];
        }
=======
    draw(AMS){
		// var vPosition = [this.position[0], this.position[1], this.position[2], 1.0];
		//
		// var mvPosition = [0,0,0,0];
		// for(var i=0; i<4; i++){
		// 	var value = 0;
		// 	for(var k=0; k<4; k++){
		// 		value += AMS.mvMatrix[i*4 + k] * vPosition[k];
		// 	}
		// 	mvPosition[i] = value;
		// }
		//
		// var newPosition = [0,0,0,0];
		// for(var i=0; i<4; i++){
		// 	var value = 0;
		// 	for(var k=0; k<4; k++){
		// 		value += AMS.pMatrix[i*4 + k] * mvPosition[k];
		// 	}
		// 	newPosition[i] = value;
		// }
		//
		// this.position[0] = newPosition[0]/newPosition[3];
        // this.position[1] = newPosition[1]/newPosition[3];
		// this.position[2] = newPosition[2]/newPosition[3];
		//
        // console.log(this.position);
>>>>>>> 19950d7a1a485a7bedb287c428fc30f32c3791e9
    }
}
