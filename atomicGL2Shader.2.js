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

	}
	getVertex(){return this.vertexShaderSRC;}
	getFragment(){return this.fragmentShaderSRC;}
	getAttributes(){return this.attributesShaderSRC;}
	getUniforms(){return this.uniformsShaderSRC;}


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
		this.attributesShaderSRC = this.Xplode(this.getShaderSRC(xmlfile,"attributes"));
		this.uniformssShaderSRC = this.Xplode(this.getShaderSRC(xmlfile,"uniforms"));

	}


	Xplode(str){
			let array = [];
			var line= str.split("\n");
			for (var i = 0; i < line.length; i++) {
				var res = line[i].split(" ",3);
				if(res[2] != null){
					if(res[2].indexOf(';') > -1)
						res[2]= res[2].slice(0, -1);
					array.push(res[2]);
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
				str = xfragment[0].childNodes[0].data ;
			break ;
			case "attributes" :
				var xattributes = xmlDoc.getElementsByTagName("ATTRIBUTES");
				str = xattributes[0].childNodes[0].data ;
			break ;			
				case "uniforms" :
				var xuniforms = xmlDoc.getElementsByTagName("UNIFORMS");
				str = xuniforms[0].childNodes[0].data ;
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

	constructor(nname, agl,shaderloader,nnbTex,nnbLights){
		// attributes
		// -------------------------------------------------
		super(nname);
		// nbTex
		this.nbTex = nnbTex ;
		// nbLights
		this.nbLight = nnbLights ;
		// program shader
		this.program ;

		this.shaderloader =shaderloader;
		
		// attributes
		// --------------------------
			this.vertexPositionAttribute ;
			this.vertexNormalAttribute ;
			this.vertexColorAttribute ;
			this.texCoordAttribute ;
		// uniforms
		// --------------------------
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

			this.mapAttributes = new Map();
			this.mapUniforms = new Map();
		
			for (var i =0; i <  shaderloader.getAttributes().length; i++) {
				this.mapAttributes.set(shaderloader.getAttributes()[i],null);
			};
			for (var i =0; i <  shaderloader.getUniforms().length; i++) {
				this.mapUniforms.set(shaderloader.getUniforms()[i],null);
			};

	this.build(agl,this.shaderloader);		
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
		//console.log("atomicGLShader::createProgram-> link result: "+agl.gl.getProgramParameter(program, agl.gl.LINK_STATUS));
        if (!agl.gl.getProgramParameter(program, agl.gl.LINK_STATUS)) {
            alert("atomicGLShader::Could not initialise shaders");
        }

		// attributes
		//------------------------
		// aVertexPosition
		// aVertexNormal
		// aVertexColor
		// aVertexTexCoord
		
		for (var key of this.mapAttributes.keys()) {
			this.mapAttributes.set(key,agl.gl.getAttribLocation(program, key));
	    	agl.gl.enableVertexAttribArray(this.mapAttributes.get(key));
		}
	
	 	for (var key of this.mapUniforms.keys()) {
	        this.mapUniforms.set(key,agl.gl.getAttribLocation(program, key));
	    	agl.gl.enableVertexAttribArray(this.mapUniforms.get(key));
	    }


		if(this.nbTex>0){
			this.texCoordAttribute = agl.gl.getAttribLocation(program, "aVertexTexCoord");
			agl.gl.enableVertexAttribArray(this.texCoordAttribute);
		}
		
		// uniforms
		//------------------------
		// uPMatrix: 	Projection matrix
		// uMVMatrix: 	ModelView matrix
		// uNMatrix:	Normal matrix
		//------------------------
		// debug
		//console.log("atomicGLShader::createProgram - uniforms ");
		// matrix
        this.pMatrixUniform = agl.gl.getUniformLocation(program, "uPMatrix");
        this.mvMatrixUniform = agl.gl.getUniformLocation(program, "uMVMatrix");
        this.nMatrixUniform = agl.gl.getUniformLocation(program, "uNMatrix");
		
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
			//console.log("atomicGLShader::createProgram - getUniformLocation ->"+"uSampler"+i);
			this.samplerUniform[i] = agl.gl.getUniformLocation(program, "uSampler"+i);
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
    	aGL.gl.uniformMatrix4fv(this.pMatrixUniform, false, aMS.pMatrix);
        aGL.gl.uniformMatrix4fv(this.mvMatrixUniform, false, aMS.mvMatrix);

        var normalMatrix = mat3.create();
        mat4.toInverseMat3(aMS.mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        aGL.gl.uniformMatrix3fv(this.nMatrixUniform, false, normalMatrix);
        
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
		
		// textures
    }
	
	// build
	//-----------------------------
	build(agl,shaderloader){ 
		this.program = this.createProgram(agl,shaderloader.getVertex(), shaderloader.getFragment());
		

	}


	hasVertexPositionAttribute(src){
		for(var i = 0 ;  i < src.length; ++i){
			var res = (src[i].indexOf('position') > -1) || (src[i].indexOf('Position') > -1) ;
			if(res)
				return true;
		}
		return false;
	}
	
	hasVertexNormalAttribute(src){
	for(var i = 0 ;  i < src.length; ++i){
			var res = (src[i].indexOf('normal') > -1) || (src[i].indexOf('Normal') > -1) ;
			if(res)
				return true;
		}
		return false;
	}
	hasVertexColorAttribute(src){
		for(var i = 0 ;  i < src.length; ++i){
			var res = (src[i].indexOf('color') > -1) || (src[i].indexOf('Color') > -1) ;
			if(res)
				return true;
		}
		return false;
	}


	getVertexPosition(){
		for (var key of this.mapAttributes.keys()) {
			var res = (key.indexOf('position') > -1) || (key.indexOf('position') > -1) ;
			if(res)
				return this.mapAttributes.get(key);
		}
	
	}

	getVertexNormal(){
		for (var key of this.mapAttributes.keys()) {
			var res = (key.indexOf('normal') > -1) || (key.indexOf('Normal') > -1) ;
			if(res)
				return this.mapAttributes.get(key);
		}
	
	}
	getVertexColor(){
		for (var key of this.mapAttributes.keys()) {
			var res = (key.indexOf('color') > -1) || (key.indexOf('Color') > -1) ;
			if(res)
				return this.mapAttributes.get(key);
		}
	
	}
			
}