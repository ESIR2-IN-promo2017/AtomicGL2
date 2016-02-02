// atomicGL2
//----------------------------------------------------------------------------------------
// author: RC				
// contact: cozot@irisa.fr
// version: 2.2
// current version date: 2016/01/28
//----------------------------------------------------------------------------------------
// atomicGL2Shader
// atomicGL2MatShader exetnds  atomicGL2Shader
// atomicGL2ShaderLoader
// atomicGL2ShaderLoaderScriptInLine extends atomicGL2ShaderLoader
// atomicGL2ShaderLoaderScriptXML extends atomicGL2ShaderLoader
//----------------------------------------------------------------------------------------
class atomicGL2ShaderLoader{
	constructor(){
		this.vertexShaderSRC = "";
		this.fragmentShaderSRC = "" ;
		this.attributesShaderSRC = [];
		this.uniformsShaderSRC = [];
		this.sampler = [];
	}
	getVertex(){return this.vertexShaderSRC;}
	getFragment(){return this.fragmentShaderSRC;}
	getAttributes(){return this.attributesShaderSRC;}
	getUniforms(){ return this.uniformsShaderSRC;}
	getNbTexture(){return this.sampler.length;}
	getSampler2D(){return this.sampler;}
}

class atomicGL2ShaderLoaderScriptInLine extends atomicGL2ShaderLoader {
	constructor(vertexShaderID,fragmentShaderID){
		super();
		this.vertexShaderSRC = this.getShaderSRC(vertexShaderID) ; 
		this.fragmentShaderSRC = this.getShaderSRC(fragmentShaderID) ; 
	}
	// getShaderSRC
	// -------------------------
	// get shader source 
	getShaderSRC(id) {
		var shader;
		var str = "";
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
		}
		// debug
		// ----------------------
		//console.log("atomicGL2::"+"atomicGL2ShaderLoaderScriptInLine::"+"getShaderSRC"+"shader source->"+ str);
		return str;
	}
}

class atomicGL2ShaderLoaderScriptXML extends atomicGL2ShaderLoader {
		constructor(xmlfile){
		super();
		this.vertexShaderSRC = this.getShaderSRC(xmlfile,"vertex") ; 
		this.fragmentShaderSRC = this.getShaderSRC(xmlfile,"fragment") ; 
		this.attributesShaderSRC = this.Xplode(this.getShaderSRC(xmlfile,"attributes"),"attribute");
		this.uniformsShaderSRC = this.Xplode(this.getShaderSRC(xmlfile,"uniformsVertex"),"uniform");
										+ this.Xplode(this.getShaderSRC(xmlfile,"uniformsFragment"),"uniform");
	}

	/*------------------------------------------
	
	param type : the type request it would be "attribute" or "uniform" 

	return : an array with all the identifiers of the type 
	
	this funciton instanciate also the number of texture and light
	------------------------------------------------*/
	Xplode(str,type){
		let array = [];
		var line= str.split("\n");
		for (var i = 0; i < line.length; i++) {
			let elem =[];
			var res = line[i].split(" ");
			if (typeof res !== 'undefined' && res.length > 0) {
				if(res[0].indexOf('//') > -1 )
					continue;
				if(res[0].indexOf('\t')>-1){
					res[0]= res[0].split('\t');
					for (var y = 0; y < res[0].length; y++) {
						if(res[0][y] == type){
							res[0]=res[0][y];
							break;
						}
					};
				}
			}		
			//deleting the empty element in the array 
			for(var j = res.length - 1; j >= 0; j--) {
			    for (var k = res[j].length- 1; k >= 0; k--) {
			    	if(res[j][k] == '') {
			       		res[j].splice(j, 1);
			    	}
			    }
   			    if(res[j] == '') {
			       res.splice(j, 1);
			    }
			}
			if (typeof res !== 'undefined' && res.length > 0) {
				for (var y = 0; y < res[0].length; y++) {
					if(res[0][y] == type){
						res[0]=res[0][y];
						break;
					}
				}
				for (var y = 0; y < res[0].length; y++) {
					if(res[0].charAt(y) == '\t' || res[0].charAt(y) == ' '){
  						res[0]= res[0].substr(1);
  					}
				};
			}

			//retrieving the name of the variable
			if(res[2] != null && res[0]==type){
				if(res[2].indexOf(';') > -1)
					res[2]= res[2].slice(0, -1);

				//if it is a texture we save the sampler2D in sampler Array
				if (res[1] == "sampler2D"){
					this.sampler.push(res[2]);
				}else {
					elem.push(res[1], res[2]);
					array.push(elem);
				}
			}
		};
	return array;
	}

