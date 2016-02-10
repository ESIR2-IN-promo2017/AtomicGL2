"use strict";

//----------------------------------------------------------------------------------------
// atomicGL2Cube  extends atomicGLObject3d
//----------------------------------------------------------------------------------------

class atomicGL2Cube extends atomicGL2Object3d {
	// constructor
	//------------------------
	// inputs:	gl: 	openGL context
	// 			nname: 	name of the cube - string
	// 			hheight:float
	// 			wwidth:	float
	// 			ddepth:	float
	//			uu: textures coordinate scale
	//			vv: textures coordinate scale
	constructor(name,height, width,depth,uu,vv){
		super();

		// attributes
		// -------------------------------------------------
		// size
		this.height	= height ;
		this.width 	= width ;
		this.depth 	= depth ;
	

	
		// vertices array
		this.verticesArray 	= [
        	// Front face
        	-this.width/2.0, 	0.0,  			+this.depth/2.0,		// 0
			+this.width/2.0,	0.0,  			+this.depth/2.0,		// 1
			+this.width/2.0,	this.height, 	+this.depth/2.0,		// 2
			-this.width/2.0, 	this.height,  	+this.depth/2.0,		// 3
			// Back face
			-this.width/2.0, 	0.0,  			-this.depth/2.0,		// 4
			+this.width/2.0,	0.0,  			-this.depth/2.0,		// 5
			+this.width/2.0,	this.height, 	-this.depth/2.0,		// 6
			-this.width/2.0, 	this.height,  	-this.depth/2.0,		// 7
			// Top face
			-this.width/2.0,  	this.height, 	+this.depth/2.0,		// 8
			+this.width/2.0,  	this.height,  	+this.depth/2.0,		// 9
			+this.width/2.0,  	this.height,  	-this.depth/2.0,		// 10
			-this.width/2.0,  	this.height, 	-this.depth/2.0,		// 11
			// Bottom face
			-this.width/2.0,  	0.0, 			+this.depth/2.0,		// 12
			+this.width/2.0,  	0.0,  			+this.depth/2.0,		// 13
			+this.width/2.0,  	0.0,  			-this.depth/2.0,		// 14
			-this.width/2.0,  	0.0, 			-this.depth/2.0,		// 15
			// Left face
			+this.width/2.0, 	0.0, 			+this.depth/2.0,		// 16
			+this.width/2.0,  	0.0, 			-this.depth/2.0,		// 17
			+this.width/2.0,  	this.height,  	-this.depth/2.0,		// 18
			+this.width/2.0, 	this.height,  	+this.depth/2.0,		// 19
			// Right face
			-this.width/2.0, 	0.0, 			-this.depth/2.0,		// 20
			-this.width/2.0, 	0.0,  			+this.depth/2.0,		// 21
			-this.width/2.0,  	this.height,  	+this.depth/2.0,		// 22
			-this.width/2.0,  	this.height, 	-this.depth/2.0			// 23
    	];
		// normals array
		this.normalsArray  = [
			// Front face
		 	0.0,  0.0,  1.0, 0.0,  0.0,  1.0, 0.0,  0.0,  1.0, 0.0,  0.0,  1.0,
			// Back face
		 	0.0,  0.0, -1.0, 0.0,  0.0, -1.0, 0.0,  0.0, -1.0, 0.0,  0.0, -1.0,
			// Top face
		 	0.0,  1.0,  0.0, 0.0,  1.0,  0.0, 0.0,  1.0,  0.0, 0.0,  1.0,  0.0,
			// Bottom face
		 	0.0, -1.0,  0.0, 0.0, -1.0,  0.0, 0.0, -1.0,  0.0, 0.0, -1.0,  0.0,
			// Left face
		 	1.0,  0.0,  0.0, 1.0,  0.0,  0.0, 1.0,  0.0,  0.0, 1.0,  0.0,  0.0,
			// Right face
			-1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0
    	];
		// texture coordinates array
    	this.textureCoordsArray = [
			// Front face
		 	uu*0.0, vv*0.0,		uu*1.0, vv*0.0,		uu*1.0, vv*1.0,		uu*0.0, vv*1.0,
			// Back face
		 	uu*0.0, vv*0.0,		uu*1.0, vv*0.0,		uu*1.0, vv*1.0,		uu*0.0, vv*1.0,
			// Top face 
		 	uu*0.0, vv*0.0,		uu*1.0, vv*0.0,		uu*1.0, vv*1.0,		uu*0.0, vv*1.0,
			// Bottom face : floor
		 	uu*0.0, vv*0.0,		uu*1.0, vv*0.0,		uu*1.0, vv*1.0,		uu*0.0, vv*1.0,
			// Left face
		 	uu*0.0, vv*0.0,		uu*1.0, vv*0.0,		uu*1.0, vv*1.0,		uu*0.0, vv*1.0,		
			// Right face
		 	uu*0.0, vv*0.0,		uu*1.0, vv*0.0,		uu*1.0, vv*1.0,		uu*0.0, vv*1.0
		];
		// color array
    	this.colorsArray = [
			// Front face
		 	0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8,
			// Back face
		 	0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8,
			// Top face 
		  	0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8,
			// Bottom face : floor
		  	0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8,
	   		// Left face
		 	0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8,
			// Right face
		  	0.8,0.8, 0.8,		0.8,0.8, 0.8,		0.8,0.8,0.8,		0.8,0.8, 0.8
		];
		// indexes
    	this.cubeVertexIndices = [
			0, 1, 2,      0, 2, 3,    // Front face
			4, 5, 6,      4, 6, 7,    // Back face
			8, 9, 10,     8, 10, 11,  // Top face
			12, 13, 14,   12, 14, 15, // Bottom face
			16, 17, 18,   16, 18, 19, // Right face
			20, 21, 22,   20, 22, 23  // Left face
		];		

	}	
	// methods
	// --------------------------------------------------

	
	// setFaceColor(face, RGB)
	//---------------------------
	// inputs:	face: 	"Front" | "Back" | "Top" | "Bottom" |"Left"| "Right"| "All" (String)
	// 			RBG: 	[float, float, float]
	setFaceColor( face, RGB) {
		// debug
		//console.log("atomicGLCube("+this.name+")::setFaceColor");
		var r = RGB[0];
		var g = RGB[1];
		var b = RGB[2];
		
		// switch face
		switch(face){
			case "Front":
				this.colorsArray[0]  =r;
				this.colorsArray[1]  =g;
				this.colorsArray[2]  =b;
				
				this.colorsArray[3]  =r;
				this.colorsArray[4]  =g;
				this.colorsArray[5]  =b;
				
				this.colorsArray[6]  =r;
				this.colorsArray[7]  =g;
				this.colorsArray[8]  =b;
				
				this.colorsArray[9]  =r;
				this.colorsArray[10] =g;
				this.colorsArray[11] =b;			
			break;

			case "Back":
				this.colorsArray[12+0]  =r;
				this.colorsArray[12+1]  =g;
				this.colorsArray[12+2]  =b;
				
				this.colorsArray[12+3]  =r;
				this.colorsArray[12+4]  =g;
				this.colorsArray[12+5]  =b;
				
				this.colorsArray[12+6]  =r;
				this.colorsArray[12+7]  =g;
				this.colorsArray[12+8]  =b;
				
				this.colorsArray[12+9]  =r;
				this.colorsArray[12+10] =g;
				this.colorsArray[12+11] =b;
			break;			
			case "Top":
				this.colorsArray[24+0]  =r;
				this.colorsArray[24+1]  =g;
				this.colorsArray[24+2]  =b;
				
				this.colorsArray[24+3]  =r;
				this.colorsArray[24+4]  =g;
				this.colorsArray[24+5]  =b;
				
				this.colorsArray[24+6]  =r;
				this.colorsArray[24+7]  =g;
				this.colorsArray[24+8]  =b;
				
				this.colorsArray[24+9]  =r;
				this.colorsArray[24+10] =g;
				this.colorsArray[24+11] =b;
			break;			
			case "Bottom":
				this.colorsArray[36+0]  =r;
				this.colorsArray[36+1]  =g;
				this.colorsArray[36+2]  =b;
				
				this.colorsArray[36+3]  =r;
				this.colorsArray[36+4]  =g;
				this.colorsArray[36+5]  =b;
				
				this.colorsArray[36+6]  =r;
				this.colorsArray[36+7]  =g;
				this.colorsArray[36+8]  =b;
				
				this.colorsArray[36+9]  =r;
				this.colorsArray[36+10] =g;
				this.colorsArray[36+11] =b;
			break;			
			case "Left":
				this.colorsArray[48+0]  =r;
				this.colorsArray[48+1]  =g;
				this.colorsArray[48+2]  =b;
				
				this.colorsArray[48+3]  =r;
				this.colorsArray[48+4]  =g;
				this.colorsArray[48+5]  =b;
				
				this.colorsArray[48+6]  =r;
				this.colorsArray[48+7]  =g;
				this.colorsArray[48+8]  =b;
				
				this.colorsArray[48+9]  =r;
				this.colorsArray[48+10] =g;
				this.colorsArray[48+11] =b;
			break;				
			case "Right":
				this.colorsArray[60+0]  =r;
				this.colorsArray[60+1]  =g;
				this.colorsArray[60+2]  =b;
				
				this.colorsArray[60+3]  =r;
				this.colorsArray[60+4]  =g;
				this.colorsArray[60+5]  =b;
				
				this.colorsArray[60+6]  =r;
				this.colorsArray[60+7]  =g;
				this.colorsArray[60+8]  =b;
				
				this.colorsArray[60+9]  =r;
				this.colorsArray[60+10] =g;
				this.colorsArray[60+11] =b;
			break;	
			case "All":
				this.colorsArray = [
					// Front face
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
					// Back face
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
					// Top face 
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
					// Bottom face : floor
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
					// Left face
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
					// Right face
					r, g, b,		r, g, b,		r, g, b,		r, g, b,
				];	
			break;		
		}
	}		
}