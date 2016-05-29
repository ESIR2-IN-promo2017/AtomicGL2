"use strict";

//----------------------------------------------------------------------------------------
// atomicGL2SGobject3d extends atomicGL2SceneGraph
//----------------------------------------------------------------------------------------
class atomicGL2SGrttNode extends atomicGL2SceneGraph {
	constructor(name,camera,shape,shaderId){
		super("rttNode", name);
		this.camera = camera;
		this.object3D = shape;
		this.shaderId = shaderId;
	}

	// draw
	// -------------------------
	// inputs: 	AGL - atomicGLContext
	//			AMS - atomicGLMatrixStack
	draw (AGL,AMS){
		//Change buffer
		AGL.gl.bindFramebuffer(AGL.gl.FRAMEBUFFER, AGL.rttFramebuffer);
		AGL.gl.framebufferTexture2D(AGL.gl.FRAMEBUFFER, AGL.gl.COLOR_ATTACHMENT0, AGL.gl.TEXTURE_2D, AGL.rttTexture, 0);
		
		AGL.gl.clear(AGL.gl.COLOR_BUFFER_BIT);
		AGL.gl.clearColor(1.0, 1.0, 1.0, 1.0);	

		var rttAMS = new atomicGL2MatrixStack();
		mat4.perspective(45, 1.0, 0.1, 1000.0, rttAMS.pMatrix);
		mat4.identity(rttAMS.mvMatrix);
		rttAMS.mvRotate(this.camera.phi,[1,0,0]);
		rttAMS.mvRotate(this.camera.theta,[0,1,0]);
		rttAMS.mvTranslate(-this.camera.xc,-this.camera.yc,-this.camera.zc);

		// initDraw
		AGL.initDraw();

		// push matrix
		rttAMS.mvPushMatrix();
			// children
			for (var i=0; i<this.children.length; i++)
				this.children[i].draw(AGL,rttAMS);
		rttAMS.mvPopMatrix();


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
