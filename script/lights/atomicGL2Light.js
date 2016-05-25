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
	    this.globalPosition = [0.0,0.0,0.0];

	    /**
	    * @type {float} angle of the area of the SpotLight
	    */
	    this.radius = 0.0;

	    /**
	    * @type {Array[3]:float} direction of the light
	    */
		this.direction = [0.0,0.0,0.0];
	    this.globalDirection = [0.0,0.0,0.0];

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
        return this.constructor;
    }

    draw(AMS){
        var vPosition = [this.globalPosition[0], this.globalPosition[1], this.globalPosition[2], 1.0];
        var resultPosition = [0.0,0.0,0.0,0.0];

        resultPosition[0] = AMS.mvMatrix[0]  * vPosition[0]
		        		  + AMS.mvMatrix[4]  * vPosition[1]
		        		  + AMS.mvMatrix[8]  * vPosition[2]
		        		  + AMS.mvMatrix[12] * vPosition[3];

        resultPosition[1] = AMS.mvMatrix[1]  * vPosition[0]
		        		  + AMS.mvMatrix[5]  * vPosition[1]
		        		  + AMS.mvMatrix[9]  * vPosition[2]
		        		  + AMS.mvMatrix[13] * vPosition[3];

        resultPosition[2] = AMS.mvMatrix[2]  * vPosition[0]
		        		  + AMS.mvMatrix[6]  * vPosition[1]
		        		  + AMS.mvMatrix[10] * vPosition[2]
		        		  + AMS.mvMatrix[14] * vPosition[3];

        resultPosition[3] = AMS.mvMatrix[3]  * vPosition[0]
						  + AMS.mvMatrix[7]  * vPosition[1]
						  + AMS.mvMatrix[11] * vPosition[2]
						  + AMS.mvMatrix[15] * vPosition[3];

		this.position[0] = resultPosition[0]/resultPosition[3];
		this.position[1] = resultPosition[1]/resultPosition[3];
		this.position[2] = resultPosition[2]/resultPosition[3];


		var vDirection = [this.globalDirection[0], this.globalDirection[1], this.globalDirection[2], 0.0];
        var resultDirection = [0.0,0.0,0.0,0.0];

        resultDirection[0] = AMS.mvMatrix[0]  * vDirection[0]
		        		   + AMS.mvMatrix[4]  * vDirection[1]
		        		   + AMS.mvMatrix[8]  * vDirection[2]
		        		   + AMS.mvMatrix[12] * vDirection[3];

        resultDirection[1] = AMS.mvMatrix[1]  * vDirection[0]
		        		   + AMS.mvMatrix[5]  * vDirection[1]
		        		   + AMS.mvMatrix[9]  * vDirection[2]
		        		   + AMS.mvMatrix[13] * vDirection[3];

        resultDirection[2] = AMS.mvMatrix[2]  * vDirection[0]
		        		   + AMS.mvMatrix[6]  * vDirection[1]
		        		   + AMS.mvMatrix[10] * vDirection[2]
		        		   + AMS.mvMatrix[14] * vDirection[3];

        resultDirection[3] = AMS.mvMatrix[3]  * vDirection[0]
		        		   + AMS.mvMatrix[7]  * vDirection[1]
		        		   + AMS.mvMatrix[11] * vDirection[2]
		        		   + AMS.mvMatrix[15] * vDirection[3];

		this.direction[0] = resultDirection[0];
		this.direction[1] = resultDirection[1];
		this.direction[2] = resultDirection[2];
    }
}
