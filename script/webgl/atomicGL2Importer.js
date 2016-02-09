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
  constructor(path){

  this.file = this.readTextFile(path);
  this.obj = this.importObj(this.file);

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
  //texture coordinates
  obj.uv = [];
  //obj index
  obj.index = 0;


 var  objTmp = {};
    objTmp.normals = [];
    objTmp.textures = [];
    objTmp.hashindices = {};
    objTmp.indices = [];
    // array of lines separated by the newline
    var lines = fileText.split('\n');

    var WHITESPACE_RE = /\s+/;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      var elements = line.split(WHITESPACE_RE);
      var firstChar = elements.shift();


      //Vérifier que le group vertex est inéxistant avant de créer les élements

      if(firstChar == '#'){
        continue;
      } else if (firstChar == 'g' ||firstChar == 'o') {
        obj.name = elements;
      }else if (firstChar == 'v') {
        // if this is a vertex

        obj.vertices.push.apply(obj.vertices, elements);
      } else if (firstChar == 'vn') {
        // if this is a vertex normal
        objTmp.normals.push.apply(objTmp.normals, elements);
      } else if (firstChar == 'vt') {
        // if this is a texture
        objTmp.textures.push.apply(objTmp.textures, elements);
      } else if (firstChar == 'f') {
        // if this is a face
        /*
        split this face into an array of vertex groups
        for example:
           f 16/92/11 14/101/22 1/69/1
        becomes:
          ['16/92/11', '14/101/22', '1/69/1'];
        */
        var quad = false;
        for (var j = 0, eleLen = elements.length; j < eleLen; j++){

            // Triangulating quads
            // quad: 'f v0/t0/vn0 v1/t1/vn1 v2/t2/vn2 v3/t3/vn3/'
            // corresponding triangles:
            //      'f v0/t0/vn0 v1/t1/vn1 v2/t2/vn2'
            //      'f v2/t2/vn2 v3/t3/vn3 v0/t0/vn0'
            if(j === 3 && !quad) {
                // add v2/t2/vn2 in again before continuing to 3
               
                quad = true;
            }

            if(elements[j] in objTmp.hashindices){
                objTmp.indices.push(objTmp.hashindices[elements[j]]);
            }
            else{
                /*
            Each element of the face line array is a vertex which has its
            attributes delimited by a forward slash. This will separate
            each attribute into another array:
                '19/92/11'
            becomes:
                vertex = ['19', '92', '11'];
            where
                vertex[0] is the vertex index
                vertex[1] is the texture index
                vertex[2] is the normal index
             Think of faces having Vertices which are comprised of the
             attributes location (v), texture (vt), and normal (vn).
             */
            var vertex = elements[ j ].split( '/' );
            // vertex position sorted with in vertexIndices order
            /*objTmp.verts.push(+ obj.vertices[(vertex[0] - 1) * 3 + 1]);
            objTmp.verts.push(+ obj.vertices[(vertex[0] - 1) * 3 + 2]);
            objTmp.verts.push(+ obj.vertices[(vertex[0] - 1) * 3 + 0]);
            */
            // vertex textures
            if (objTmp.textures.length) {
              obj.uv.push(+objTmp.textures[(vertex[1] - 1) * 2 + 0]);
              obj.uv.push(+objTmp.textures[(vertex[1] - 1) * 2 + 1]);
            }
            // vertex normals
            obj.normals.push(+objTmp.normals[(vertex[2] - 1) * 3 + 0]);
            obj.normals.push(+objTmp.normals[(vertex[2] - 1) * 3 + 1]);
            obj.normals.push(+objTmp.normals[(vertex[2] - 1) * 3 + 2]);
            // add the newly created vertex to the list of indices
            obj.vertexIndices.push(vertex[0]);
            // increment the counter
            obj.index += 1;

            objTmp.hashindices[elements[j]] = obj.index;
            objTmp.indices.push(obj.index);

            if(j === 3 && quad) {
                // replace the fourth vertex of the quad which is the last element of obj.vertexIndices
                // in order to split the quad onto two triangle : 
                // f 1 2 3 4 => 1 2 3  1 3 4 

                objTmp.indices.push( objTmp.hashindices[elements[0]]);
                obj.vertexIndices[obj.vertexIndices.length-1] =  obj.vertexIndices[obj.vertexIndices.length-4];
                obj.vertexIndices.push(obj.vertexIndices[obj.vertexIndices.length-2],
                                      vertex[0]);
            }
        }
      }
    }
  }
  console.log(obj.index);
  console.log(obj.vertexIndices);
  return obj;
}


}