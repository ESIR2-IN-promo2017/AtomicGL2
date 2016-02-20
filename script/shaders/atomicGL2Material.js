// atomicGL2
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.2
// current version date: 2016/01/28
//----------------------------------------------------------------------------------------
// atomicGL2Material
//----------------------------------------------------------------------------------------
"use strict";

class atomicGL2Material{
	constructor(id,diffuse,specular,shininess,texture){
		if(id==null){
			this.id="null";
			this.diffuse=[0.0,0.0,0.0];
			this.specular=[0.0,0.0,0.0];
			this.shininess=0;
			this.texture = null;

		}else{
			this.id=id;
			this.diffuse=diffuse;
			this.specular=specular;
			this.shininess=shininess;
			this.texture = texture;		
		}
	}

	getId() {
		return this.id;
	}

	getDiffuse() {
		return this.diffuse;
	}

	getSpecular() {
		return this.specular;
	}

	getShininess() {
		return this.shininess;
	}

	getTexture() {
		return this.texture;
	}

}

