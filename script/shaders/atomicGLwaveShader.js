// atomicwaveShader
//----------------------------------------------------------------------------------------
// author: RC				
// contact: cozot@irisa.fr
// version: 0.1
// current version date: 2015/09/14
//----------------------------------------------------------------------------------------
// atomicGLwaveShader
//----------------------------------------------------------------------------------------
// TODO list
//----------------------------------------------------------------------------------------

// constructor
//------------------------
// inputs
//------------------------
// nname: 		shader name - string
// AGL:			atomicGL context
// id_vs: 		vertex shader id - string
// id_fs: 		fragment shader id - string
// uuseTex: 		boolean
//				true: use texture aVertexTexCoord required in the shader
// nnbLight:	int - number of Lights in the shader
//					uPointLightPosition0|1|2 required per light in the shader
//					uPointLightColor0|1|2 required per light in the shader

"use strict";

class atomicGLwaveShader {
	constructor(nname, AGL,fragmentShaderID, vertexShaderID,nnbTex,nnbLights){
	// attributes
	// -------------------------------------------------
	// name
	this.name = nname ;
	// useTex
	this.nbTex = nnbTex ;
	// nbLights
	this.nbLight = nnbLights ;
}
	// program shader
	this.program ;
	// attributes
    this.vertexPositionAttribute ;
	this.vertexNormalAttribute ;
	this.vertexColorAttribute ;
	this.texCoordAttribute ;
	// uniform Matrices
	this.pMatrixUniform ;
	this.mvMatrixUniform ;
	this.nMatrixUniform ;
	// light
	this.ambientColorUniform ;
	this.pointLightLocationUniform = [] ;
	this.pointLightColorUniform = [] ;
	
	// texture -sampler
	this.samplerUniform = [] ;
		
	// uniform defining the waves (see shader code for details)
 	this.A0Uniform ;
	this.A1Uniform ;
	this.A2Uniform ;
	this.A3Uniform ;
	this.xRangeUniform ;
	// wave animation 
	this.timeUniform ;
	 
