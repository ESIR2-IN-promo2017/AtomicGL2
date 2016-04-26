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


	// draw
	// -------------------------
	// inputs: 	agl - atomicGLContext
	//			ams - atomicGLMatrixStack
	draw (agl, ams){
		// var mvPosition = [ams.mvMatrix[12], ams.mvMatrix[13], ams.mvMatrix[14], 1.0];
		var mvPosition = [this.position[0], this.position[1], this.position[2], 1.0];
		var pPosition = [0.0,0.0,0.0,0.0];


		pPosition[0] = ams.mvMatrix[0] * mvPosition[0]
						 + ams.mvMatrix[4] * mvPosition[1]
						 + ams.mvMatrix[8] * mvPosition[2]
						 + ams.mvMatrix[12] * mvPosition[3];

		pPosition[1] = ams.mvMatrix[1] * mvPosition[0]
						 + ams.mvMatrix[5] * mvPosition[1]
						 + ams.mvMatrix[9] * mvPosition[2]
						 + ams.mvMatrix[13] * mvPosition[3];

		pPosition[2] = ams.mvMatrix[2] * mvPosition[0]
						 + ams.mvMatrix[6] * mvPosition[1]
						 + ams.mvMatrix[10] * mvPosition[2]
						 + ams.mvMatrix[14] * mvPosition[3];

		pPosition[3] = ams.mvMatrix[3] * mvPosition[0]
						 + ams.mvMatrix[7] * mvPosition[1]
						 + ams.mvMatrix[11] * mvPosition[2]
						 + ams.mvMatrix[15] * mvPosition[3];


		this.position[0] = pPosition[0];
		this.position[1] = pPosition[1];
		this.position[2] = pPosition[2];
		var homogeneous = pPosition[3];

		this.position[0] = ams.pMatrix[0] * pPosition[0]
						 + ams.pMatrix[4] * pPosition[1]
						 + ams.pMatrix[8] * pPosition[2]
						 + ams.pMatrix[12] * pPosition[3];

		this.position[1] = ams.pMatrix[1] * pPosition[0]
						 + ams.pMatrix[5] * pPosition[1]
						 + ams.pMatrix[9] * pPosition[2]
						 + ams.pMatrix[13] * pPosition[3];

		this.position[0] = ams.pMatrix[2] * pPosition[0]
						 + ams.pMatrix[6] * pPosition[1]
						 + ams.pMatrix[10] * pPosition[2]
						 + ams.pMatrix[14] * pPosition[3];

		var homogeneous = ams.pMatrix[3] * pPosition[0]
						 + ams.pMatrix[7] * pPosition[1]
						 + ams.pMatrix[11] * pPosition[2]
						 + ams.pMatrix[15] * pPosition[3];

		this.position[0] /= homogeneous
		this.position[1] /= homogeneous;
		this.position[2] /= homogeneous;

		console.log(pPosition);
	}
}
