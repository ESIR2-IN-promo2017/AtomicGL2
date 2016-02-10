"use strict";

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