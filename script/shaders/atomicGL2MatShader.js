"use strict";

class  atomicGL2MatShader extends atomicGL2Shader{
	// constructor
	//------------------------
	// inputs:	nname: 		shader name - string
	//			 agl:				atomicGL context
	// 			shaderloader: 		shader loader
	//			nbTex: 				integer
	//									0: shader doesn't use texture
	//									1..: 	use texture aVertexTexCoord 	required in the shader
	//									uSampler0 | uSampler[nbTex-1]	required in the shader
	// 			nnbLight:			int - number of Lights in the shader
	//									uPointLightPosition0|1|2 required per light in the shader
	//									uPointLightColor0|1|2 required per light in the shader

	constructor(agl,shaderloader){
		// attributes
		// -------------------------------------------------
		super();

		this.shaderloader =shaderloader;


		// nbTex
		this.nbTex = this.shaderloader.getNbTexture();

		// program shader
		this.program ;


		// map of attributes
		// --------------------------
		this.mapAttributes = new Map();

		// map of uniforms
		// --------------------------
		this.mapUniforms = new Map();

		// light
		this.ambientColorUniform ;
		this.pointLightLocationUniform = [] ;
		this.pointLightColorUniform    = [] ;

		// texture -sampler
		this.samplerUniform = [] ;

		//Initialisation of the key of the mapUniforms and mapAttributes
		this.initMap();

		this.build(agl,this.shaderloader);
	}

	initMap(){
		for (var i =0; i <  this.shaderloader.getAttributes().length; i++) {
			this.mapAttributes.set(this.shaderloader.getAttributes()[i][1],null);
		};
		for (var i =0; i <  this.shaderloader.getUniforms().length; i++) {
			this.mapUniforms.set(this.shaderloader.getUniforms()[i][1],null);
		};


	}

	// methods
	// --------------------------------------------------
	// createProgram
	//---------------------------
	// inputs:	agl: GL context
	// 			vstr: vertex shader  - string
	// 			fstr: fragment shader - string
    createProgram(agl,vstr,fstr) {
		// debug
		//console.log("atomicGLShader::createProgram ("+fragmentShaderID+","+vertexShaderID+")");
		
		// creation des shaders
		// vertex
        var vertexShader = agl.gl.createShader(agl.gl.VERTEX_SHADER);
		// set source
        agl.gl.shaderSource(vertexShader, vstr);
		// shader compilation
        agl.gl.compileShader(vertexShader);
		// debug
		console.log("atomicGLShader2::createProgram -> compile result: "+agl.gl.getShaderParameter(vertexShader, agl.gl.COMPILE_STATUS));
		// check erreur de compilation
        if (!agl.gl.getShaderParameter(vertexShader, agl.gl.COMPILE_STATUS)) {
            alert(agl.gl.getShaderInfoLog(vertexShader));
            return null;
        }

		// fragment
		var fragmentShader = agl.gl.createShader(agl.gl.FRAGMENT_SHADER);
		// set source
        agl.gl.shaderSource(fragmentShader, fstr);
		// shader compilation
        agl.gl.compileShader(fragmentShader);
		// debug
		console.log("atomicGLShader2::createProgram -> compile result: "+agl.gl.getShaderParameter(fragmentShader, agl.gl.COMPILE_STATUS));
		// check erreur de compilation
        if (!agl.gl.getShaderParameter(fragmentShader, agl.gl.COMPILE_STATUS)) {
            alert(agl.gl.getShaderInfoLog(fragmentShader));
            return null;
        }

		// creation program et link
        var program = agl.gl.createProgram();
        agl.gl.attachShader(program, vertexShader);
        agl.gl.attachShader(program, fragmentShader);
        agl.gl.linkProgram(program);

		// debug
		console.log("atomicGLShader2::createProgram-> link result: "+agl.gl.getProgramParameter(program, agl.gl.LINK_STATUS));
        if (!agl.gl.getProgramParameter(program, agl.gl.LINK_STATUS)) {
            alert("atomicGLShader2::Could not initialise shaders");
        }

		// attributes
		//------------------------
       	for (var key of this.mapAttributes.keys())
       	{
			this.mapAttributes.set(key,agl.gl.getAttribLocation(program, key));
	    	agl.gl.enableVertexAttribArray(this.mapAttributes.get(key));

		}

		// uniforms
		//------------------------
	 	for (var key of this.mapUniforms.keys())
	 	{
	        this.mapUniforms.set(key,agl.gl.getUniformLocation(program, key));
	    }

		if(this.nbTex>0){
			agl.gl.enableVertexAttribArray(this.mapAttributes.get("aVertexTexCoord"));
		}


		// lights
		// uAmbientColor
		this.ambientColorUniform = agl.gl.getUniformLocation(program, "uAmbientColor");
		
		

		// textures
		for (var i = 0; i < this.nbTex; i++) {
			this.samplerUniform[i] = agl.gl.getUniformLocation(program, this.getTextureID(i));
		}

        return program;
    }

