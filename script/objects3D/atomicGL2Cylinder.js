"use strict";

//----------------------------------------------------------------------------------------
// atomicGL2Cylinder  extends atomicGLObject3d
//----------------------------------------------------------------------------------------

class atomicGL2Cylinder extends atomicGL2Object3d {
// constructor
//------------------------
// inputs:	nname: 		name of the Cylinder - string
// 			cylinder size
//			radius:			float
// 			height:			float
// 			lthis.heightBands: init
// 			this.longitudeBands: int
	constructor(nname,radius, height, heightBands,longitudeBands,uu,vv){
		super(nname);
	
		// size
        this.radius         = radius;
        this.height         = height;
        this.heightBands    = heightBands;
        this.longitudeBands = longitudeBands;
        
        // textures
        this.scaleUV        = [uu,vv];
	
		// build
		this.build();
	}

	// methods
	// --------------------------------------------------
	
	
	// setFaceColor(face, RGB)
	//---------------------------
	// inputs:  face: 	"All" (String)
	//			 RBG: 	[float, float, float]
	setFaceColor( face, RGB) {
		// debug
		//console.log("atomicGL2Cylinder("+this.name+")::setFaceColor");
		var r = RGB[0];
		var g = RGB[1];
		var b = RGB[2];
		
		// switch face
		switch(face){
			case "All":
				var nbc = this.colorsArray.length / 3;
				this.colorsArray = [];
				for (var i=0; i <nbc; i++) {
                	this.colorsArray.push(r);
                	this.colorsArray.push(g);
                	this.colorsArray.push(b);            
            	}
			break;		
		}
	}
	
	// build
	//-----------------------------------------------------
	build(){
		// vertices, normals, colors, texCoord
		for (var i=0; i <= this.heightBands; i++) {
			var y = i*this.height/this.heightBands;
	
        	for (var j = 0; j <= this.longitudeBands; j++) {
            
            	var theta = j * 2.0* Math.PI / this.longitudeBands;
            	var x = Math.cos(theta);
            	var y = i*this.height/this.heightBands;
				var z = Math.sin(theta);
            
				// normals
            	this.normalsArray.push(x);
            	this.normalsArray.push(0.0);
            	this.normalsArray.push(z);
				// position
            	this.verticesArray.push(this.radius * x);
            	this.verticesArray.push(y);
            	this.verticesArray.push(this.radius * z);
            	// color
            	this.colorsArray.push(0.8);
            	this.colorsArray.push(0.8);
            	this.colorsArray.push(0.8);
            	// uv
            	this.textureCoordsArray.push(this.scaleUV[1]*i/this.heightBands);              
            	this.textureCoordsArray.push(this.scaleUV[0]*j/this.longitudeBands);
    		}
    	}
    
    	// cylinder cap
    	// ------------
	    // bottom
   	 	// ------
   	 	// center
		// texture coord
		this.textureCoordsArray.push(0.5); this.textureCoordsArray.push(0.5);
		// color
    	this.colorsArray.push(0.8);this.colorsArray.push(0.8);this.colorsArray.push(0.8);
    	// normals
		this.normalsArray.push(0.0);this.normalsArray.push(-1.0);this.normalsArray.push(0.0);
		// position
    	this.verticesArray.push(0.0);this.verticesArray.push(0.0);this.verticesArray.push(0.0);
		var bottomcenterIndex = this.verticesArray.length/3;

    	// cap edge
    	for (var j = 0; j <= this.longitudeBands; j++) { 
            var theta = j * 2.0* Math.PI / this.longitudeBands;
            var x = Math.cos(theta);
            var y = 0.0
			var z = Math.sin(theta);
            
			// normals
            this.normalsArray.push(0.0); this.normalsArray.push(-1.0); this.normalsArray.push(0.0);
			// position
            this.verticesArray.push(this.radius * x);
            this.verticesArray.push(0.0);
            this.verticesArray.push(this.radius * z);
            // color
            this.colorsArray.push(0.8); this.colorsArray.push(0.8); this.colorsArray.push(0.8);
            // uv
            this.textureCoordsArray.push(0.5+x*.5);              
            this.textureCoordsArray.push(0.5+z*0.5);    
    	}   
    	// top cap
    	// -------
    	// center
		// texture coord
		this.textureCoordsArray.push(0.5); this.textureCoordsArray.push(0.5);
    	// normals
		this.normalsArray.push(0.0);this.normalsArray.push(1.0);this.normalsArray.push(0.0);
		// position
    	this.verticesArray.push(0.0);this.verticesArray.push(this.height);this.verticesArray.push(0.0);
    	var topcenterIndex = this.verticesArray.length/3;
    	// color
    	this.colorsArray.push(0.8);
    	this.colorsArray.push(0.8);
    	this.colorsArray.push(0.8);
    	// cap edge
    	for (var j = 0; j <= this.longitudeBands; j++) { 
            var theta = j * 2.0* Math.PI / this.longitudeBands;
            var x = Math.cos(theta);
            var y = this.height;
			var z = Math.sin(theta);
            
			// normals
            this.normalsArray.push(0.0); this.normalsArray.push(1.0); this.normalsArray.push(0.0);
			// position
            this.verticesArray.push(this.radius * x);
            this.verticesArray.push(this.height);
            this.verticesArray.push(this.radius * z);
            // color
            this.colorsArray.push(0.8); this.colorsArray.push(0.8); this.colorsArray.push(0.8);
            // uv
            this.textureCoordsArray.push(0.5+x*0.5);              
            this.textureCoordsArray.push(0.5+z*0.5);  
    	}   

		// indexes
		// --------
		// body index 
		for (var i=0; i < this.heightBands; i++) {
        	for (var j = 0; j < this.longitudeBands; j++) {
                	var t0 = i*(this.longitudeBands+1) 	+ j;
                	var t1 = i*(this.longitudeBands+1) 	+ j+1;
                	var t2 = (i+1)*(this.longitudeBands+1) + j;
                	var t3 = (i+1)*(this.longitudeBands+1) + j+1;
                	// first triangle
                	this.vertexIndices.push(t0);
                	this.vertexIndices.push(t1);
                	this.vertexIndices.push(t2);                
                
       	         	// second triangle
        	        this.vertexIndices.push(t2);
           	    	this.vertexIndices.push(t1);
            	    this.vertexIndices.push(t3);  
        	}
    	}
		// bottom cap index
		for (var j = 0; j < this.longitudeBands; j++) {
        	this.vertexIndices.push(bottomcenterIndex);
        	this.vertexIndices.push(bottomcenterIndex +j);
        	this.vertexIndices.push(bottomcenterIndex +j +1);  
    	}
		// top cap index
		for (var j = 0; j < this.longitudeBands; j++) {
        	this.vertexIndices.push(topcenterIndex);
        	this.vertexIndices.push(topcenterIndex +j);
        	this.vertexIndices.push(topcenterIndex +j +1);  
    	}	
	
		// buffer item size and num items
        this.vertexPositionBufferItemSize = 3;
        this.vertexNormalBufferItemSize   = 3;
        this.vertexTexCoordBufferItemSize = 2;
        this.vertexColorBufferItemSize    = 3;
        this.vertexIndexBufferItemSize    = 1;
	
        this.vertexPositionBufferNumItems = this.verticesArray.length / 3;
        this.vertexNormalBufferNumItems   = this.normalsArray.length / 3;
        this.vertexTexCoordBufferNumItems = this.textureCoordsArray.length/2;
        this.vertexColorBufferNumItems    = this.colorsArray.length /3;
        this.vertexIndexBufferNumItems    = this.vertexIndices.length;;
	}
}