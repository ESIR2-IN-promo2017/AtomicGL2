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
		this.gl;
		// GL context size
		this.viewportWidth;
		this.viewportHeight;

		// Ambient lights
		this.backgroundColor;

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


		this.rttFramebuffer = null;
		this.rttTexture		= null;
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
			this.backgroundColor = backgroundColor;

			this.gl.enable(this.gl.DEPTH_TEST);
			this.gl.depthFunc(this.gl.LESS);
			this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
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


    initTextureFramebuffer() {
        this.rttFramebuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.rttFramebuffer);
        this.rttFramebuffer.width = 512;
        this.rttFramebuffer.height = 512;

        this.rttTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.rttTexture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 512, 512, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);


        var renderbuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, renderbuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, 512, 512);

        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.rttTexture, 0);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, renderbuffer);

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
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
		return  id;
	}

	// indexOfTexture
	// ---------------------------------------
	// input: 	id - string: id name of texture
	// output:	int - index of texture in this.textures
	indexOfTexture(id){
		var res = -1;

		for (var i=0; i<this.textures.length;i++)
		{
			var idTex = this.textures[i].id;
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
		var res = -1;

		for (var i=0; i<this.shaderPrograms.length;i++)
		{
			var shadername = this.shaderPrograms[i].name;
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
		var res = -1;

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
