"use strict";

// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 0.1
// current version date: 2015/09/05
//----------------------------------------------------------------------------------------
// atomicGL
//----------------------------------------------------------------------------------------
// TODO list
//----------------------------------------------------------------------------------------


// constructor
//------------------------
// inputs
//------------------------
// nname: 		name of the  - string
// plane size
// hheight:		float
// wwidth:		float
// xxrow:		int - number of rowdivision
// yyrow:		int - number of rowdivision


class atomicGL2xyPlane extends atomicGL2Object3d {
constructor(nname,hheight,wwidth,xxrow,yyrow,uu,vv){
	// attributes
	// -------------------------------------------------
	// name
	super(nname);

	// size
	this.height	= hheight;
	this.width 	= wwidth;
	this.xrow 	= xxrow;
	this.yrow	= yyrow;

	// textures
	this.scaleUV = [uu,vv];


	// init
	// build
	this.build();
	}


//-----------------------------------------------------

	build(){
		//-----------------------------
		// vertices, normals, colors

		for(var j=0; j<= this.yrow;j++){
			for(var i=0;i<=this.xrow;i++){
				// vertices
				var x = - 0.5*this.width + i*this.width/this.xrow;
				var y = j*this.height/this.yrow
				var z = 0.0;
				// normals
				var nx = 0.0;
				var ny = 0.0;
				var nz = 1.0;
				// color
				var r = 0.8;
				var g = 0.8;
				var b = 0.8;
				// texture coordinates
				var tu = this.scaleUV[0]*i/this.xrow;
				var tv = this.scaleUV[1]*j/this.yrow;
				// push vertices, normals, colors and textures coordinates
				this.verticesArray.push(x);
				this.verticesArray.push(y);
				this.verticesArray.push(z);
				this.normalsArray.push(nx);
				this.normalsArray.push(ny);
				this.normalsArray.push(nz);
		    	this.textureCoordsArray.push(tu);
		    	this.textureCoordsArray.push(tv);
				this.colorsArray.push(r);
				this.colorsArray.push(g);
				this.colorsArray.push(b);
			}
		}

		for(var jj=0;jj<this.yrow;jj++){
			for(var ii=0;ii<this.xrow;ii++){
				// triangles indexes
				// first
				this.vertexIndices.push(jj*(this.xrow+1)+ii);
				this.vertexIndices.push(jj*(this.xrow+1)+ii+1);
				this.vertexIndices.push((jj+1)*(this.xrow+1)+ii);
				// se
				this.vertexIndices.push((jj+1)*(this.xrow+1)+ii);
				this.vertexIndices.push(jj*(this.xrow+1)+ii+1);
				this.vertexIndices.push((jj+1)*(this.xrow+1)+ii+1);
				// debug
			}
		}


		this.vertexPositionBufferItemSize 	= 3	;
	    this.vertexNormalBufferItemSize		= 3	;
	    this.vertexTexCoordBufferItemSize	= 2;
	    this.vertexColorBufferItemSize		= 3;
	    this.vertexIndexBufferItemSize 		= 1;

		this.vertexPositionBufferNumItems	= (this.xrow+1)*(this.yrow+1);
	    this.vertexNormalBufferNumItems		= (this.xrow+1)*(this.yrow+1);
	    this.vertexTexCoordBufferNumItems 	= (this.xrow+1)*(this.yrow+1);
	    this.vertexColorBufferNumItems 		= (this.xrow+1)*(this.yrow+1);
	    this.vertexIndexBufferNumItems 		= (this.xrow)*(this.yrow)*2*3;
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
	setFaceColor ( face, RGB) {
		// debug
		//console.log("atomicGL("+this.name+")::setFaceColor");
		var r = RGB[0];
		var g = RGB[1];
		var b = RGB[2];

		// switch face
		switch(face)
		{
			case "All":
				this.colorsArray = [];
				for(var i=0;i<=this.yrow;i++)
				{
					for(var j=0;j<= this.xrow;j++)
					{
						this.colorsArray.push(r);
						this.colorsArray.push(g);
						this.colorsArray.push(b);
					}
				}

			break;
		}
	};
}
