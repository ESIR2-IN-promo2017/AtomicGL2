// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 0.1
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGL2Texture
//----------------------------------------------------------------------------------------
// TODO list
//----------------------------------------------------------------------------------------
"use strict";


class atomicGL2Texture{

// constructor
//------------------------
// inputs
//------------------------
// ffile: 	texture filename - string
// ttype:		texture type : color | normal | displacement | specular | opacity - string
// aAGL:		atomicGL context


	constructor(iid,ffile, ttype, aAGL){
		// debug
		//console.log("atomicGLTexture::constructor("+ffile+")");
		// attributes
		// -------------------------------------------------
		// local context
		this.AGL = aAGL;
		// texture id
		this.id = iid;
		// file name
		this.file = ffile;
		// texture type
		this.type = ttype;
		// texture image
		this.textureImage = new Image();
		// ogl texture
	    this.texture = aAGL.gl.createTexture();
	    this.texture.image =   this.textureImage;

	    // build
	    this.build();
	}

	// --------------------------------------------------
	// methods
	// --------------------------------------------------
	// handleIMG(o)
	//---------------------------
	// inputs
	//---------------------------
	// o: 	this - atomicGLtexture
	//---------------------------
	handleIMG(){
		// debug
		//console.log("atomicGLTexture::onload("+this.file+")");

		this.AGL.gl.pixelStorei(this.AGL.gl.UNPACK_FLIP_Y_WEBGL, true);
		// bindTexture
		this.AGL.gl.bindTexture(this.AGL.gl.TEXTURE_2D, this.texture);
		this.AGL.gl.texImage2D(this.AGL.gl.TEXTURE_2D, 0, this.AGL.gl.RGBA, this.AGL.gl.RGBA, this.AGL.gl.UNSIGNED_BYTE, this.texture.image);
		// parameters
		this.AGL.gl.texParameteri(this.AGL.gl.TEXTURE_2D, this.AGL.gl.TEXTURE_MAG_FILTER, this.AGL.gl.LINEAR);
		this.AGL.gl.texParameteri(this.AGL.gl.TEXTURE_2D, this.AGL.gl.TEXTURE_MIN_FILTER, this.AGL.gl.LINEAR_MIPMAP_NEAREST);
		this.AGL.gl.generateMipmap(this.AGL.gl.TEXTURE_2D);
		// unbind
		this.AGL.gl.bindTexture(AGL.gl.TEXTURE_2D, null);
		// loaded !
		this.loaded = true;
	}

	// --------------------------------------------------
	// build
	// --------------------------------------------------
	// handle image load
	build(){
		this.textureImage.onload = this.handleIMG.bind(this);

		// init: set the file src
		this.textureImage.src = this.file;
	}

}