	// getShaderSRC
	// -------------------------
	// get shader source 
	getShaderSRC(xmlfile,type) {
		// loadXMLfile
		var xmlhttp=new XMLHttpRequest();
		xmlhttp.open("GET",xmlfile,false);
		xmlhttp.send();
		var xmlDoc=xmlhttp.responseXML;
		var str = "" ;

		switch (type){
			case "vertex" : 
				var xvertex = xmlDoc.getElementsByTagName("VERTEX");
				var xattributes = xmlDoc.getElementsByTagName("ATTRIBUTES");
				var xuniforms = xmlDoc.getElementsByTagName("UNIFORMS");
				var xoutput = xmlDoc.getElementsByTagName("OUTPUT");

				str = xvertex[0].childNodes[0].data + xattributes[0].childNodes[0].data 
					 +xuniforms[0].childNodes[0].data + xoutput[0].childNodes[0].data ;
			break ;
			case "fragment" :
				var xfragment = xmlDoc.getElementsByTagName("FRAGMENT");
				var xattributes = xmlDoc.getElementsByTagName("ATTRIBUTES");
				var xuniforms = xmlDoc.getElementsByTagName("UNIFORMS");
				var xoutput = xmlDoc.getElementsByTagName("OUTPUT");

				str = xfragment[0].childNodes[0].data + xuniforms[1].childNodes[0].data 
													  + xoutput[1].childNodes[0].data ;
			break ;
			case "attributes" :
				var xattributes = xmlDoc.getElementsByTagName("ATTRIBUTES");
				str = xattributes[0].childNodes[0].data ;
			break ;			
				case "uniformsVertex" :
				var xuniforms = xmlDoc.getElementsByTagName("UNIFORMS");
				str = xuniforms[0].childNodes[0].data ;
			break ;			
				case "uniformsFragment" :
				var xuniforms = xmlDoc.getElementsByTagName("UNIFORMS");
				str = xuniforms[1].childNodes[0].data ;
			break ;			
		}
		// debug
		// ----------------------
		//console.log("atomicGL2::"+"atomicGL2ShaderLoaderScriptXML::"+"getShaderSRC"+"shader source->"+ str);
		return str;
	}
}

