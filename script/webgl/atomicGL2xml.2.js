"use strict";

// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.1
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGLxml
//----------------------------------------------------------------------------------------
// TODO list
//----------------------------------------------------------------------------------------

class atomicGL2xml {

	// constructor
	//------------------------
 	constructor(AGL,name){
		// attributes
		// -------------------------------------------------
		this.dom  = null ;
		// build
		// ----------------------
		// init
		this.build(AGL,name);
	}

	// methods
	// --------------------------------------------------

	// loadXML
	loadXML(AGL,name){
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.open("GET",name,false);
		xmlhttp.send();

		var xmlDoc = xmlhttp.responseXML;

		return xmlDoc;
	}

	// lights
	lights(AGL){
		// <POINTLIGHT id="test" color="1.0,1.0,1.0" position="0.0,0.0,0.0"> </POINTLIGHT>
		var listPOINT = this.dom.getElementsByTagName("POINTLIGHT");

		for (var i=0; i<listPOINT.length; i++){

			var POINT     	= listPOINT[i];
			var id 			= POINT.getAttribute("id");
			// color
			var color 		= POINT.getAttribute("color");
			var r 			= parseFloat(color.split(",")[0]);
			var g			= parseFloat(color.split(",")[1]);
			var b			= parseFloat(color.split(",")[2]);

            var position 	= POINT.getAttribute("position");
			var x 			= parseFloat(position.split(",")[0]);
			var y			= parseFloat(position.split(",")[1]);
			var z			= parseFloat(position.split(",")[2]);

			var intensity   = POINT.getAttribute("intensity");
            var ix          = parseFloat(intensity.split(",")[0]);
            var iy          = parseFloat(intensity.split(",")[1]);
            var iz          = parseFloat(intensity.split(",")[2]);

			// cast color and position to Array
			color = [r,g,b];
            position = [x,y,z];
            intensity = [ix, iy, iz];

			// create pointlight and add it to context
			AGL.pushLight(id, new atomicGL2PointLight(color,position,intensity));
		}

		// <DIRECTIONNALLIGHT id="test" color="1.0,1.0,1.0" direction="1.0,0.0,0.0"> </DIRECTIONNALLIGHT>
		var listDIR = this.dom.getElementsByTagName("DIRECTIONNALLIGHT");

		for (var i=0; i<listDIR.length; i++){

			var DIR 		= listDIR[i];
			var id 			= DIR.getAttribute("id");
			// color
			var color 		= DIR.getAttribute("color");
			var r 			= parseFloat(color.split(",")[0]);
			var g			= parseFloat(color.split(",")[1]);
			var b			= parseFloat(color.split(",")[2]);
			// direction
			var direction 	= DIR.getAttribute("direction");
			var dx 			= parseFloat(direction.split(",")[0]);
			var dy 			= parseFloat(direction.split(",")[1]);
			var dz 			= parseFloat(direction.split(",")[2]);

            var intensity   = DIR.getAttribute("intensity");
            var ix          = parseFloat(intensity.split(",")[0]);
            var iy          = parseFloat(intensity.split(",")[1]);
            var iz          = parseFloat(intensity.split(",")[2]);

			// cast color and direction to Array
			color = [r,g,b];
			direction = [dx,dy,dz];
            intensity = [ix, iy, iz];

			// create directionnallight and add it to context
			AGL.pushLight(id, new atomicGL2DirectionnalLight(color,direction,intensity));
			// debug
			//console.log("atomicGLxml::directionnallights >> find light("+i+"): "+listDIR[i].childNodes[0].data+"-id: "+id+" -color: "+color);
		}

		// <SPOTLIGHT id="test" color="1.0,1.0,1.0" position="0.0,0.0,0.0" direction="1.0,0.0,0.0" radius="1.0"> </SPOTLIGHT>
		var listSPOT = this.dom.getElementsByTagName("SPOTLIGHT");

		for (var i=0; i<listSPOT.length; i++){

			var SPOT 		= listSPOT[i];
			var id 			= SPOT.getAttribute("id");
			// color
			var color 		= SPOT.getAttribute("color");
			var r 			= parseFloat(color.split(",")[0]);
			var g			= parseFloat(color.split(",")[1]);
			var b			= parseFloat(color.split(",")[2]);
			// direction
			var direction 	= SPOT.getAttribute("direction");
			var dx 			= parseFloat(direction.split(",")[0]);
			var dy 			= parseFloat(direction.split(",")[1]);
			var dz 			= parseFloat(direction.split(",")[2]);

            //position
            var position 	= SPOT.getAttribute("position");
			var x 			= parseFloat(position.split(",")[0]);
			var y			= parseFloat(position.split(",")[1]);
			var z			= parseFloat(position.split(",")[2]);

			// radius
			var radius	 	= SPOT.getAttribute("radius");

            // intensity
            var intensity   = SPOT.getAttribute("intensity");
            var ix          = parseFloat(intensity.split(",")[0]);
            var iy          = parseFloat(intensity.split(",")[1]);
            var iz          = parseFloat(intensity.split(",")[2]);

			// cast color, position and direction to Array
			color = [r,g,b];
            position = [x,y,z];
			direction = [dx,dy,dz];
            intensity = [ix, iy, iz];

			// create spotlight and add it to context
			AGL.pushLight(id, new atomicGL2SpotLight(color,position,direction,radius,intensity));
			// debug
			//console.log("atomicGLxml::spotlights >> find light("+i+"): "+listSPOT[i].childNodes[0].data+"-id: "+id+" -color: "+color);
		}
	}


