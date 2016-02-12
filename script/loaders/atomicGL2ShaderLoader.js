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
"use strict";

class atomicGL2ShaderLoader{
	constructor(){
		this.vertexShaderSRC           = "";
		this.fragmentShaderSRC         = "";
		this.attributesShaderSRC       = [];
		this.uniformsShaderSRC         = [];
		this.uniformsFragmentShaderSRC = [];
		this.sampler                   = [];
	}
	getVertex()		{return this.vertexShaderSRC;}
	getFragment()	{return this.fragmentShaderSRC;}
	getAttributes()	{return this.attributesShaderSRC;}
	getUniforms()	{return this.uniformsShaderSRC;}
	getNbTexture()	{return this.sampler.length;}
	getSampler2D()	{return this.sampler;}
}