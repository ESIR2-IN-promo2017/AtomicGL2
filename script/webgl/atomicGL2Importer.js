// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 2.3
// current version date: 2016/01/26
//----------------------------------------------------------------------------------------
// atomicGL2Importer
//----------------------------------------------------------------------------------------


/*
This Class will import different type of Mesh
	1° : .Obj
	2° : .fbx (I hope)
	3° : we will see
*/

"use strict";

class atomicGL2Importer  {
	constructor(agl,path){

	this.file = this.readTextFile(path);
	this.obj = this.importObj(this.file);
	this.obj3d = this.build(this.obj);

	this.obj3d.initGLBuffers(agl);
	agl.shapes.push(this.obj3d);
	}

 readTextFile(file){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    var allText = "Loading failed";
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}

importObj(fileText){

	//the object3D
	var obj = [];

	obj.name ='';
	// vertices array
	obj.vertices = [];
	// normals array
	obj.normals  = [] ;
	// indexes array
	obj.vertexIndices = [];

	obj.uv = [];

	obj.index = 3 ;

	var textSplit = fileText.split('\n');
	for (var i = 0; i < textSplit.length; i++) {
		var line = textSplit[i];
		var lineSplit = line.split(' ');
			if(lineSplit[0] == '#')
				continue;

			if(lineSplit[0] == 'g'){
				obj.name =  lineSplit[lineSplit.length-1];
				console.log(obj.name);
			}
			// if it is a vertex
			else if(lineSplit[0] =="v"){
				obj.vertices.push(lineSplit[1]);
				obj.vertices.push(lineSplit[2]);
				obj.vertices.push(lineSplit[3]);
			}
			// if it is a normal
			else if(lineSplit[0] =="vn"){
				obj.normals.push(lineSplit[1]);
				obj.normals.push(lineSplit[2]);
				obj.normals.push(lineSplit[3]);
			}
			// if it is a texture coord
			else if(lineSplit[0] =="vt"){

			}
			else if(lineSplit[0] =="f"){
				obj.vertexIndices.push(lineSplit[1]);
				obj.vertexIndices.push(lineSplit[2]);
				obj.vertexIndices.push(lineSplit[3]);
			}
	};

	return obj;

}


build(obj){
	return new atomicGL2ObjMesh(obj.name,obj,1.0,1.0);
}


}