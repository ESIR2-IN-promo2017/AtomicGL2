"use strict;"

//----------------------------------------------------------------------------------------
// atomicGL2ObjMesh extends atomicGLObject3d
//----------------------------------------------------------------------------------------

class atomicGL2ObjMesh extends atomicGLObject3d {
	// constructor
	// 		obj  :	atomicGlImporter object
	// 		uu,vv:	text coord scale
	constructor(nname, obj, uu, vv){
		// debug
		//console.log("atomicGL2ObjMesh extends atomicGLObject3d::constructor ->"+name );
		super(nname);
		// textures
		this.scaleUV  = [uu,vv] ;
		this.textures = [] ;
	
		// vertices array
		this.verticesArray = obj.vertices;
		
		// normals array
		this.normalsArray  = obj.normals ;
		
		// colors Array - set default color
		for (var i=0; i<this.normalsArray.length;i++)
			this.verticesArray.push(0.8) ;

		// texture coordinates array
    	this.textureCoordsArray = obj.uv ;
		
		// apply scaling
		var uvs = this.textureCoordsArray.length / 2 ;
		for (var i=0; i<uvs; i++)
		{
			this.textureCoordsArray[2*i] 	= uu*this.textureCoordsArray[2*i];
			this.textureCoordsArray[2*i+1] 	= vv*this.textureCoordsArray[2*i+1];
		}
			
		// indexes
    	this.vertexIndices = obj.index;	
    }
}