	// shaders
	shaders(AGL){
		// examples
		//<XMATSHADER file="texDiffProg.xml">texDiffProg</XMATSHADER>
		//<IMATSHADER vertex="vertex_texDiffNormalMap" fragment="frag_texDiffNormalMap">texDiffNormalMapProg</IMATSHADER>
		var listXMSHAD = this.dom.getElementsByTagName("XMATSHADER");
		for (var i=0; i<listXMSHAD.length;i++)
		{
			var SHAD        = listXMSHAD[i] ;
			var file        = SHAD.childNodes[0].data ;
			var id          = SHAD.getAttribute("id");

			// create shader and add it to context
			AGL.pushProgram(id, new atomicGL2MatShader(AGL,new atomicGL2ShaderLoaderScriptXML(file)));

			// debug
			console.log("atomicGLxml::shaders >> find shader("+i+"): "+id+" -file: "+file);
		}

		var listIMSHAD = this.dom.getElementsByTagName("IMATSHADER");
		for (var i=0; i<listIMSHAD.length;i++)
		{
			var SHAD        = listIMSHAD[i] ;
			var shader_name = SHAD.childNodes[0].data ;
			var vertex      = SHAD.getAttribute("vertex");
			var fragment    = SHAD.getAttribute("fragment");

			// create shader and add it to context
			AGL.pushProgram(shader_name, new atomicGL2MatShader(AGL,new atomicGL2ShaderLoaderScriptInLine(vertex,fragment)));

			// debug
			console.log("atomicGLxml::shaders >> find shader("+i+"): "+shader_name+"-vertex: "+vertex+"-fragment: "+fragment);
		}
	}

	// textures
	textures(AGL){
		// <TEXTURE id="test" type="color"> texture/test.png </TEXTURE>
		var listTEX = this.dom.getElementsByTagName("TEXTURE");

		for (var i=0; i<listTEX.length;i++){
			//
			var TEX       = listTEX[i] ;
			var file_name = TEX.childNodes[0].data ;
			var id        = TEX.getAttribute("id");
			var type      = TEX.getAttribute("type");

			// create texture and add it to context
			AGL.textures.push(new atomicGL2Texture(id,file_name,type,AGL));
			// debug
			//console.log("atomicGLxml::textures >> find texture("+i+"): "+listTEX[i].childNodes[0].data+"-id: "+id+" -type: "+type);
		}
	}

