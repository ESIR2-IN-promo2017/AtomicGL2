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
		this.AGL = aAGL ;
		// texture id
		this.id = iid ;
		// file name
		this.file = ffile ;
		// texture type
		this.type = ttype ;
		// texture image
		this.textureImage = new Image();
		// ogl texture
    this.texture = aAGL.gl.createTexture();
    this.texture.image =   this.textureImage ;

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
		var o = this ;
		// debug
		//console.log("atomicGLTexture::onload("+o.file+")");

    o.AGL.gl.pixelStorei(o.AGL.gl.UNPACK_FLIP_Y_WEBGL, true);
		// bindTexture
    o.AGL.gl.bindTexture(o.AGL.gl.TEXTURE_2D, o.texture);
    o.AGL.gl.texImage2D(o.AGL.gl.TEXTURE_2D, 0, o.AGL.gl.RGBA, o.AGL.gl.RGBA, o.AGL.gl.UNSIGNED_BYTE, o.texture.image);
    // parameters
		o.AGL.gl.texParameteri(o.AGL.gl.TEXTURE_2D, o.AGL.gl.TEXTURE_MAG_FILTER, o.AGL.gl.LINEAR);
    o.AGL.gl.texParameteri(o.AGL.gl.TEXTURE_2D, o.AGL.gl.TEXTURE_MIN_FILTER, o.AGL.gl.LINEAR_MIPMAP_NEAREST);
    o.AGL.gl.generateMipmap(o.AGL.gl.TEXTURE_2D);
		// unbind
    o.AGL.gl.bindTexture(AGL.gl.TEXTURE_2D, null);
		// loaded !
		o.loaded = true ;
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
