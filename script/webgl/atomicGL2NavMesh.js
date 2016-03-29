// atomicGL
//----------------------------------------------------------------------------------------
// version: 0.1
// current version date: 2016/03/22
//----------------------------------------------------------------------------------------
// atomicGL2NavMesh
//----------------------------------------------------------------------------------------
// TODO list
//----------------------------------------------------------------------------------------

"use strict";


// constructor
//------------------------
class atomicGL2NavMesh {
  constructor(navMesh, coordX, coordY, coordZ){
  	// attributes
  	// -------------------------------------------------
  	// initial position
  	this.xc = coordX;
  	this.yc = coordY;
  	this.zc = coordZ;

    // authorized displacements
    this.heightUp = 1;
    this.heightDown = -5;

    // navmesh
    this.navmesh = new atomicGL2ObjMesh("navigation", eval("new "+navMesh), 1, 1);
    // this.navmesh = new atomicGL2ObjMesh("navigation", new atomicGL2Importer('objs/' + navMesh).obj, 1, 1) ;
  }

	// methods
	// --------------------------------------------------
	// up/right/left/down
	//---------------------------
  move(displaceX, displaceZ) {
    // For each triangle in navmesh
    for (var i=0; i<this.navmesh.vertexIndices.length; i+=3)
    {
      // Find the next position with displacement
      var ptx = this.xc + displaceX;
      var ptz = this.zc + displaceZ;

      // Find vertex points coordinates
      var v1x = this.navmesh.verticesArray[this.navmesh.vertexIndices[i]*3];
      var v1y = this.navmesh.verticesArray[(this.navmesh.vertexIndices[i]*3)+1];
      var v1z = this.navmesh.verticesArray[(this.navmesh.vertexIndices[i]*3)+2];
      var v2x = this.navmesh.verticesArray[(this.navmesh.vertexIndices[i+1])*3];
      var v2y = this.navmesh.verticesArray[((this.navmesh.vertexIndices[i+1])*3)+1];
      var v2z = this.navmesh.verticesArray[((this.navmesh.vertexIndices[i+1])*3)+2];
      var v3x = this.navmesh.verticesArray[(this.navmesh.vertexIndices[i+2])*3];
      var v3y = this.navmesh.verticesArray[((this.navmesh.vertexIndices[i+2])*3)+1];
      var v3z = this.navmesh.verticesArray[((this.navmesh.vertexIndices[i+2])*3)+2];

      // Compute barycentric coordinates
      var b1 = (((ptx - v2x) * (v1z - v2z)) - ((v1x - v2x) * (ptz - v2z))) < 0.0;
      var b2 = (((ptx - v3x) * (v2z - v3z)) - ((v2x - v3x) * (ptz - v3z))) < 0.0;
      var b3 = (((ptx - v1x) * (v3z - v1z)) - ((v3x - v1x) * (ptz - v1z))) < 0.0;

      // Compute just for X
      var b1X = (((ptx - v2x) * (v1z - v2z)) - ((v1x - v2x) * (this.zc - v2z))) < 0.0;
      var b2X = (((ptx - v3x) * (v2z - v3z)) - ((v2x - v3x) * (this.zc - v3z))) < 0.0;
      var b3X = (((ptx - v1x) * (v3z - v1z)) - ((v3x - v1x) * (this.zc - v1z))) < 0.0;

      // Compute just for Z
      var b1Z = (((this.xc - v2x) * (v1z - v2z)) - ((v1x - v2x) * (ptz - v2z))) < 0.0;
      var b2Z = (((this.xc - v3x) * (v2z - v3z)) - ((v2x - v3x) * (ptz - v3z))) < 0.0;
      var b3Z = (((this.xc - v1x) * (v3z - v1z)) - ((v3x - v1x) * (ptz - v1z))) < 0.0;

      // If it pops into a triangle
      if((b1 == b2) && (b2 == b3))
      {
        // Try to move in height
        if(this.moveY(ptx, ptz, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z))
        {
          this.xc = ptx;
          this.zc = ptz;
        }
      }
      else
      {
        // If we just move on X axe
        if((b1X == b2X) && (b2X == b3X))
        {
          // Try to move in height
          if(this.moveY(ptx, this.zc, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z))
            this.xc = ptx;
        }

        // If we just move on Z axe
        if((b1Z == b2Z) && (b2Z == b3Z))
        {
          // Try to move in height
          if(this.moveY(this.xc, ptz, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z))
            this.zc = ptz;
        }
      }
    }
  }