    // setUniforms
    //----------------------------------------
    // inputs: 	aGL: atomicGLContext
	// 			aMS: atomicGLMatrixStack
    setUniforms(aGL,aMS){
		// debug
		//console.log("atomicGLShader::setUniforms ");
    	// set this shader as active shader
    	aGL.gl.useProgram(this.program);


    	// matrix
    	//		Projection
    	// 		Model->view
    	//		Normal built from Model->view
    	if(this.hasProjectionMatrix(this.shaderloader.getUniforms()))
   			aGL.gl.uniformMatrix4fv(this.getProjectionMatrix() , false, aMS.pMatrix);
    	if(this.hasModelViewMatrix(this.shaderloader.getUniforms()))
	        aGL.gl.uniformMatrix4fv(this.getModelViewMatrix(), false, aMS.mvMatrix);

        var normalMatrix = mat3.create();
        mat4.toInverseMat3(aMS.mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        if(this.hasNormalMatrix(this.shaderloader.getUniforms()))
        	aGL.gl.uniformMatrix3fv( this.getNormalMatrix(), false, normalMatrix);

        // Lights
		for(var lightId of agl.lights.keys())
		{
			if(this.hasLight(lightId))
			{
				switch(agl.getLight(lightId).getType())
				{
					case atomicGL2PointLight:
						this.setUniformById(agl,lightId + "Position",agl.getLight(lightId).getPosition());
						this.setUniformById(agl,lightId + "Color",agl.getLight(lightId).getColor());
						this.setUniformById(agl,lightId + "Intensity",agl.getLight(lightId).getColor());

					break;

					case atomicGL2DirectionnalLight:
						this.setUniformById(agl,lightId + "Direction",agl.getLight(lightId).getDirection());
						this.setUniformById(agl,lightId + "Color",agl.getLight(lightId).getColor());
					break;

					case atomicGL2SpotLight:
						this.setUniformById(agl,lightId + "Postition",agl.getLight(lightId).getPosition());
						this.setUniformById(agl,lightId + "Direction",agl.getLight(lightId).getDirection());
						this.setUniformById(agl,lightId + "Radius",agl.getLight(lightId).getRadius());
						this.setUniformById(agl,lightId + "Color",agl.getLight(lightId).getColor());
					break;

					default:
						alert("Error with the Type of the Light: still not implemented");
					break;
				}
			}
		}

    }

	// build
	//-----------------------------
	build(agl,shaderloader){
		this.program = this.createProgram(agl,shaderloader.getVertex(), shaderloader.getFragment());
	}

	//----------------Getter----------------------------------------//
	/**
	//param src : the attributes of the vertex shader
		src[0] : one attribute
		src[0][0] : type (vec3 | vec 2 ...)
		src[0][1] : the identifier of the attribute
	//return if there is a position attribute in the vertex shader
	*/
	hasVertexPositionAttribute(src){
		for(var i = 0 ;  i < src.length; ++i){
			var res = (src[i][1].indexOf('position') > -1) || (src[i][1].indexOf('Position') > -1) ;
			if(res)
				return true;
		}
		return false;
	}


	/**
	//param src : the attributes of the vertex shader
	//return if there is a Normal attribute in the vertex shader
	*/
	hasVertexNormalAttribute(src){
	for(var i = 0 ;  i < src.length; ++i){
			var res = (src[i][1].indexOf('normal') > -1) || (src[i][1].indexOf('Normal') > -1) ;
			if(res)
				return true;
		}
		return false;
	}


	/**
	//param src : the attributes of the vertex shader
	//return if there is a color attribute in the vertex shader
	*/
	hasVertexColorAttribute(src){
		for(var i = 0 ;  i < src.length; ++i){
			var res = (src[i].indexOf('color') > -1) || (src[i].indexOf('Color') > -1) ;
			if(res)
				return true;
		}
		return false;
	}


	/**
	//param src : the uniforms of the vertex shader
	//return if there is a projection matrix in the vertex shader
	*/
	hasProjectionMatrix(src){
		for(var i = 0 ;  i < src.length; ++i){
			var res = (src[i][1].indexOf('uPMatrix') > -1) ;
			if(res)
				return true;
		}
		return false;
	}


	/**
	//param src : the uniforms of the vertex shader
	//return if there is a model viex matrix in the vertex shader
	*/
	hasModelViewMatrix(src){
		for(var i = 0 ;  i < src.length; ++i){
			var res = (src[i][1].indexOf('uMVMatrix') > -1) ;
			if(res)
				return true;
		}
		return false;
	}


	/**
	//param src : the uniforms of the vertex shader
	//return if there is a normal Matrix in the vertex shader
	*/
	hasNormalMatrix(src){
		for(var i = 0 ;  i < src.length; ++i){
			var res = (src[i][1].indexOf('uNMatrix') > -1) ;
			if(res)
				return true;
		}
		return false;
	}

	hasLight(lightId){
		for(var uniformId of this.mapUniforms.keys())
		{
			if(uniformId.indexOf(lightId) > -1)
				return true;
		}

		return false;
	}

	/**
	//return the Vertex Position attribute in the vertex shader
	*/
	getVertexPosition(){
		for (var key of this.mapAttributes.keys()) {

			var res = (key.indexOf('position') > -1) || (key.indexOf('Position') > -1) ;
			if(res){
				return this.mapAttributes.get(key);
			}
		}

	}

	/**
	//return the Vertex Normal attribute in the vertex shader
	*/
	getVertexNormal(){
		for (var key of this.mapAttributes.keys()) {
			var res = (key.indexOf('normal') > -1) || (key.indexOf('Normal') > -1) ;
			if(res)
				return this.mapAttributes.get(key);
		}

	}

	/**
	//return the Vertex Color attribute in the vertex shader
	*/
	getVertexColor(){
		for (var key of this.mapAttributes.keys()) {
			var res = (key.indexOf('color') > -1) || (key.indexOf('Color') > -1) ;
			if(res)
				return this.mapAttributes.get(key);
		}
	}

	/**
	//return the Projection Matrix uniform in the vertex shader
	*/
	getProjectionMatrix(){
		return this.mapUniforms.get("uPMatrix");
	}

	/**
	//return the Model View Matrix uniform in the vertex shader
	*/
	getModelViewMatrix(){
		return this.mapUniforms.get("uMVMatrix");
	}

	/**
	//return the Normal Matrix uniform in the vertex shader
	*/
	getNormalMatrix(){
		return this.mapUniforms.get("uNMatrix");
	}

	getTextureCoord(){
		return this.mapAttributes.get("aVertexTexCoord");
	}

	getTextureID(id){
		return this.shaderloader.getSampler2D()[id];
	}

	getAllTexture(){
		return this.shaderloader.getSampler2D();
	}

	getUniformType(id){
		var arr = this.shaderloader.getUniforms();
		for (var i = 0; i <arr.length ; i++)
			if(arr[i][1] == id)
				return arr[i][0];
	}

	getUniformById(id){
		return this.mapUniforms.get(id);
	}

	setUniformById(agl,id,value){
		var type = this.getUniformType(id) ;
		var uniform = this.getUniformById(id);
		
		switch(type)
		{
			case 'float':
				agl.gl.uniform1f(uniform,value);
			break;

			case 'int' :
		
			break;

			case 'vec4' :
	
			break;

			case 'vec3' :
				agl.gl.uniform3f(uniform,value[0],value[1],value[2]);

			break;

			case 'vec2' :

			break;

			case 'mat3' :
			
			break;

			case 'mat4' :
			
			break;

			default:
				
			break;
		}
	}
}