	// values of  above uniforms
	// A cos(omega u + phi t) A0[0] = A - A0[1] = omega - A0[2] = phi
 	this.A0 = []; // vec3
	this.A1 = []; // vec3
	this.A2 = []; // vec3
	this.A3 = []; // vec3
	this.xRange = []; // xmin,xmax - vec2
	// wave animation 
	this.wTime = 0.0 ;	
	
	
	// methods
	// --------------------------------------------------
	// getShader(gl, id)
	//---------------------------
	// inputs
	//------------------------
	// gl: GL context
	// id: shader id - string
	//---------------------------	
	this.getShader = function getShader(AGL, id) {
		// debug
		//console.log("atomicGLShader::getShader("+id+")");
		// shader
		var shader;
        // shader source
		var shaderScript = document.getElementById(id);
        if (!shaderScript) {
			alert("Could not find shader source:"+id);
			return null;
		}
		else {
			var str = "";
			var k = shaderScript.firstChild;
			while (k) {
				if (k.nodeType == 3) {str += k.textContent;}
				k = k.nextSibling;
			}
		
			// creation shader
			if (shaderScript.type == "x-shader/x-fragment") {
				shader = AGL.gl.createShader(AGL.gl.FRAGMENT_SHADER);
			} else if (shaderScript.type == "x-shader/x-vertex") {
				shader = AGL.gl.createShader(AGL.gl.VERTEX_SHADER);
			} else {
            return null;
        }

		// set source
        AGL.gl.shaderSource(shader, str);
		// shader compilation
        AGL.gl.compileShader(shader);
		// debug
		//console.log("atomicGLShader::getShader -> compile result: "+AGL.gl.getShaderParameter(shader, AGL.gl.COMPILE_STATUS));

		// check erreur de compilation
        if (!AGL.gl.getShaderParameter(shader, AGL.gl.COMPILE_STATUS)) {
            alert(AGL.gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
		}
	}
	
	// createProgram
	//---------------------------
	// inputs
	//------------------------
	// gl: GL context
	// fragmentShaderID: fragment shader id - string
	// vertexShaderID: fragment shader id - string
	//---------------------------	
    this.createProgram =  function (AGL,fragmentShaderID, vertexShaderID) {
		// debug
		//console.log("atomicGLwaveShader::createProgram ("+fragmentShaderID+","+vertexShaderID+")");
		// creation des shaders
        var fragmentShader = 	this.getShader(AGL, fragmentShaderID);
        var vertexShader = 		this.getShader(AGL, vertexShaderID);
		
		// creation program et link
        var program = AGL.gl.createProgram();
        AGL.gl.attachShader(program, vertexShader);
        AGL.gl.attachShader(program, fragmentShader);
        AGL.gl.linkProgram(program);

		// debug
		//console.log("atomicGLwaveShader::createProgram-> link result: "+AGL.gl.getProgramParameter(program, AGL.gl.LINK_STATUS));
        if (!AGL.gl.getProgramParameter(program, AGL.gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

		// attributes
		//------------------------
		// aVertexPosition
		// aVertexNormal
		// aVertexColor
		// aVertexTexCoord
		
        this.vertexPositionAttribute = AGL.gl.getAttribLocation(program, "aVertexPosition");
        AGL.gl.enableVertexAttribArray(this.vertexPositionAttribute);

        this.vertexNormalAttribute = AGL.gl.getAttribLocation(program, "aVertexNormal");
        AGL.gl.enableVertexAttribArray(this.vertexNormalAttribute);

        this.vertexColorAttribute = AGL.gl.getAttribLocation(program, "aVertexColor");
        AGL.gl.enableVertexAttribArray(this.vertexColorAttribute);
		
		if(this.nbTex>0){
			this.texCoordAttribute = AGL.gl.getAttribLocation(program, "aVertexTexCoord");
			AGL.gl.enableVertexAttribArray(this.texCoordAttribute);
		}
		
		// uniforms
		//------------------------
		// uPMatrix: 	Projection matrix
		// uMVMatrix: 	ModelView matrix
		// uNMatrix:	Normal matrix
		//------------------------
		// debug
		//console.log("atomicGLwaveShader::createProgram - uniforms ");
		// matrix
        this.pMatrixUniform = AGL.gl.getUniformLocation(program, "uPMatrix");
        this.mvMatrixUniform = AGL.gl.getUniformLocation(program, "uMVMatrix");
        this.nMatrixUniform = AGL.gl.getUniformLocation(program, "uNMatrix");
		
		// lights
		// uAmbientColor
		// uPointLightingPosition0|1|2 required per light in the shader
		// uPointLightingColor0|1|2 required per light in the shader        
		
		this.ambientColorUniform = AGL.gl.getUniformLocation(program, "uAmbientColor");
		
        for (i = 0; i < this.nbLight; i++) { 
			// lights  	position 
			//			color
			//console.log("atomicGLwaveShader::createProgram - getUniformLocation ->"+"uPointLightPosition"+i);
			//console.log("atomicGLwaveShader::createProgram - getUniformLocation ->"+"uPointLightColor"+i);
			this.pointLightLocationUniform[i] = AGL.gl.getUniformLocation(program, "uPointLightPosition"+i);
			this.pointLightColorUniform[i] = AGL.gl.getUniformLocation(program, "uPointLightColor"+i);
		}
		
		// textures
		for (i = 0; i < this.nbTex; i++) { 
			// console.log("atomicGLShader::createProgram - getUniformLocation ->"+"uSampler"+i);
			this.samplerUniform[i] = AGL.gl.getUniformLocation(program, "uSampler"+i);
		}
		
		// uniform defining the waves (see shader code for details)
		this.A0Uniform = AGL.gl.getUniformLocation(program, "uA0");
		this.A1Uniform = AGL.gl.getUniformLocation(program, "uA1");
		this.A2Uniform = AGL.gl.getUniformLocation(program, "uA2");
		this.A3Uniform = AGL.gl.getUniformLocation(program, "uA3");
		
		this.xRangeUniform = AGL.gl.getUniformLocation(program, "uXrange");
		this.timeUniform = AGL.gl.getUniformLocation(program, "utime");

        return program;
    }	
    
    // setUniforms
    //----------------------------------------
    // inputs
    //--------------
    // AGL: atomicGLContext
	// AMS: atomicGLMatrixStack
    //----------------------------------------
    this.setUniforms = function(AGL,AMS){
		// debug
		//console.log("atomicGLwaveShader::setUniforms ");
    	// set this shader as active shader
    	AGL.gl.useProgram(this.program);
    	// matrix
    	//		Projection
    	// 		Model->view
    	//		Normal built from Model->view
    	AGL.gl.uniformMatrix4fv(this.pMatrixUniform, false, AMS.pMatrix);
        AGL.gl.uniformMatrix4fv(this.mvMatrixUniform, false, AMS.mvMatrix);

        var normalMatrix = mat3.create();
        mat4.toInverseMat3(AMS.mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        AGL.gl.uniformMatrix3fv(this.nMatrixUniform, false, normalMatrix);
        
        // Lights
        //		ambient
        AGL.gl.uniform3f(this.ambientColorUniform,AGL.ambientLightColor[0],AGL.ambientLightColor[1],AGL.ambientLightColor[2]);
		//		Omni
		for (var i=0; i < this.nbLight ; i++){
			// debug
			//console.log("-- atomicGLwaveShader::setUniforms - Light number ("+i+")");
			//console.log("-- LightLocation @"+this.pointLightLocationUniform[i]+"::" +AGL.omniLightLocation[i*3+0] +","+ AGL.omniLightLocation[i*3+1]+","+ AGL.omniLightLocation[i*3+2] );
			//console.log("-- LightColor @"+this.pointLightColorUniform[i]+"::" +AGL.omniLightColor[i*3+0] +","+ AGL.omniLightColor[i*3+1]+","+ AGL.omniLightColor[i*3+2] );
			
			AGL.gl.uniform3f(this.pointLightLocationUniform[i], AGL.omniLightLocation[i*3+0], AGL.omniLightLocation[i*3+1], AGL.omniLightLocation[i*3+2]);
			AGL.gl.uniform3f(this.pointLightColorUniform[i],AGL.omniLightColor[i*3+0],AGL.omniLightColor[i*3+1],AGL.omniLightColor[i*3+2]);
		}
		
		// uniform defining the waves (see shader code for details)
		AGL.gl.uniform3f(this.A0Uniform,this.A0[0],this.A0[1],this.A0[2]) ;
		AGL.gl.uniform3f(this.A1Uniform,this.A1[0],this.A1[1],this.A1[2]) ;
		AGL.gl.uniform3f(this.A2Uniform,this.A2[0],this.A2[1],this.A2[2]) ;
		AGL.gl.uniform3f(this.A3Uniform,this.A3[0],this.A3[1],this.A3[2]) ;
		// xRange and time
		AGL.gl.uniform2f(this.xRangeUniform,this.xRange[0],this.xRange[1]) ;
		AGL.gl.uniform1f(this.timeUniform,this.wTime) ;
		
    }
	
	// init
	this.program  = this.createProgram(AGL,fragmentShaderID, vertexShaderID) ;    
}