  moveY(ptx, ptz, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z)
  {
    // Compute distances between each triangle vertex
    var a = Math.sqrt(Math.pow(v1x-v2x, 2) + Math.pow(v1z-v2z, 2));
    var b = Math.sqrt(Math.pow(v2x-v3x, 2) + Math.pow(v2z-v3z, 2));
    var c = Math.sqrt(Math.pow(v3x-v1x, 2) + Math.pow(v3z-v1z, 2));

    // Compute distances between triangle vetrices and current position
    var da = Math.sqrt(Math.pow(ptx-v1x, 2) + Math.pow(ptz-v1z, 2));
    var db = Math.sqrt(Math.pow(ptx-v2x, 2) + Math.pow(ptz-v2z, 2));
    var dc = Math.sqrt(Math.pow(ptx-v3x, 2) + Math.pow(ptz-v3z, 2));

    // Compute pounds
    var p = (a+b+c)/2;
    var pA = (a+da+db)/2;
    var pB = (b+db+dc)/2;
    var pC = (c+dc+da)/2;

    // Compute areas
    var Air = Math.sqrt(p*(p-a)*(p-b)*(p-c));
    var AirA = Math.sqrt(pA*(pA-a)*(pA-da)*(pA-db));
    var AirB = Math.sqrt(pB*(pB-b)*(pB-db)*(pB-dc));
    var AirC = Math.sqrt(pC*(pC-c)*(pC-dc)*(pC-da));

    // Normalize areas
    var alpha = AirA / Air;
    var beta = AirB / Air;
    var gamma = AirC / Air;

    // Find Y movement
    var movement = (alpha*v3y + beta*v1y + gamma*v2y) - this.yc;

    // If this movement is authorized
    var authorized = (movement > this.heightDown) && (movement < this.heightUp);
    if(authorized)
      this.yc = (alpha*v3y + beta*v1y + gamma*v2y);

    return authorized;
  }

  isOnNavMesh(ptx, ptz)
  {
    var find = false;
    for (var i=0; i<this.navmesh.vertexIndices.length; i+=3)
    {
      // Find vertex points coordinates
      var v1x = this.navmesh.verticesArray[this.navmesh.vertexIndices[i]*3];
      var v1y = this.navmesh.verticesArray[(this.navmesh.vertexIndices[i]*3)+1];
      var v1z = this.navmesh.verticesArray[(this.navmesh.vertexIndices[i]*3)+2];
      var v2x = this.navmesh.verticesArray[(this.navmesh.vertexIndices[i+1])*3];
      var v2y = this.navmesh.verticesArray[((this.navmesh.vertexIndices[i+1])*3)+1];
      var v2z = this.navmesh.verticesArray[((this.navmesh.vertexIndices[i+1])*3)+2];
      var v3x = this.navmesh.verticesArray[(this.navmesh.vertexIndices[i+2])*3];
      var v3y = this.navmesh.verticesArray[((this.navmesh.vertexIndices[i+2])*3)+1];
      var v3z = this.navmesh.verticesArray[((this.navmesh.vertexIndices[i+2])*3)+2];

      // Compute barycentric coordinates
      var b1 = (((ptx - v2x) * (v1z - v2z)) - ((v1x - v2x) * (ptz - v2z))) < 0.0;
      var b2 = (((ptx - v3x) * (v2z - v3z)) - ((v2x - v3x) * (ptz - v3z))) < 0.0;
      var b3 = (((ptx - v1x) * (v3z - v1z)) - ((v3x - v1x) * (ptz - v1z))) < 0.0;

      // Compute just for X
      var b1X = (((ptx - v2x) * (v1z - v2z)) - ((v1x - v2x) * (this.zc - v2z))) < 0.0;
      var b2X = (((ptx - v3x) * (v2z - v3z)) - ((v2x - v3x) * (this.zc - v3z))) < 0.0;
      var b3X = (((ptx - v1x) * (v3z - v1z)) - ((v3x - v1x) * (this.zc - v1z))) < 0.0;

      // Compute just for Z
      var b1Z = (((this.xc - v2x) * (v1z - v2z)) - ((v1x - v2x) * (ptz - v2z))) < 0.0;
      var b2Z = (((this.xc - v3x) * (v2z - v3z)) - ((v2x - v3x) * (ptz - v3z))) < 0.0;
      var b3Z = (((this.xc - v1x) * (v3z - v1z)) - ((v3x - v1x) * (ptz - v1z))) < 0.0;

      // If it pops into a triangle
      if((b1 == b2) && (b2 == b3))
        find = true;
    }
    return find;
  }
}
