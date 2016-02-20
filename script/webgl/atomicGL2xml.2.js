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
 	constructor(agl,name){
		// attributes
		// -------------------------------------------------
		this.dom  = null ;

		// build
		// ----------------------
		// init
		this.build(agl,name);
	}

	// methods
	// --------------------------------------------------

	// loadXML
	loadXML(agl,name){
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.open("GET",name,false);
		xmlhttp.send();

		var xmlDoc = xmlhttp.responseXML;

		return xmlDoc;
	}

	// lights
	lights(agl){

		// <POINTLIGHT id="test" color="1.0,1.0,1.0" position="0.0,0.0,0.0"> </POINTLIGHT>

		if(this.dom.getElementsByTagName("POINTLIGHT").length!=0){
			var listPOINT = this.dom.getElementsByTagName("POINTLIGHT");
			for (var i=0; i<listPOINT.length; i++){

				var POINT     	= listPOINT[i];
				var id 			= POINT.getAttribute("id");
				// color
				var color 		= POINT.getAttribute("color");
				var r 			= parseFloat(color.split(",")[0]);
				var g			= parseFloat(color.split(",")[1]);
				var b			= parseFloat(color.split(",")[2]);
				// position
				var position 	= POINT.getAttribute("position");
				var px 			= parseFloat(position.split(",")[0]);
				var py 			= parseFloat(position.split(",")[1]);
				var pz 			= parseFloat(position.split(",")[2]);

				var intensity  = parseFloat(POINT.getAttribute("intensity"));

				// cast color and position to Array
				color = [r,g,b];
				position = [px,py,pz];

				// create pointlight and add it to context
				agl.pushLight(id, new atomicGL2PointLight(color,position,intensity));
			}
		}

		// <DIRECTIONNALLIGHT id="test" color="1.0,1.0,1.0" direction="1.0,0.0,0.0"> </DIRECTIONNALLIGHT>
		if(this.dom.getElementsByTagName("DIRECTIONNALLIGHT").length!=0){
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

				var intensity  = parseFloat(DIR.getAttribute("intensity"));
				
				// cast color and direction to Array
				color = [r,g,b];
				direction = [dx,dy,dz];


				// create directionnallight and add it to context
				agl.pushLight(id, new atomicGL2DirectionnalLight(color,direction,intensity));
				// debug
				//console.log("atomicGLxml::directionnallights >> find light("+i+"): "+listDIR[i].childNodes[0].data+"-id: "+id+" -color: "+color);
			}
		}

		// <SPOTLIGHT id="test" color="1.0,1.0,1.0" position="0.0,0.0,0.0" direction="1.0,0.0,0.0" radius="1.0"> </SPOTLIGHT>
		if(this.dom.getElementsByTagName("SPOTLIGHT").length!=0){
			var listSPOT = this.dom.getElementsByTagName("SPOTLIGHT");
			for (var i=0; i<listSPOT.length; i++){

				var SPOT 		= listSPOT[i];
				var id 			= SPOT.getAttribute("id");
				// color
				var color 		= SPOT.getAttribute("color");
				var r 			= parseFloat(color.split(",")[0]);
				var g			= parseFloat(color.split(",")[1]);
				var b			= parseFloat(color.split(",")[2]);
				// position
				var position 	= SPOT.getAttribute("position");
				var px 			= parseFloat(position.split(",")[0]);
				var py 			= parseFloat(position.split(",")[1]);
				var pz 			= parseFloat(position.split(",")[2]);
				// direction
				var direction 	= SPOT.getAttribute("direction");
				var dx 			= parseFloat(direction.split(",")[0]);
				var dy 			= parseFloat(direction.split(",")[1]);
				var dz 			= parseFloat(direction.split(",")[2]);

				// radius
				var radius	 	= SPOT.getAttribute("radius");

				// cast color, position and direction to Array
				color = [r,g,b];
				position = [px,py,pz]
				direction = [dx,dy,dz];

				// create spotlight and add it to context
				agl.pushLight(id, new atomicGL2SpotLight(color,position,direction,radius));
				// debug
				//console.log("atomicGLxml::spotlights >> find light("+i+"): "+listSPOT[i].childNodes[0].data+"-id: "+id+" -color: "+color);
			}
		}
	}


	// shaders
	shaders(agl){
		// examples
		//<XMATSHADER file="texDiffProg.xml">texDiffProg</XMATSHADER>
		//<IMATSHADER vertex="vertex_texDiffNormalMap" fragment="frag_texDiffNormalMap">texDiffNormalMapProg</IMATSHADER>
		var listXMSHAD = this.dom.getElementsByTagName("XMATSHADER");
		for (var i=0; i<listXMSHAD.length;i++)
		{
			var shader_name;
			var SHAD        = listXMSHAD[i] ;
			var file        = SHAD.getAttribute("file");
			//is Light process auto ?
			var lightProcess = SHAD.getAttribute("auto") === "true";

			if(lightProcess){
				file="config/AutoShadingAtomicGL2.xml";
				shader_name="AutoShadingAtomicGL2";
				agl.pushProgram(shader_name, new atomicGL2MatShader(shader_name,agl,new atomicGL2ShaderLoaderScriptXML(file),lightProcess));
				file="config/AutoShadingAtomicGL2_Textures.xml";
				shader_name="AutoShadingAtomicGL2_Textures";
				agl.pushProgram(shader_name, new atomicGL2MatShader(shader_name,agl,new atomicGL2ShaderLoaderScriptXML(file),lightProcess));
			}else{
				shader_name = SHAD.childNodes[0].data ;
			// create shader and add it to context
				agl.pushProgram(shader_name, new atomicGL2MatShader(shader_name,agl,new atomicGL2ShaderLoaderScriptXML(file),lightProcess));
			}


			// debug
			console.log("atomicGLxml::shaders >> find shader("+i+"): "+shader_name+"-file: "+file);
		}

		var listIMSHAD = this.dom.getElementsByTagName("IMATSHADER");
		for (var i=0; i<listIMSHAD.length;i++)
		{
			var SHAD        = listIMSHAD[i] ;
			var shader_name = SHAD.childNodes[0].data ;
			var vertex      = SHAD.getAttribute("vertex");
			var fragment    = SHAD.getAttribute("fragment");

			// create shader and add it to context
			agl.pushProgram(shader_name, new atomicGL2MatShader(shader_name,agl,new atomicGL2ShaderLoaderScriptInLine(vertex,fragment)));

			// debug
			console.log("atomicGLxml::shaders >> find shader("+i+"): "+shader_name+"-vertex: "+vertex+"-fragment: "+fragment);
		}
	}

	// textures
	textures(agl){
		// <TEXTURE id="test" type="color"> texture/test.png </TEXTURE>
		var listTEX = this.dom.getElementsByTagName("TEXTURE");

		for (var i=0; i<listTEX.length;i++){
			//
			var TEX       = listTEX[i] ;
			var file_name = TEX.childNodes[0].data ;
			var id        = TEX.getAttribute("id");
			var type      = TEX.getAttribute("type");

			// create texture and add it to context
			agl.textures.push(new atomicGL2Texture(id,file_name,type,agl));
			// debug
			//console.log("atomicGLxml::textures >> find texture("+i+"): "+listTEX[i].childNodes[0].data+"-id: "+id+" -type: "+type);
		}
	}

	materials(agl){
		//<MATERIAL diffuse="0.1,0.3,0.4" specular="0.7,0.2,0.0" shininess="3" >mat_noTexture</MATERIAL>
		if(this.dom.getElementsByTagName("MATERIAL").length>0) {
			var listMAT = this.dom.getElementsByTagName("MATERIAL");
			for(var i= 0 ; i < listMAT.length;++i) {
				var MAT 		= listMAT[i];
				var id 			= MAT.childNodes[0].data;
				var diffuse		= MAT.getAttribute("diffuse").split(',').map(Number); 
				var specular	= MAT.getAttribute("specular").split(',').map(Number);
				var shininess 	= parseFloat(MAT.getAttribute("shininess"));
				var textureId 	= MAT.getAttribute("texture");
				var agltid = agl.indexOfTexture(textureId);
				agl.materials.set(id,new atomicGL2Material(id,diffuse,specular,shininess,agl.textures[agltid]));	
			}
		}
	}

	// shapes
	shapes(agl){
	// <SHAPE id="shape0" type="obj">
	//   <GEOMETRY id="mesh1" uv="1.0,1.0">mesh1()</GEOMETRY>
	//   <TEXID>test</TEXID>
	//   <TEXTID>test_normal</TEXTID>
	// </SHAPE>
	var listSHAPE = this.dom.getElementsByTagName("SHAPE");
    var listSPHERE = this.dom.getElementsByTagName("SPHERE");
    var listCUBE = this.dom.getElementsByTagName("CUBE");
    var listCYLINDER = this.dom.getElementsByTagName("CYLINDER");
    var listXYPLANE = this.dom.getElementsByTagName("XYPLANE");

    // SHAPE : Object3D
    for (var i=0; i < listSHAPE.length ; i++){
			//
			var SHAPE     = listSHAPE[i];
			var SHAPEId   = SHAPE.getAttribute("id");
			var SHAPEType = SHAPE.getAttribute("type");
			// only one GEOMETRY
			var GEOMETRY  =  SHAPE.getElementsByTagName("GEOMETRY")[0];
			var GEOmesh   = GEOMETRY.childNodes[0].data ;
			var GEOId     = GEOMETRY.getAttribute("id");
			var GEOuv     = GEOMETRY.getAttribute("uv");
			var u         = parseFloat(GEOuv.split(",")[0]);
			var v         = parseFloat(GEOuv.split(",")[1]);

			/*//retrieving the material if exist
			if(SHAPE.getElementsByTagName("MATID")[0]){
				var MatID     = SHAPE.getElementsByTagName("MATID")[0].childNodes[0].data;
				console.log(MatID);
			}*/

			// create shape

			if(SHAPEType == 'js')
				var ss = new atomicGL2ObjMesh(SHAPEId, eval("new "+GEOmesh), u,v) ;
			
			else if(SHAPEType == 'obj')
			{
				var ss = new atomicGL2ObjMesh(SHAPEId, new atomicGL2Importer('objs/' + GEOmesh).obj, u,v) ;
			}
			// debug
			//console.log("atomicGLxml::shapes >> find shape("+i+"): "+SHAPEId+"-GEOMETRY:" + GEOId+ "-mesh:"+GEOmesh+"-uv:"+u+","+v);

			// textures
			var textures = SHAPE.getElementsByTagName("TEXTID");

			for (var j=0; j < textures.length ; j++)
			{
				var tid = textures[j].childNodes[0].data;

				// texture index in agl
				var agltid = agl.indexOfTexture(tid);

				if (agltid != -1)
					ss.pushTexture(agl.textures[agltid]);

				else
					alert("atomicGLxml::shapes ("+SHAPEId+") texture: "+tid+" not found !");

				// debug
				//console.log("-- texture used ("+j+"):"+tid + "- index:" + agltid);
			}

			// init shape buffer and add it to context
			ss.initGLBuffers(agl);
			agl.shapes.push(ss);
		}

    // SPHERE
    for (var i=0; i < listSPHERE.length ; i++){
		//
		var SPHERE     = listSPHERE[i];
		var SPHEREId   = SPHERE.getAttribute("id");
		var SPHEREType = SPHERE.getAttribute("type");
		// only one GEOMETRY
		var GEOMETRY  = SPHERE.getElementsByTagName("GEOMETRY")[0];
		var GEOId     = GEOMETRY.getAttribute("id");
		var GEORad    = parseFloat(GEOMETRY.getAttribute("rad"));
		var GEOLat    = parseFloat(GEOMETRY.getAttribute("lat"));
		var GEOLong   = parseFloat(GEOMETRY.getAttribute("long"));
		var GEOuv     = GEOMETRY.getAttribute("uv");
		var u         = parseFloat(GEOuv.split(",")[0]);
		var v         = parseFloat(GEOuv.split(",")[1]);

		// create shape
		var ss = new atomicGL2Sphere(SPHEREId, GEORad, GEOLat, GEOLong, u, v);
		// textures
		if(SPHERE.getElementsByTagName("TEXTID").length>0){
		var textures = SPHERE.getElementsByTagName("TEXTID");
			for (var j=0; j < textures.length ; j++)
			{
				var tid = textures[j].childNodes[0].data;
				// texture index in agl
				var agltid = agl.indexOfTexture(tid);
				if (agltid != -1)
					ss.pushTexture(agl.textures[agltid]);
				else
					alert("atomicGLxml::shapes ("+SPHEREId+") texture: "+tid+" not found !");
			}
		}else if (SPHERE.getElementsByTagName("MATID").length>0) {
			var materialId = SPHERE.getElementsByTagName("MATID")[0].childNodes[0].data;
			ss.setMaterial(agl.materials.get(materialId));
			if(agl.materials.get(materialId).getTexture()){
				ss.pushTexture(agl.materials.get(materialId).getTexture());
			}
		}
		// init shape buffer and add it to context
		ss.initGLBuffers(agl);
		agl.shapes.push(ss);
	}
	// PLANE
    for (var i=0; i < listXYPLANE.length ; i++){
			//
			var PLANE     = listXYPLANE[i];
			var PLANEId   = PLANE.getAttribute("id");
			var PLANEType = PLANE.getAttribute("type");
			// only one GEOMETRY
			var GEOMETRY  = PLANE.getElementsByTagName("GEOMETRY")[0];
			var GEOId     = GEOMETRY.getAttribute("id");
			var GEOHeight    = parseFloat(GEOMETRY.getAttribute("height"));
			var GEOWidth    = parseFloat(GEOMETRY.getAttribute("width"));
			var GEOxrow   = parseFloat(GEOMETRY.getAttribute("xrow"));
			var GEOyrow   = parseFloat(GEOMETRY.getAttribute("yrow"));
			
			var GEOuv     = GEOMETRY.getAttribute("uv");
			var u         = parseFloat(GEOuv.split(",")[0]);
			var v         = parseFloat(GEOuv.split(",")[1]);

			// create shape
			var ss = new atomicGLxyPlane(PLANEId, GEOHeight, GEOWidth, GEOxrow,GEOyrow, u, v);

			// textures
			if(PLANE.getElementsByTagName("TEXTID").length>0){
			var textures = PLANE.getElementsByTagName("TEXTID");
				for (var j=0; j < textures.length ; j++)
				{
					var tid = textures[j].childNodes[0].data;
					// texture index in agl
					var agltid = agl.indexOfTexture(tid);

					if (agltid != -1)
						ss.pushTexture(agl.textures[agltid]);

					else
						alert("atomicGLxml::shapes ("+SPHEREId+") texture: "+tid+" not found !");
				}
			}else if (PLANE.getElementsByTagName("MATID").length>0) {
				var materialId = PLANE.getElementsByTagName("MATID")[0].childNodes[0].data;
				ss.setMaterial(agl.materials.get(materialId));
				if(agl.materials.get(materialId).getTexture()){
					ss.pushTexture(agl.materials.get(materialId).getTexture());
				}

			}
			// init shape buffer and add it to context
			ss.initGLBuffers(agl);
			agl.shapes.push(ss);
		}
	}

	// traverse
	// ---------------------------
	// input
	// ---------------------------
	// e: DOM elements
	// s: parent node
	// ---------------------------
	traverse(agl,e,s){
		// current node
		var nodeName = e.nodeName ;
		var node = null;

		// console.log(s+nodeName);
		// switch nodeName
		switch (nodeName){
			case "ROOT":
				// skybox
				var skyTexId = e.getAttribute("skybox");
				var skyBox = null ;

				if ((skyTexId!="")||(skyTexId!="no"))
				{
					skyBox = new atomicGLSkyBox('skybox',parseFloat(e.getAttribute("skysize")));
					skyBox.pushTexture(agl.textures[agl.indexOfTexture(skyTexId)]);
					skyBox.initGLBuffers(agl);
				}

				// camera
				var camId = e.getAttribute("camera");
				var camera = null ;
				switch (camId)
				{
					case "walk": camera = new atomicGLWalkCamera() ;
				}

				// JS6
				node = new atomicGL2SGroot("root",e.getAttribute("id"));
				node.setRootElt(camera,skyBox,e.getAttribute("skyshader"));
				agl.scenegraph = node ;

				//  debug
				// console.log(s+e.getAttribute("id"));
			break;

			case "TRANSFORM":
				// transform
				// console.log(s+e.getAttribute("id"));

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
				// debug
				//node.toDEBUG();
			break;

			case "OBJECT3D":
				// object3D

				// id
				var id = e.getAttribute("id") ;

				// shader - ie progId
				var shaderId = e.getAttribute("shader");

				// shape
				var shapeId = e.childNodes[0].data ;

				if(shaderId==null){
					shaderId="AutoShadingAtomicGL2";
					if (agl.shapes[agl.indexOfShape(shapeId)].textures.length) {
						shaderId+='_Textures';
					}
				}

				// node
				// JS6
				node = new atomicGL2SGobject3d('object3D',id);
				node.setObject3D(agl.shapes[agl.indexOfShape(shapeId)],shaderId);
				s.addChild(node);				

				// debug
				//console.log("atomicGL2xml::traverse -> add OBJECT3D");
			break;
		}
		// children
		for (var i=0; i<e.children.length;i++)
		{
			var child = e.children[i];
			this.traverse(agl,child,node);
		}
	}

	// scenegraph
	scenegraph(agl){
		var root = this.dom.getElementsByTagName("ROOT")[0];
		this.traverse(agl,root,agl.scenegraph);
	}

	// build
	build(agl, name){
		// --------------------------------------------------
		// load XML file
		this.dom = this.loadXML(agl,name)  ;
		// find lights
		this.lights(agl);
		// find shaders
		this.shaders(agl);
		// find textures
		this.textures(agl);
		//find materials
		this.materials(agl);
		// find shapes
		this.shapes(agl);
		// scenegraph
		this.scenegraph(agl);
	}
}
