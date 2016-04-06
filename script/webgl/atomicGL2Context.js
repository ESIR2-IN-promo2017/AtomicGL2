// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.3
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGL2Context
//----------------------------------------------------------------------------------------
"use strict";

class atomicGL2Context {
	// constructor

	//------------------------
	constructor(){
		// attributes
		// -------------------------------------------------
		// GL context
		this.gl ;
		// GL context size
		this.viewportWidth ;
		this.viewportHeight ;

		// Ambient lights
		this.ambientLightColor;

		// GLtexture
		this.GLtexture      = [];
		
		// -------------------------------------------------
		// scene assets
		// -------------------------------------------------
		// shaders
		this.shaderPrograms = new Map();
		// textures
		this.textures       = [];
		// shapes
		this.shapes         = [];
		// lights
		this.lights         = new Map();
		this.nbPointLights        = 0; 
		this.nbSpotLights         = 0;
		this.nbDirectionnalLights = 0;
		
		// scene graph
		this.scenegraph     = null;
	}

	// methods
	// --------------------------------------------------
	// initGL(canvas)
	//---------------------------
	// inputs: 	canvas: html canvas
	// 			backgroundColor: [float, float, float]
	initGL(canvas,backgroundColor) {
		// debug
		//console.log("atomicGLContext::initGL");
		// recover canvas openGL
    	try {
      		this.gl = canvas.getContext("webgl");
     	 	this.viewportWidth = canvas.width;
      		this.viewportHeight = canvas.height;
    	} 

    	catch (e) 
    	{}

		// error in the initialisation of GL context
    	if (!this.gl) 
      		alert("atomicGLContext::Could not initialise WebGL");
    	
		else 
		{ 
			// GL context initialised -> first init (background color, DEPTH_TEST)
			this.gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], 1.0);
			this.gl.enable(this.gl.DEPTH_TEST);
		}

		// GLtexture
		this.GLtexture.push(this.gl.TEXTURE0);
		this.GLtexture.push(this.gl.TEXTURE1);
		this.GLtexture.push(this.gl.TEXTURE2);
		this.GLtexture.push(this.gl.TEXTURE3);
		this.GLtexture.push(this.gl.TEXTURE4);
		this.GLtexture.push(this.gl.TEXTURE5);
		this.GLtexture.push(this.gl.TEXTURE6);
		this.GLtexture.push(this.gl.TEXTURE7);
  	}

	// initDraw()
	//---------------------------
	initDraw() {
		// debug
		// console.log("atomicGLContext::initDraw");
		this.gl.viewport(0, 0, this.viewportWidth, this.viewportHeight);
   	 	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	}

	// pushLight(light)
	// ---------------------------
	// inputs: 	light - atomicGLLight
	pushLight(id,light){
		// debug
		// console.log("atomicGLContext::pushLight");
		this.lights.set(id,light);
		switch(light.getType())
		{
			case atomicGL2PointLight :
				this.nbPointLights ++;
				break;
			case atomicGL2SpotLight :
				this.nbSpotLights ++;
				break;
			case atomicGL2DirectionnalLight :
				this.nbDirectionnalLights ++;
				break;

		}
		console.log("New ligth added: " + id);
	}

	// pushProgram(prog)
	// ---------------------------
	// inputs: prog - atomicGLShader
	pushProgram(name,prog){
		// debug
		//console.log("atomicGLContext::pushProgram");
		this.shaderPrograms.set(name,prog);
		var id =  this.shaderPrograms.length -1
		// debug
		//console.log("-- atomicGLContext::pushProgram("+prog.name+")-> index:"+id);
		return  id ;
	}

	// indexOfTexture
	// ---------------------------------------
	// input: 	id - string: id name of texture
	// output:	int - index of texture in this.textures
	indexOfTexture(id){
		var res = -1 ;

		for (var i=0; i<this.textures.length;i++)
		{
			var idTex = this.textures[i].id ;
			if (id==idTex)
			{
				res = i;
				break;
			}
		}

		return res;
	}

	// indexOfShader
	// ---------------------------------------
	// input: 	id - string: id name of shader
	// output:	int - index of shader in this.shaders
	indexOfShader(id){
		var res = -1 ;

		for (var i=0; i<this.shaderPrograms.length;i++)
		{
			var shadername = this.shaderPrograms[i].name ;
			if (id==shadername)
			{
				res = i;
				break;
			}
		}

		return res;
	}

	// indexOfShape
	// ---------------------------------------
	// input: 	id - string: id name of shape
	// output:	int - index of shape in this.shapes
	indexOfShape(id){
		var res = -1 ;

		for (var i=0; i<this.shapes.length;i++)
		{
			var shapename = this.shapes[i].name;
			if (id==shapename)
			{
				res = i;
				break;
			}
		}
		return res;
	}

	getShaderProgram(id){
		return this.shaderPrograms.get(id);
	}

	getLight(id){
		return this.lights.get(id);
	}
}
