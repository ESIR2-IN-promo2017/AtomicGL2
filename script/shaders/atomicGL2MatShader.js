
"use strict";

class  atomicGL2MatShader extends atomicGL2Shader{
	// constructor
	//------------------------
	// inputs:	nname: 		shader name - string
	//			 AGL:				atomicGL context
	// 			shaderloader: 		shader loader
	//			nbTex: 				integer
	//									0: shader doesn't use texture
	//									1..: 	use texture aVertexTexCoord 	required in the shader
	//									uSampler0 | uSampler[nbTex-1]	required in the shader
	// 			nnbLight:			int - number of Lights in the shader
	//									uPointLightPosition0|1|2 required per light in the shader
	//									uPointLightColor0|1|2 required per light in the shader

	constructor(AGL,shaderloader){
		// attributes
		// -------------------------------------------------
		super();

		this.shaderloader = shaderloader;

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

		this.build(AGL,this.shaderloader);
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
	// inputs:	AGL: GL context
	// 			vstr: vertex shader  - string
	// 			fstr: fragment shader - string
    createProgram(AGL,vstr,fstr) {
		// debug
		//console.log("atomicGLShader::createProgram ("+fragmentShaderID+","+vertexShaderID+")");

		// creation des shaders
		// vertex
    	var vertexShader = AGL.gl.createShader(AGL.gl.VERTEX_SHADER);
		// set source
    	AGL.gl.shaderSource(vertexShader, vstr);
		// shader compilation
    	AGL.gl.compileShader(vertexShader);
		// debug
		console.log("atomicGLShader2::createProgram -> compile vertex result: "+AGL.gl.getShaderParameter(vertexShader, AGL.gl.COMPILE_STATUS));
		// check erreur de compilation
    	if (!AGL.gl.getShaderParameter(vertexShader, AGL.gl.COMPILE_STATUS)) {
    		alert(AGL.gl.getShaderInfoLog(vertexShader));
      		return null;
    	}

		// fragment
		var fragmentShader = AGL.gl.createShader(AGL.gl.FRAGMENT_SHADER);
		// set source
    	AGL.gl.shaderSource(fragmentShader, fstr);
		// shader compilation
    	AGL.gl.compileShader(fragmentShader);
		// debug
		console.log("atomicGLShader2::createProgram -> compile fragment result: "+AGL.gl.getShaderParameter(fragmentShader, AGL.gl.COMPILE_STATUS));
		// check erreur de compilation
    	if (!AGL.gl.getShaderParameter(fragmentShader, AGL.gl.COMPILE_STATUS)) {
      		alert(AGL.gl.getShaderInfoLog(fragmentShader));
      		return null;
    	}

		// creation program et link
	    var program = AGL.gl.createProgram();
	    AGL.gl.attachShader(program, vertexShader);
	    AGL.gl.attachShader(program, fragmentShader);
	    AGL.gl.linkProgram(program);

		// debug
		console.log("atomicGLShader2::createProgram-> link result: "+AGL.gl.getProgramParameter(program, AGL.gl.LINK_STATUS));
	    if (!AGL.gl.getProgramParameter(program, AGL.gl.LINK_STATUS)) {
	      alert("atomicGLShader2::Could not initialise shaders");
	    }

		// attributes
		//------------------------
	    for (var key of this.mapAttributes.keys())
	    {
			this.mapAttributes.set(key,AGL.gl.getAttribLocation(program, key));
	  		AGL.gl.enableVertexAttribArray(this.mapAttributes.get(key));
		}



		// uniforms
		//------------------------
	 	for (var key of this.mapUniforms.keys())
	 	{
	 		if(key == "pointLights")
	 		{
	 			for(var i=0; i<AGL.nbPointLights; i++)
	 			{
	  				this.mapUniforms.set(key + "[" + i + "].position",AGL.gl.getUniformLocation(program, key + "[" + i + "].position"));
	  				this.mapUniforms.set(key + "[" + i + "].color",AGL.gl.getUniformLocation(program, key + "[" + i + "].color"));
	  				this.mapUniforms.set(key + "[" + i + "].intensity",AGL.gl.getUniformLocation(program, key + "[" + i + "].intensity"));
	 			}
	 		}

	 		else if(key == "spotLights")
	 		{
	 			for(var i=0; i<AGL.nbSpotLights; i++)
	 			{
	  				this.mapUniforms.set(key + "[" + i + "].position",AGL.gl.getUniformLocation(program, key + "[" + i + "].position"));
	  				this.mapUniforms.set(key + "[" + i + "].direction",AGL.gl.getUniformLocation(program, key + "[" + i + "].direction"));
	  				this.mapUniforms.set(key + "[" + i + "].color",AGL.gl.getUniformLocation(program, key + "[" + i + "].color"));
	  				this.mapUniforms.set(key + "[" + i + "].radius",AGL.gl.getUniformLocation(program, key + "[" + i + "].radius"));
	  				this.mapUniforms.set(key + "[" + i + "].intensity",AGL.gl.getUniformLocation(program, key + "[" + i + "].intensity"));
	 			}
	 		}

	 		else if(key == "directionnalLights")
	 		{
	 			for(var i=0; i<AGL.nbDirectionnalLights; i++)
	 			{
	  				this.mapUniforms.set(key + "[" + i + "].direction",AGL.gl.getUniformLocation(program, key + "[" + i + "].direction"));
	  				this.mapUniforms.set(key + "[" + i + "].color",AGL.gl.getUniformLocation(program, key + "[" + i + "].color"));
	  				this.mapUniforms.set(key + "[" + i + "].intensity",AGL.gl.getUniformLocation(program, key + "[" + i + "].intensity"));
	 			}
	 		}

	 		else
	  			this.mapUniforms.set(key,AGL.gl.getUniformLocation(program, key));
	 	}

		if(this.nbTex>0)
			AGL.gl.enableVertexAttribArray(this.mapAttributes.get("aVertexTexCoord"));

		// lights
		// uAmbientColor
		this.ambientColorUniform = AGL.gl.getUniformLocation(program, "uAmbientColor");

		// textures
		for (var i = 0; i < this.nbTex; i++)
			this.samplerUniform[i] = AGL.gl.getUniformLocation(program, this.getTextureID(i));

    	return program;
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

	// setUniforms
	//----------------------------------------
	// inputs: 	AGL: atomicGLContext
	// 			AMS: atomicGLMatrixStack

	setUniforms(AGL,AMS){
		// debug
		//console.log("atomicGLShader::setUniforms ");
	  	// set this shader as active shader
	    AGL.gl.useProgram(this.program);

	    // matrix
	  	//		Projection
	  	// 		Model->view
	  	//		Normal built from Model->view
	  	if(this.hasProjectionMatrix(this.shaderloader.getUniforms()))
	 		AGL.gl.uniformMatrix4fv(this.getProjectionMatrix() , false, AMS.pMatrix);
	  	if(this.hasModelViewMatrix(this.shaderloader.getUniforms()))
	    	AGL.gl.uniformMatrix4fv(this.getModelViewMatrix(), false, AMS.mvMatrix);

	    var normalMatrix = mat3.create();
	    mat4.toInverseMat3(AMS.mvMatrix, normalMatrix);
	    mat3.transpose(normalMatrix);
	    if(this.hasNormalMatrix(this.shaderloader.getUniforms()))
	    	AGL.gl.uniformMatrix3fv( this.getNormalMatrix(), false, normalMatrix);

    	// Lights
    	var id_pointLight = 0;
    	var id_spotLight = 0;
    	var id_direcionnalLight = 0;

		for(var lightId of AGL.lights.keys())
		{
			switch(AGL.getLight(lightId).getType())
			{
				case atomicGL2PointLight:
					this.setUniformLightById(AGL, "pointLights" + '[' + id_pointLight + ']', AGL.getLight(lightId));
					id_pointLight++;
					break;

				case atomicGL2SpotLight:
					this.setUniformLightById(AGL, "spotLights" + '[' + id_spotLight + ']', AGL.getLight(lightId));
					id_spotLight++;
					break;

				case atomicGL2DirectionnalLight:
					this.setUniformLightById(AGL, "directionnalLights" + '[' + id_direcionnalLight + ']', AGL.getLight(lightId));
					id_direcionnalLight++;
					break;

				default:
					alert("Error with the Type of the Light: still not implemented");
					break;
			}
		}
	}

	setUniformLightById(AGL,id,value){
		//For a light
		//id = pointLights[0].direction;
		//value = (0.1,0.1,0.1);

		var trueID = "";

		if((value.getType() == atomicGL2PointLight) || (value.getType() == atomicGL2SpotLight) || (value.getType() == atomicGL2DirectionnalLight))
			trueID = (id.split('['))[0];

		else
			trueID = id;


		var type = this.getUniformType(trueID);
		// console.log(this.mapUniforms);
		var uniform = this.getUniformById(id);

		switch(type)
		{
			case 'pointLight':
				uniform = this.getUniformById(id + ".position");
				AGL.gl.uniform3f(uniform,value.getPosition()[0],value.getPosition()[1],value.getPosition()[2]);

				uniform = this.getUniformById(id + ".color");
				AGL.gl.uniform3f(uniform,value.getColor()[0],value.getColor()[1],value.getColor()[2]);

				uniform = this.getUniformById(id + ".intensity");
				AGL.gl.uniform3f(uniform,value.getIntensity()[0],value.getIntensity()[1],value.getIntensity()[2]);
			break;

			case 'spotLight':
				uniform = this.getUniformById(id + ".position");
				AGL.gl.uniform3f(uniform,value.getPosition()[0],value.getPosition()[1],value.getPosition()[2]);

				uniform = this.getUniformById(id + ".direction");
				AGL.gl.uniform3f(uniform,value.getDirection()[0],value.getDirection()[1],value.getDirection()[2]);

				uniform = this.getUniformById(id + ".color");
				AGL.gl.uniform3f(uniform,value.getColor()[0],value.getColor()[1],value.getColor()[2]);

				uniform = this.getUniformById(id + ".radius");
				AGL.gl.uniform1f(uniform,value.getRadius());

				uniform = this.getUniformById(id + ".intensity");
				AGL.gl.uniform3f(uniform,value.getIntensity()[0],value.getIntensity()[1],value.getIntensity()[2]);
			break;

			case 'directionnalLight':
				uniform = this.getUniformById(id + ".direction");
				AGL.gl.uniform3f(uniform,value.getDirection()[0],value.getDirection()[1],value.getDirection()[2]);

				uniform = this.getUniformById(id + ".color");
				AGL.gl.uniform3f(uniform,value.getColor()[0],value.getColor()[1],value.getColor()[2]);

				uniform = this.getUniformById(id + ".intensity");
				AGL.gl.uniform3f(uniform,value.getIntensity()[0],value.getIntensity()[1],value.getIntensity()[2]);
			break;

			default:
			break;
		}
	}

	setUniformById(AGL,id,value){
		var type = this.getUniformType(id);
		var uniform = this.getUniformById(id);

		switch(type)
		{
			case 'float':
				AGL.gl.uniform1f(uniform,value);
			break;

			case 'int' :
			break;

			case 'vec4' :
			break;

			case 'vec3' :
				AGL.gl.uniform3f(uniform,value[0],value[1],value[2]);
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

	// build
	//-----------------------------
	build(AGL,shaderloader){

		var fragment = shaderloader.getFragment();

		fragment = this.nomberOfLight(AGL,fragment,'NB_POINTLIGHTS',AGL.nbPointLights);
		fragment = this.nomberOfLight(AGL,fragment,'NB_SPOTLIGHTS',AGL.nbSpotLights);
		fragment = this.nomberOfLight(AGL,fragment,'NB_DIRECTIONNALLIGHTS',AGL.nbDirectionnalLights);

		this.program = this.createProgram(AGL,shaderloader.getVertex(),fragment);
		// console.log(this.shaderloader.getUniforms());
	}

	// Parse nomber of light
	//-----------------------------
	nomberOfLight(AGL,fragment,flAGLights,nbLights){

		var position = fragment.indexOf(flAGLights);

		if(nbLights == 0)
			nbLights = 1;

		if(position > -1)
			fragment = fragment.slice(0, position + flAGLights.length) + " " + nbLights + fragment.slice(position + flAGLights.length);

		return fragment;
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
			var res = (src[i][1].indexOf('color') > -1) || (src[i][1].indexOf('Color') > -1) ;
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
}
