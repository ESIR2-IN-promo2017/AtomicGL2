"use strict;"

class atomicGL2ShaderLoaderScriptXML extends atomicGL2ShaderLoader {
	constructor(xmlfile){
		super();
		this.vertexShaderSRC     = this.getShaderSRC(xmlfile,"vertex") ;
		this.fragmentShaderSRC   = this.getShaderSRC(xmlfile,"fragment") ;
		this.attributesShaderSRC = this.Xplode(this.getShaderSRC(xmlfile,"attributes"),"attribute");
		this.uniformsShaderSRC   = this.Xplode(this.getShaderSRC(xmlfile,"uniforms"),"uniform");

		console.log(this.getUniforms());
	}

	/*------------------------------------------

	param type : the type request it would be "attribute" or "uniform"

	return : an array with all the identifiers of the type

	this funciton instanciate also the number of texture and light
	------------------------------------------------*/
	Xplode(str,type){
		let array = [];
		var line  = str.split("\n");
		
		for (var i = 0; i < line.length; i++) 
		{
			let elem = [];
			var res  = line[i].split(" ");
			
			if (typeof res !== 'undefined' && res.length > 0) 
			{
				if(res[0].indexOf('//') > -1 )
					continue;

				if(res[0].indexOf('\t')>-1)
				{
					res[0] = res[0].split('\t');
					for (var y = 0; y < res[0].length; y++) 
					{
						if(res[0][y] == type){
							res[0] = res[0][y];
							break;
						}
					};
				}
			}
			//deleting the empty element in the array
			for(var j = res.length - 1; j >= 0; j--) 
			{
			    for (var k = res[j].length- 1; k >= 0; k--) 
			    	if(res[j][k] == '') 
			     		res[j].splice(j, 1);
			    
   		    	if(res[j] == '')
			    	 res.splice(j, 1);
			}

			if (typeof res !== 'undefined' && res.length > 0) 
			{
				for (var y = 0; y < res[0].length; y++)
				{
					if(res[0][y] == type)
					{
						res[0]=res[0][y];
						break;
					}
				}

				for (var y = 0; y < res[0].length; y++) 
				{
					if(res[0].charAt(y) == '\t' || res[0].charAt(y) == ' ')
  						res[0]= res[0].substr(1);
				}
			}

			//retrieving the name of the variable
			if(res[2] != null && res[0]==type)
			{
				if(res[2].indexOf(';') > -1)
					res[2]= res[2].slice(0, -1);

				//if it is a texture we save the sampler2D in sampler Array
				if (res[1] == "sampler2D")
					this.sampler.push(res[2]);

				else 
				{
					elem.push(res[1], res[2]);
					array.push(elem);
				}
			}
		}

		return array;
	}

	// getShaderSRC
	// -------------------------
	// get shader source
	getShaderSRC(xmlfile,type) {
		// loadXMLfile
		var xmlhttp=new XMLHttpRequest();
		xmlhttp.open("GET",xmlfile,false);
		xmlhttp.send();
		var xmlDoc=xmlhttp.responseXML;
		var str = "" ;

		switch (type){
			case "vertex" :
				var xvertex     = xmlDoc.getElementsByTagName("VERTEX");
				var xattributes = xmlDoc.getElementsByTagName("ATTRIBUTES");
				var xuniforms   = xmlDoc.getElementsByTagName("UNIFORMS");
				var xvarying    = xmlDoc.getElementsByTagName("VARYING");
				var xoutput     = xmlDoc.getElementsByTagName("OUTPUT");

				str = xvertex[0].childNodes[0].data   + xattributes[0].childNodes[0].data
					+ xuniforms[0].childNodes[0].data + xvarying[0].childNodes[0].data
					+ xoutput[0].childNodes[0].data ;
			break ;

			case "fragment" :
				var xfragment   = xmlDoc.getElementsByTagName("FRAGMENT");
				var xprecision  = xmlDoc.getElementsByTagName("PRECISION");
				var xuniforms   = xmlDoc.getElementsByTagName("UNIFORMS");
				var xvarying    = xmlDoc.getElementsByTagName("VARYING");
				var xoutput     = xmlDoc.getElementsByTagName("OUTPUT");

				str = xfragment[0].childNodes[0].data + xprecision[0].childNodes[0].data
					+ xuniforms[1].childNodes[0].data + xvarying[1].childNodes[0].data
					+ xoutput[1].childNodes[0].data ;
			break ;

			case "attributes" :
				var xattributes = xmlDoc.getElementsByTagName("ATTRIBUTES");
				str = xattributes[0].childNodes[0].data ;
			break ;

			case "uniforms" :
				var xuniforms = xmlDoc.getElementsByTagName("UNIFORMS");
				str = xuniforms[0].childNodes[0].data ;

				var xuniforms = xmlDoc.getElementsByTagName("UNIFORMS");
				str += xuniforms[1].childNodes[0].data ;
			break ;
		}
		// debug
		// ----------------------
		//console.log("atomicGL2::"+"atomicGL2ShaderLoaderScriptXML::"+"getShaderSRC"+"shader source->"+ str);
		return str;
	}
}