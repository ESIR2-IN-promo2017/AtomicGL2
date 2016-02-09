// atomicGL
//----------------------------------------------------------------------------------------
// author: RC				
// contact: cozot@irisa.fr
// version: 2.1
// current version date: 2016/01/29
//----------------------------------------------------------------------------------------
// atomicGLObject3d
//----------------------------------------------------------------------------------------

class atomicGL2Object3d{
	// constructor
	//------------------------
	// inputs:	nname: 	name of the 3D Obj - string
	constructor(nname){
		// name
		this.name = nname ;
		
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

	// pushTexture
	// --------------------------
	// inputs:	 atomicTex: texture - atomicGL2Texture
	pushTexture(atomicTex){this.textures.push(atomicTex);}	
	
		
	// initGLBuffers
	//---------------------------
	// inputs:	agl: openGL context
	initGLBuffers(agl){
		// debug
		//console.log("atomicGLObject3d("+this.name+")::initGLBuffers");
		var gl = agl.gl ;
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
	
	
	// draw(aGL,aMS,idProg)
	//---------------------------
	// inputs: 	aGL: GL context 		- atomicGLContext
	// 			aMS: Matrix Stacks 	- atomicMatrixStack
	// 			idProg: Shader index - integer
	//			shaderProgramName : Shader Name - string
	draw(aGL,aMS,shaderProgramName){
		// debug
		//console.log("atomicGLObject3d("+this.name+")::draw(progId: "+idProg+")");

		// activate shader
		aGL.gl.useProgram(aGL.getShaderProgram(shaderProgramName).program);
		// setUniforms: matrices and lights
		aGL.getShaderProgram(shaderProgramName).setUniforms(aGL,aMS);
		
	// link buffer to attributes
		//positions
		if(aGL.getShaderProgram(shaderProgramName).hasVertexPositionAttribute(aGL.getShaderProgram(shaderProgramName).shaderloader.getAttributes())){
			aGL.gl.bindBuffer(aGL.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
     		aGL.gl.vertexAttribPointer(aGL.getShaderProgram(shaderProgramName).getVertexPosition(), this.vertexPositionBufferItemSize, aGL.gl.FLOAT, false, 0, 0);
		}
		//normals
        if(aGL.getShaderProgram(shaderProgramName).hasVertexNormalAttribute(aGL.getShaderProgram(shaderProgramName).shaderloader.getAttributes())){
        	aGL.gl.bindBuffer(aGL.gl.ARRAY_BUFFER, this.vertexNormalBuffer);
   		    aGL.gl.vertexAttribPointer(aGL.getShaderProgram(shaderProgramName).getVertexNormal(), this.vertexNormalBufferItemSize, aGL.gl.FLOAT, false, 0, 0);
		}
		// colors
		if(aGL.getShaderProgram(shaderProgramName).hasVertexColorAttribute(aGL.getShaderProgram(shaderProgramName).shaderloader.getAttributes())){
	       	aGL.gl.bindBuffer(aGL.gl.ARRAY_BUFFER, this.vertexColorBuffer);
	       	aGL.gl.vertexAttribPointer(aGL.getShaderProgram(shaderProgramName).getVertexColor(), this.vertexColorBufferItemSize, aGL.gl.FLOAT, false, 0, 0);
    	}

		// textures
		if(this.textures.length>0){
			// debug
			// console.log("atomicGLObject3d("+this.name+")::vertexAttribPointer: "+aGL.getShaderProgram(shaderProgramName).texCoordAttribute);
			aGL.gl.bindBuffer(aGL.gl.ARRAY_BUFFER, this.vertexTexCoordBuffer);
			aGL.gl.vertexAttribPointer(aGL.getShaderProgram(shaderProgramName).getTextureCoord(), this.vertexTexCoordBufferItemSize, aGL.gl.FLOAT, false, 0, 0);		
		}

		for (var i=0; i<this.textures.length; i++ )
		{
			// activate texture
			// debug
			// console.log("atomicGLObject3d("+this.name+")::activateTexture: "+agl.GLtexture[i]+"/"+agl.gl.TEXTURE0);
			agl.gl.activeTexture(agl.GLtexture[i]);
			// debug
			// console.log("atomicGLObject3d("+this.name+")::bindTexture: "+this.textures[i].texture);
			agl.gl.bindTexture(aGL.gl.TEXTURE_2D, this.textures[i].texture);
			// debug
			// console.log("atomicGLObject3d("+this.name+")::uniform: "+aGL.getShaderProgram(shaderProgramName).samplerUniform[i]+"->"+i);			
			agl.gl.uniform1i(aGL.getShaderProgram(shaderProgramName).samplerUniform[i], i);

		}

		// indexes
        aGL.gl.bindBuffer(aGL.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
		
		// draw Object3D
        aGL.gl.drawElements(aGL.gl.TRIANGLES, this.vertexIndexBufferNumItems, aGL.gl.UNSIGNED_SHORT, 0);
	}
}