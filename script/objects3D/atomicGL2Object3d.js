// atomicGL
//----------------------------------------------------------------------------------------
// author: RC				
// contact: cozot@irisa.fr
// version: 2.1
// current version date: 2016/01/29
//----------------------------------------------------------------------------------------
// atomicGLObject3d
//----------------------------------------------------------------------------------------
"use strict";

class atomicGL2Object3d{
	// constructor
	//------------------------
	// inputs:	nname: 	name of the 3D Obj - string
	constructor(name){
		// name
		this.name = name ;
		
		// textures
		this.scaleUV            = [];
		this.textures           = [];
		
		// vertices array
		this.verticesArray      = [];
		
		// normals array
		this.normalsArray       = [];
		
		// color array
		this.colorsArray        = [];
		
		// texture coordinates array
		this.textureCoordsArray = [];
		
		// indexes
		this.vertexIndices      = [];	
    
    	// transparency
    	this.transparency;

    	// OGL buffers
 		// buffers
		this.vertexPositionBuffer	;
    	this.vertexNormalBuffer		;
    	this.vertexColorBuffer		;
    	this.vertexTexCoordBuffer 	;
    	this.vertexIndexBuffer 		;
	
		this.vertexPositionBufferItemSize	;
    	this.vertexNormalBufferItemSize		;
    	this.vertexColorBufferItemSize		;
    	this.vertexTexCoordBufferItemSize 	;
    	this.vertexIndexBufferItemSize 		;
	
		this.vertexPositionBufferNumItems	;
    	this.vertexNormalBufferNumItems		;
    	this.vertexColorBufferNumItems		;
    	this.vertexTexCoordBufferNumItems 	;
    	this.vertexIndexBufferNumItems 		;
       		
	}

	// methods
	// --------------------------------------------------

	setTransparency(transparency){
		this.transparency = transparency;
	}


