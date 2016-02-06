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
	this.importObj(this.file);


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
	obj.verticesArray = [];
	// normals array
	obj.normalsArray  = [] ;
	



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
			obj.verticesArray.push(lineSplit[1]);
			obj.verticesArray.push(lineSplit[2]);
			obj.verticesArray.push(lineSplit[3]);
			}
			else if(lineSplit[0] =="vt"){

			}
			else if(lineSplit[0] =="vn"){

			}
			else if(lineSplit[0] =="f"){
	
			}





	};



}



}