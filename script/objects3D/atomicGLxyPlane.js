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


class atomicGLxyPlane extends atomicGL2Object3d {
constructor(nname,hheight, wwidth,xxrow,yyrow,uu,vv){
	// attributes
	// -------------------------------------------------
	// name
	super(nname);

	// size
	this.height	= hheight ;
	this.width 	= wwidth ;
	this.xrow 	= xxrow ;
	this.yrow	= yyrow ;

	// textures
	this.scaleUV = [uu,vv] ;


	// init
	// build
		this.build();
	}


//-----------------------------------------------------
	
	build(){
		

	//-----------------------------
	// vertices, normals, colors
	
	for(var j=0 ; j<= this.yrow ;j++){
	
		for(var i=0;i<=this.xrow;i++){
			// vertices
			var x = - 0.5*this.width + i*this.width/this.xrow;
			var y = j*this.height/this.yrow
			var z = 0.0;
			// normals
			var nx = 0.0 ;
			var ny = 0.0 ;
			var nz = 1.0 ;
			// color
			var r = 0.8 ;
			var g = 0.8 ;
			var b = 0.8 ;
			// texture coordinates
			var tu = this.scaleUV[0]*i/this.xrow ; 
			var tv = this.scaleUV[1]*j/this.yrow ;
			// push vertices, normals, colors and textures coordinates
			this.verticesArray.push(x) ;
			this.verticesArray.push(y) ;
			this.verticesArray.push(z) ;
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
			this.VertexIndices.push(jj*(this.xrow+1)+ii);
			this.VertexIndices.push(jj*(this.xrow+1)+ii+1);
			this.VertexIndices.push((jj+1)*(this.xrow+1)+ii);
			// se
			this.VertexIndices.push((jj+1)*(this.xrow+1)+ii);
			this.VertexIndices.push(jj*(this.xrow+1)+ii+1);
			this.VertexIndices.push((jj+1)*(this.xrow+1)+ii+1);	
			// debug 	
		}
	}

	
	this.VertexPositionBufferItemSize 	= 3	;
    this.VertexNormalBufferItemSize		= 3	;
    this.VertexTexCoordBufferItemSize	= 2 ;
    this.VertexColorBufferItemSize		= 3 ;
    this.VertexIndexBufferItemSize 		= 1 ;
	
	this.VertexPositionBufferNumItems	= (this.xrow+1)*(this.yrow+1) ;
    this.VertexNormalBufferNumItems		= (this.xrow+1)*(this.yrow+1) ;
    this.VertexTexCoordBufferNumItems 	= (this.xrow+1)*(this.yrow+1) ;
    this.VertexColorBufferNumItems 		= (this.xrow+1)*(this.yrow+1) ;
    this.VertexIndexBufferNumItems 		= (this.xrow)*(this.yrow)*2*3 ;


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
		switch(face){
			case "All":
				this.colorsArray = [] ;
				for(var j=0;j<= this.yrow;j++){
					for(var i=0;i<=this.xrow;i++){
						this.colorsArray.push(r);
						this.colorsArray.push(g);
						this.colorsArray.push(b);
					}
				}
			break;		
		}
	};	
}