"use strict";

//----------------------------------------------------------------------------------------
// atomicGL2SGobject3d extends atomicGL2SceneGraph
//----------------------------------------------------------------------------------------
class atomicGL2SGrttNode extends atomicGL2SceneGraph {
	constructor(name){
		super("rttNode", name);
		// attributes
		// type = object3D - object3D & shaderId
		this.object3D = null;
		//this.shaderId = -1;
		this.shaderId = ""; // also used for skybox
		// debug
		//console.log("atomicGL2SGobject3d extends atomicGL2SceneGraph::constructor ->"+this.type+" - "+this.name);

	}
	// setObject3D
	// -------------------------
	// inputs: 	o - atomicGLObj
	//			sid - shader id
	setObject3D (o,sid){
		// debug
		//console.log("atomicGL2SGobject3d extends atomicGL2SceneGraph::setObject3D ->"+this.type+" - "+this.name);

		this.object3D = o;
		this.shaderId = sid;
	}

	// draw
	// -------------------------
	// inputs: 	AGL - atomicGLContext
	//			AMS - atomicGLMatrixStack
	draw (AGL,AMS){
		// debug
		//console.log("atomicGL2SGobject3d extends atomicGL2SceneGraph::draw ->"+this.type+" - "+this.name);
	
        //Change buffer
		AGL.gl.bindFramebuffer(AGL.gl.FRAMEBUFFER, AGL.rttFramebuffer);
		AGL.gl.framebufferTexture2D(AGL.gl.FRAMEBUFFER, AGL.gl.COLOR_ATTACHMENT0, AGL.gl.TEXTURE_2D, AGL.rttTexture, 0);
		
		AGL.gl.clear(AGL.gl.COLOR_BUFFER_BIT);
		AGL.gl.clearColor(1.0, 1.0, 1.0, 1.0);	

		var rttAMS = new atomicGL2MatrixStack();
  		mat4.perspective(45, 1.0, 0.1, 1000.0, rttAMS.pMatrix);
  		mat4.identity(rttAMS.mvMatrix);

		// children
		for (var i=0; i<this.children.length; i++)
			this.children[i].draw(AGL,rttAMS);

		// //Texture creation
		AGL.gl.bindTexture(AGL.gl.TEXTURE_2D, AGL.rttTexture);
		AGL.gl.generateMipmap(AGL.gl.TEXTURE_2D);
		AGL.gl.bindTexture(AGL.gl.TEXTURE_2D, null);

		AGL.gl.bindFramebuffer(AGL.gl.FRAMEBUFFER, null);
		AGL.gl.clearColor(AGL.backgroundColor[0], AGL.backgroundColor[1], AGL.backgroundColor[2], 1.0);
		AGL.gl.clear(AGL.gl.COLOR_BUFFER_BIT);

		// Why this thing doesn't work? =='
		// this.object3D.textures[0] = AGL.rttTexture;
		AGL.gl.bindBuffer(AGL.gl.ARRAY_BUFFER, this.object3D.vertexTexCoordBuffer);
		AGL.gl.vertexAttribPointer(AGL.getShaderProgram(this.shaderId).getTextureCoord(), this.object3D.vertexTexCoordBufferItemSize, AGL.gl.FLOAT, false, 0, 0);		
		AGL.gl.activeTexture(AGL.GLtexture[0]);
		AGL.gl.bindTexture(AGL.gl.TEXTURE_2D, AGL.rttTexture);
		AGL.gl.uniform1i(AGL.getShaderProgram(this.shaderId).samplerUniform[0], 0);
		this.object3D.draw(AGL,AMS,this.shaderId);
	}
}