class atomicGL2Shader{
	constructor(nname){this.name=nname;}
}

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

	constructor(nname, agl,shaderloader,nnbLights){
		// attributes
		// -------------------------------------------------
		super(nname);

		this.shaderloader =shaderloader;


		// nbTex
		this.nbTex = this.shaderloader.getNbTexture();

		// nbLights
		this.nbLight = nnbLights ;
		// program shader
		this.program ;

		this.i;
		// attributes
		// --------------------------
			this.mapAttributes = new Map();
		
		// uniforms
		// --------------------------
			this.mapUniforms = new Map();

			// light
			this.ambientColorUniform ;
			this.pointLightLocationUniform = [] ;
			this.pointLightColorUniform = [] ;
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
		//console.log("atomicGLShader2::createProgram -> compile result: "+agl.gl.getShaderParameter(vertexShader, agl.gl.COMPILE_STATUS));
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
		//console.log("atomicGLShader2::createProgram -> compile result: "+agl.gl.getShaderParameter(fragmentShader, agl.gl.COMPILE_STATUS));
		// check erreur de compilation
        if (!agl.gl.getShaderParameter(fragmentShader, agl.gl.COMPILE_STATUS)) {
            alert(agl.gl.getShaderInfoLog(fragmentShader));
            return null;
        }

    	//console.log(this.shaderloader.getFragmentUniforms());

		
		// creation program et link
        var program = agl.gl.createProgram();
        agl.gl.attachShader(program, vertexShader);
        agl.gl.attachShader(program, fragmentShader);
        agl.gl.linkProgram(program);

		// debug
		//console.log("atomicGLShader::createProgram-> link result: "+agl.gl.getProgramParameter(program, agl.gl.LINK_STATUS));
        if (!agl.gl.getProgramParameter(program, agl.gl.LINK_STATUS)) {
            alert("atomicGLShader::Could not initialise shaders");
        }

		// attributes
		//------------------------
       	for (var key of this.mapAttributes.keys()) {
			this.mapAttributes.set(key,agl.gl.getAttribLocation(program, key));
	    	agl.gl.enableVertexAttribArray(this.mapAttributes.get(key));

		}

		// uniforms
		//------------------------
	 	for (var key of this.mapUniforms.keys()) {
	        this.mapUniforms.set(key,agl.gl.getUniformLocation(program, key));

	    }

		if(this.nbTex>0){
			agl.gl.enableVertexAttribArray(this.mapAttributes.get("aVertexTexCoord"));
		}

		
		// lights
		// uAmbientColor
		// uPointLightingPosition0|1|2 required per light in the shader
		// uPointLightingColor0|1|2 required per light in the shader        
		
		this.ambientColorUniform = agl.gl.getUniformLocation(program, "uAmbientColor");
		
        for (var i = 0; i < this.nbLight; i++) { 
			// lights  	position 
			//			color
			//console.log("atomicGLShader::createProgram - getUniformLocation ->"+"uPointLightPosition"+i);
			//console.log("atomicGLShader::createProgram - getUniformLocation ->"+"uPointLightColor"+i);
			this.pointLightLocationUniform[i] = agl.gl.getUniformLocation(program, "uPointLightPosition"+i);
			this.pointLightColorUniform[i] = agl.gl.getUniformLocation(program, "uPointLightColor"+i);
		}
		
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
        //		ambient
        aGL.gl.uniform3f(this.ambientColorUniform,aGL.ambientLightColor[0],aGL.ambientLightColor[1],aGL.ambientLightColor[2]);
		//		Omni
		for (var i=0; i < this.nbLight ; i++){
			// debug
			//console.log("-- atomicGLShader::setUniforms - Light number ("+i+")");
			//console.log("-- LightLocation @"+this.pointLightLocationUniform[i]+"::" +aGL.omniLightLocation[i*3+0] +","+ aGL.omniLightLocation[i*3+1]+","+ aGL.omniLightLocation[i*3+2] );
			//console.log("-- LightColor @"+this.pointLightColorUniform[i]+"::" +aGL.omniLightColor[i*3+0] +","+ aGL.omniLightColor[i*3+1]+","+ aGL.omniLightColor[i*3+2] );
			
			aGL.gl.uniform3f(this.pointLightLocationUniform[i], aGL.omniLightLocation[i*3+0], aGL.omniLightLocation[i*3+1], aGL.omniLightLocation[i*3+2]);
			aGL.gl.uniform3f(this.pointLightColorUniform[i],aGL.omniLightColor[i*3+0],aGL.omniLightColor[i*3+1],aGL.omniLightColor[i*3+2]);
		}

		/*for (var i = 0; i <this.shaderloader.getUniforms().length ;i++) {
			for (var key of this.mapUniforms.keys()) {
				if((this.shaderloader.getUniforms()[i])[1] == key){
					switch ((this.shaderloader.getUniforms()[i])[0]) {
						case "vec4":
							
							console.log('vec3');
							break;
						case "vec3":
							aGL.gl.uniform3f(this.mapUniforms.get(key),);

							console.log('vec2');
							break;	
						default:
							// statements_def
							break;
					}
				}

		  	}
		}*/

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

	/**
	//return the Vertex Position attribute in the vertex shader
	*/
	getVertexPosition(){
		for (var key of this.mapAttributes.keys()) {

			var res = (key.indexOf('position') > -1) || (key.indexOf('position') > -1) ;
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