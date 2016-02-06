"use strict;"

//----------------------------------------------------------------------------------------
// atomicGL2Sphere  extends atomicGLObject3d
//----------------------------------------------------------------------------------------

class atomicGL2Sphere extends atomicGL2Object3d{

	// constructor
	//------------------------
	// inputs
	//------------------------
	// nname: 		name of the Sphere - string
	// sphere size
	// rthis.radius:			float
	// lthis.latitudeBands: init
	// lthis.longitudeBands: int
	constructor(nname,rradius, llatitudeBands,llongitudeBands,uu,vv){
		super();
		
		// size
		this.radius	= rradius ;
		this.latitudeBands 	= llatitudeBands ;
		this.longitudeBands	= llongitudeBands ;	

		// textures
		this.scaleUV = [uu,vv] ;

	    // build the vertices
	    this.build();
	}
	
	// methods
	// --------------------------------------------------

	// setFaceColor(face, RGB)
	//---------------------------
	// inputs
	//---------------------------
	// face: 	"All" (String)
	// RBG: 	[float, float, float]
	//---------------------------
	setFaceColor( face, RGB) {
		// debug
		//console.log("atomicGLSphere("+this.name+")::setFaceColor");
		var r = RGB[0];
		var g = RGB[1];
		var b = RGB[2];
		
		// switch face
		switch(face){
			case "All":
				this.colorsArray = [] ;
				for (var latNumber=0; latNumber <= this.latitudeBands; latNumber++) {
            		for (var longNumber = 0; longNumber <= this.longitudeBands; longNumber++) {
                		// color
                		this.colorsArray.push(r);
                		this.colorsArray.push(g);
                		this.colorsArray.push(b);            
            		}
        		}
			break;		
		}
	}
	//-----------------------------------------------------
	
	build(){
		// build
		//-----------------------------
		// vertices, normals, colors, texCoord
		for (var latNumber=0; latNumber <= this.latitudeBands; latNumber++) {
				var theta = latNumber * Math.PI / this.latitudeBands;
				var sinTheta = Math.sin(theta);
				var cosTheta = Math.cos(theta);

				for (var longNumber = 0; longNumber <= this.longitudeBands; longNumber++) {
					var phi = longNumber * 2 * Math.PI / this.longitudeBands;
					var sinPhi = Math.sin(phi);
					var cosPhi = Math.cos(phi);

					var x = cosPhi * sinTheta;
					var y = cosTheta;
					var z = sinPhi * sinTheta;
					// normals
					this.normalsArray.push(x);
					this.normalsArray.push(y);
					this.normalsArray.push(z);
					// position
					this.verticesArray.push(this.radius * x);
					this.verticesArray.push(this.radius * y);
					this.verticesArray.push(this.radius * z);
					// color
					this.colorsArray.push(0.8);
					this.colorsArray.push(0.8);
					this.colorsArray.push(0.8);
					// uv
					this.textureCoordsArray.push(this.scaleUV[0]*longNumber/this.longitudeBands);
					this.textureCoordsArray.push(this.scaleUV[1]*latNumber/this.latitudeBands);              
				}
			}

		// index 
		for (var latNumber = 0; latNumber < this.latitudeBands; latNumber++) {
				for (var longNumber = 0; longNumber < this.longitudeBands; longNumber++) {
					var first = (latNumber * (this.longitudeBands + 1)) + longNumber;
					var second = first + this.longitudeBands + 1;
					this.vertexIndices.push(first);
					this.vertexIndices.push(second);
					this.vertexIndices.push(first + 1);

					this.vertexIndices.push(second);
					this.vertexIndices.push(second + 1);
					this.vertexIndices.push(first + 1);
				}
			}
	
		this.vertexPositionBufferItemSize 	= 3	;
		this.vertexNormalBufferItemSize		= 3	;
		this.vertexTexCoordBufferItemSize	= 2 ;
		this.vertexColorBufferItemSize		= 3 ;
		this.vertexIndexBufferItemSize 		= 1 ;
	
		this.vertexPositionBufferNumItems	= this.verticesArray.length / 3 ;
	   	this.vertexNormalBufferNumItems		= this.normalsArray.length / 3 ;
		this.vertexTexCoordBufferNumItems 	= this.textureCoordsArray.length/2 ;
		this.vertexColorBufferNumItems 		= this.colorsArray.length /3 ;
	    this.vertexIndexBufferNumItems 		= this.SphereVertexIndices.length; ;
	}
}