	// shapes
	shapes(AGL){
		var listSHAPE = this.dom.getElementsByTagName("SHAPE");
	    var listSPHERE = this.dom.getElementsByTagName("SPHERE");
	    var listCUBE = this.dom.getElementsByTagName("CUBE");
	    var listCYLINDER = this.dom.getElementsByTagName("CYLINDER");
	    var listXYPLANE = this.dom.getElementsByTagName("XYPLANE");

	    for (var i=0; i < listSHAPE.length ; i++){
	    	// SHAPE : Object3D
			var SHAPE     = listSHAPE[i];
			var SHAPEId   = SHAPE.getAttribute("id");
			var SHAPEType = SHAPE.getAttribute("type");
			
			try{
	            var SHAPETex  = SHAPE.getAttribute("tex").split(",");
	            var SHAPEuv   = SHAPE.getAttribute("uv").split(",");
	            var u         = parseFloat(SHAPEuv[0]);
	            var v         = parseFloat(SHAPEuv[1]);
			}

			catch(e){
				alert("atomicGLxml::shapes ("+SHAPEId+") texture parameters not found!");
				continue;
			}

            var SHAPEMesh = SHAPE.childNodes[0].data ;

			// create shape
			if(SHAPEType == 'js')
				var ss = new atomicGL2ObjMesh(SHAPEId, eval("new "+SHAPEMesh), u, v) ;
			else if(SHAPEType == 'obj')
				var ss = new atomicGL2ObjMesh(SHAPEId, new atomicGL2Importer('objs/' + SHAPEMesh).obj, u, v) ;

            // load textures
			for (var j=0; j < SHAPETex.length ; j++)
			{
				var texId = SHAPETex[j];

				// texture index in agl
				var aglTexId = AGL.indexOfTexture(texId);

				if (aglTexId != -1)
					ss.pushTexture(AGL.textures[aglTexId]);
				else
					alert("atomicGLxml::shapes ("+SHAPEId+") texture: "+texId+" not found !");

				// debug
				//console.log("-- texture used ("+j+"):"+tid + "- index:" + AGLtid);
			}

			// init shape buffer and add it to context
			ss.initGLBuffers(AGL);
			AGL.shapes.push(ss);
		}

	    // SPHERE
	    for (var i=0; i < listSPHERE.length ; i++){
			var SPHERE     = listSPHERE[i];
			var SPHEREId   = SPHERE.getAttribute("id");
			var SPHERERad  = parseFloat(SPHERE.getAttribute("rad"));
			var SPHERELat  = parseFloat(SPHERE.getAttribute("lat"));
			var SPHERELong = parseFloat(SPHERE.getAttribute("long"));

			try{
	            var SPHERETex  = SPHERE.getAttribute("tex").split(",");
	            var SPHEREuv   = SPHERE.getAttribute("uv").split(",");
	            var u          = parseFloat(SPHEREuv[0]);
	            var v          = parseFloat(SPHEREuv[1]);	

	            var colorParameters = "texture";			
			}

			catch(e){
				try{
		            var SPHEREcolor	= SPHERE.getAttribute("color").split(",");
		            var r 			= parseFloat(SPHEREcolor[0]);
		            var g 			= parseFloat(SPHEREcolor[1]);
		            var b 			= parseFloat(SPHEREcolor[2]);

		            var rgb 		= [r,g,b];
		            var colorParameters = "color";					
				}

				catch(e){
					alert("/!\\ atomicGLxml::sphere ("+SPHEREId+") texture parameters not found! /!\\");
					continue;
				}
			}

			// create shape
			var ss = new atomicGL2Sphere(SPHEREId, SPHERERad, SPHERELat, SPHERELong, u, v);

			if(colorParameters == "texture")
			{
				// textures
				for (var j=0; j < SPHERETex.length ; j++)
				{
					var tid = SPHERETex[j];

					// texture index in AGL
					var AGLtid = AGL.indexOfTexture(tid);

					if (AGLtid != -1)
						ss.pushTexture(AGL.textures[AGLtid]);

					else
						alert("atomicGLxml::shapes ("+SPHEREId+") texture: "+tid+" not found !");
				}
			}

			else if(colorParameters == "color")
				ss.setFaceColor("All",rgb);

			// init shape buffer and add it to context
			ss.initGLBuffers(AGL);
			AGL.shapes.push(ss);
		}

		// CUBE
	    for (var i=0; i < listCUBE.length ; i++){
			var CUBE 		= listCUBE[i];
			var CUBEId   	= CUBE.getAttribute("id");
			var CUBEHeight  = parseFloat(CUBE.getAttribute("height"));
			var CUBEWidth 	= parseFloat(CUBE.getAttribute("width"));
			var CUBEDepth   = parseFloat(CUBE.getAttribute("depth"));

			try{
	            var CUBETex     = CUBE.getAttribute("tex").split(",");
	            var CUBEuv     	= CUBE.getAttribute("uv").split(",");
				var u         	= parseFloat(CUBEuv[0]);
				var v         	= parseFloat(CUBEuv[1]);

				var colorParameters = "texture";
			}

			catch(e){
				try{
		            var CUBEcolor 	= CUBE.getAttribute("color").split(",");
		            var r 			= parseFloat(CUBEcolor[0]);
		            var g 			= parseFloat(CUBEcolor[1]);
		            var b 			= parseFloat(CUBEcolor[2]);

		            var rgb 		= [r,g,b];
		            var colorParameters = "color";
				}

				catch(e){
					alert("/!\\ atomicGLxml::sphere ("+CUBEId+") texture parameters not found! /!\\");
					continue;
				}
			}


			// create shape
			var ss = new atomicGL2Cube(CUBEId, CUBEHeight, CUBEWidth, CUBEDepth, u, v);

			if(colorParameters == "texture")
			{
				// textures
				for (var j=0; j < CUBETex.length ; j++)
				{
					var tid = CUBETex[j];

					// texture index in AGL
					var AGLtid = AGL.indexOfTexture(tid);

					if (AGLtid != -1)
						ss.pushTexture(AGL.textures[AGLtid]);

					else
						alert("atomicGLxml::shapes ("+CUBEId+") texture: "+tid+" not found !");
				}
			}

			else if(colorParameters == "color")
				ss.setFaceColor("All",rgb);

			// init shape buffer and add it to context
			ss.initGLBuffers(AGL);
			AGL.shapes.push(ss);
		}

	    // CYLINDER
	    for (var i=0; i < listCYLINDER.length ; i++){
			var CYLINDER     	= listCYLINDER[i];
			var CYLINDERId   	= CYLINDER.getAttribute("id");
			var CYLINDERRad  	= parseFloat(CYLINDER.getAttribute("rad"));
			var CYLINDERHeight 	= parseFloat(CYLINDER.getAttribute("height"));
			var CYLINDERLat   	= parseFloat(CYLINDER.getAttribute("lat"));
			var CYLINDERLong   	= parseFloat(CYLINDER.getAttribute("long"));

			try{
	            var CYLINDERTex     = CYLINDER.getAttribute("tex").split(",");
	            var CYLINDERuv     	= CYLINDER.getAttribute("uv").split(",");
				var u         	    = parseFloat(CYLINDERuv[0]);
				var v         	    = parseFloat(CYLINDERuv[1]);

				colorParameters = "texture";
			}

			catch(e){
				try{
					var CYLINDERcolor   = CYLINDER.getAttribute("color").split(",");
					var r               = parseFloat(CYLINDERcolor[0]);
					var g               = parseFloat(CYLINDERcolor[1]);
					var b               = parseFloat(CYLINDERcolor[2]);
					
					var rgb             = [r,g,b];
					var colorParameters = "color";					
				}

				catch(e){
					alert("/!\\ atomicGLxml::sphere ("+CYLINDERId+") texture parameters not found! /!\\");
					continue;
				}
			}

			// create shape
			var ss = new atomicGL2Cylinder(CYLINDERId, CYLINDERRad, CYLINDERHeight, CYLINDERLat, CYLINDERLong, u, v);

			if(colorParameters == "texture")
			{
				// textures
				for (var j=0; j < CYLINDERTex.length ; j++)
				{
					var tid = CYLINDERTex[j];

					// texture index in AGL
					var AGLtid = AGL.indexOfTexture(tid);

					if (AGLtid != -1)
						ss.pushTexture(AGL.textures[AGLtid]);

					else
						alert("atomicGLxml::shapes ("+CYLINDERId+") texture: "+tid+" not found !");
				}
			}

			else if(colorParameters == "color")
				ss.setFaceColor("All",rgb);

			// init shape buffer and add it to context
			ss.initGLBuffers(AGL);
			AGL.shapes.push(ss);
		}

	    // XYPLANE
	    for (var i=0; i < listXYPLANE.length ; i++){
			var XYPLANE       = listXYPLANE[i];
			var XYPLANEId     = XYPLANE.getAttribute("id");
			var XYPLANEHeight = parseFloat(XYPLANE.getAttribute("height"));
			var XYPLANEWidth  = parseFloat(XYPLANE.getAttribute("width"));
			var XYPLANEXRow   = parseFloat(XYPLANE.getAttribute("xrow"));
			var XYPLANEYRow   = parseFloat(XYPLANE.getAttribute("yrow"));

			try{
				var XYPLANETex    = XYPLANE.getAttribute("tex").split(",");
				var XYPLANEuv     = XYPLANE.getAttribute("uv");
				var u             = parseFloat(XYPLANEuv.split(",")[0]);
				var v             = parseFloat(XYPLANEuv.split(",")[1]);
			
				colorParameters = "texture";
			}

			catch(e){
				try{
					var XYPLANEcolor   = XYPLANE.getAttribute("color").split(",");
					var r               = parseFloat(XYPLANEcolor[0]);
					var g               = parseFloat(XYPLANEcolor[1]);
					var b               = parseFloat(XYPLANEcolor[2]);
					
					var rgb             = [r,g,b];
					var colorParameters = "color";	
				}

				catch(e){
					alert("/!\\ atomicGLxml::sphere ("+XYPLANEId+") texture parameters not found! /!\\");
					continue;
				}
			}
			// create shape
			var ss = new atomicGL2xyPlane(XYPLANEId, XYPLANEHeight, XYPLANEWidth, XYPLANEXRow, XYPLANEYRow, u, v);

			if(colorParameters == "texture")
			{
				// textures
				for (var j=0; j < XYPLANETex.length ; j++)
				{
					var tid = XYPLANETex[j];

					// texture index in AGL
					var AGLtid = AGL.indexOfTexture(tid);

					if (AGLtid != -1)
						ss.pushTexture(AGL.textures[AGLtid]);

					else
						alert("atomicGLxml::shapes ("+XYPLANEId+") texture: "+tid+" not found !");
				}
			}

			else if(colorParameters == "color")
				ss.setFaceColor("All",rgb);

			// init shape buffer and add it to context
			ss.initGLBuffers(AGL);
			AGL.shapes.push(ss);
	    }
	}