	// pushTexture
	// --------------------------
	// inputs:	 atomicTex: texture - atomicGL2Texture
	pushTexture(atomicTex){this.textures.push(atomicTex);}	
	
		
	// initGLBuffers
	//---------------------------
	// inputs:	AGL: openGL context
	initGLBuffers(AGL){
		// debug
		//console.log("atomicGLObject3d("+this.name+")::initGLBuffers");
		var gl = AGL.gl ;
		// vertexPositionBuffer
		this.vertexPositionBuffer	= gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verticesArray), gl.STATIC_DRAW);
        this.vertexPositionBufferItemSize = 3;
        this.vertexPositionBufferNumItems = this.verticesArray.length/3;

		// vertexNormalBuffer		
		this.vertexNormalBuffer		= gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalsArray), gl.STATIC_DRAW);
        this.vertexNormalBufferItemSize = 3;
        this.vertexNormalBufferNumItems = this.normalsArray.length/3;

		// vertexColorBuffer		
		this.vertexColorBuffer		= gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colorsArray), gl.STATIC_DRAW);
        this.vertexColorBufferItemSize = 3;
        this.vertexColorBufferNumItems = this.normalsArray.length/3;

		
		// vertexTexCoordBuffer		
		this.vertexTexCoordBuffer 	= gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordsArray), gl.STATIC_DRAW);
        this.vertexTexCoordBufferItemSize = 2;
        this.vertexTexCoordBufferNumItems = this.textureCoordsArray.length/2;
		
		// vertexIndexBuffer	
		this.vertexIndexBuffer 		= gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertexIndices), gl.STATIC_DRAW);
        this.vertexIndexBufferItemSize = 1;
        this.vertexIndexBufferNumItems = this.vertexIndices.length ;
	}
	
	
	// draw(AGL,AMS,idProg)
	//---------------------------
	// inputs: 	AGL: GL context 		- atomicGLContext
	// 			AMS: Matrix Stacks 	- atomicMatrixStack
	// 			idProg: Shader index - integer
	//			shaderProgramName : Shader Name - string
	draw(AGL,AMS,shaderProgramName){
		// debug
		//console.log("atomicGLObject3d("+this.name+")::draw(progId: "+idProg+")");
		AGL.gl.useProgram(AGL.getShaderProgram(shaderProgramName).program);
		
		// setUniforms: matrices and lights
		AGL.getShaderProgram(shaderProgramName).setUniforms(AGL,AMS);
		
		// link buffer to attributes
		//positions
		if(AGL.getShaderProgram(shaderProgramName).hasVertexPositionAttribute(AGL.getShaderProgram(shaderProgramName).shaderloader.getAttributes())){
			AGL.gl.bindBuffer(AGL.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
     		AGL.gl.vertexAttribPointer(AGL.getShaderProgram(shaderProgramName).getVertexPosition(), this.vertexPositionBufferItemSize, AGL.gl.FLOAT, false, 0, 0);
		}
		//normals
        if(AGL.getShaderProgram(shaderProgramName).hasVertexNormalAttribute(AGL.getShaderProgram(shaderProgramName).shaderloader.getAttributes())){
        	AGL.gl.bindBuffer(AGL.gl.ARRAY_BUFFER, this.vertexNormalBuffer);
   		    AGL.gl.vertexAttribPointer(AGL.getShaderProgram(shaderProgramName).getVertexNormal(), this.vertexNormalBufferItemSize, AGL.gl.FLOAT, false, 0, 0);
		}
		// colors
		if(AGL.getShaderProgram(shaderProgramName).hasVertexColorAttribute(AGL.getShaderProgram(shaderProgramName).shaderloader.getAttributes())){
	       	AGL.gl.bindBuffer(AGL.gl.ARRAY_BUFFER, this.vertexColorBuffer);
	       	AGL.gl.vertexAttribPointer(AGL.getShaderProgram(shaderProgramName).getVertexColor(), this.vertexColorBufferItemSize, AGL.gl.FLOAT, false, 0, 0);
    	}

		// textures
		if(this.textures.length>0){
			// debug
			// console.log("atomicGLObject3d("+this.name+")::vertexAttribPointer: "+AGL.getShaderProgram(shaderProgramName).texCoordAttribute);
			AGL.gl.bindBuffer(AGL.gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
			AGL.gl.vertexAttribPointer(AGL.getShaderProgram(shaderProgramName).getTextureCoord(), this.vertexTexCoordBufferItemSize, AGL.gl.FLOAT, false, 0, 0);		

			for (var i=0; i<this.textures.length; i++ )
			{
				// activate texture
				// debug
				// console.log("atomicGLObject3d("+this.name+")::activateTexture: "+AGL.GLtexture[i]+"/"+AGL.gl.TEXTURE0);
				AGL.gl.activeTexture(AGL.GLtexture[i]);
				// debug
				// console.log("atomicGLObject3d("+this.name+")::bindTexture: "+this.textures[i].texture);
				AGL.gl.bindTexture(AGL.gl.TEXTURE_2D, this.textures[i].texture);
				// debug
				// console.log("atomicGLObject3d("+this.name+")::uniform: "+AGL.getShaderProgram(shaderProgramName).samplerUniform[i]+"->"+i);			
				AGL.gl.uniform1i(AGL.getShaderProgram(shaderProgramName).samplerUniform[i], i);
			}
		}

		if (this.transparency) {
            AGL.gl.blendFunc(AGL.gl.SRC_ALPHA, AGL.gl.ONE);
            AGL.gl.enable(AGL.gl.BLEND);
            AGL.gl.disable(AGL.gl.DEPTH_TEST);
        } 

        else {
            AGL.gl.disable(AGL.gl.BLEND);
            AGL.gl.enable(AGL.gl.DEPTH_TEST);
        }

		// indexes
        AGL.gl.bindBuffer(AGL.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
		
		// draw Object3D
        AGL.gl.drawElements(AGL.gl.TRIANGLES, this.vertexIndexBufferNumItems, AGL.gl.UNSIGNED_SHORT, 0);
	}
}