	// traverse
	// ---------------------------
	// input
	// ---------------------------
	// e: DOM elements
	// s: parent node
	// ---------------------------
	traverse(AGL,e,s){
		// current node
		var nodeName = e.nodeName ;
		var node = null;

		// switch nodeName
		switch (nodeName){
			case "ROOT":
				// skybox
				var skyTexId = e.getAttribute("skybox");
				var skyBox = null ;

				if ((skyTexId!="")||(skyTexId!="no"))
				{
					skyBox = new atomicGLSkyBox('skybox',parseFloat(e.getAttribute("skysize")));
					skyBox.pushTexture(AGL.textures[AGL.indexOfTexture(skyTexId)]);
					skyBox.initGLBuffers(AGL);
				}

				// camera
				var camId = e.getAttribute("camera");
				var camera = null ;
				switch (camId)
				{
					case "walk": camera = new atomicGLWalkCamera(AGL.shapes[AGL.indexOfShape(e.getAttribute("navmesh"))]) ;
				}

				// JS6
				node = new atomicGL2SGroot("root",e.getAttribute("id"));
				node.setRootElt(camera,skyBox,e.getAttribute("skyshader"));
				AGL.scenegraph = node ;

				//  debug
			break;

			case "TRANSFORM":
				// transform

				// id
				var id = e.getAttribute("id");

				// translate
				var transS = e.getAttribute("translate").split(",");
				var tx = parseFloat(transS[0]);
				var ty = parseFloat(transS[1]);
				var tz = parseFloat(transS[2]);

				// rotaxis
				var rotAxisS = e.getAttribute("rotaxis").split(",");
				var ax = parseFloat(rotAxisS[0]);
				var ay = parseFloat(rotAxisS[1]);
				var az = parseFloat(rotAxisS[2]);

				// angle
				var theta = parseFloat(e.getAttribute("angle"));

				// node
				// JS6
				node = new atomicGL2SGtransform("transform",id);
				node.setTransform([tx,ty,tz],[ax,ay,az],theta);
				s.addChild(node);
			break;

			case "OBJECT3D":
				// object3D

				// id
				var id = e.getAttribute("id") ;

				// shader - ie progId
				var shaderId = e.getAttribute("shader");

				// shape
				var shapeId = e.childNodes[0].data ;

				// node
				// JS6
				node = new atomicGL2SGobject3d(id);
				node.setObject3D(AGL.shapes[AGL.indexOfShape(shapeId)],shaderId);
				s.addChild(node);
			break;

			case "LIGHT":
				var id = e.getAttribute("id");
                var lightId = e.childNodes[0].data ;

                node = new atomicGL2SGLight(id);
				node.setLight(AGL.getLight(lightId));
				s.addChild(node);
			break;
		}
		// children
		for (var i=0; i<e.children.length;i++)
		{
			var child = e.children[i];
			this.traverse(AGL,child,node);
		}
	}

	// scenegraph
	scenegraph(AGL){
		var root = this.dom.getElementsByTagName("ROOT")[0];
		this.traverse(AGL,root,AGL.scenegraph);
	}

	// build
	build(AGL, name){
		// --------------------------------------------------
		// load XML file
		this.dom = this.loadXML(AGL,name)  ;
		// find lights
		this.lights(AGL);
		// find shaders
		this.shaders(AGL);
		// find textures
		this.textures(AGL);
		// find shapes
		this.shapes(AGL);
		// scenegraph
		this.scenegraph(AGL);
	}
}
