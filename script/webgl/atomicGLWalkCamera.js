// atomicGL
//----------------------------------------------------------------------------------------
// author: RC
// contact: cozot@irisa.fr
// version: 0.1
// current version date: 2015/10/07
//----------------------------------------------------------------------------------------
// atomicGLClock
//----------------------------------------------------------------------------------------
// TODO list
//----------------------------------------------------------------------------------------

"use strict";


// constructor
//------------------------
class atomicGLWalkCamera {
 constructor(navMesh){
	// attributes
	// -------------------------------------------------
	// camera position
	this.xc = 10.0 ;
	this.yc = 2.0 ;
	this.zc = 0.0 ;
	// camera orientation
	this.theta = 0.0 ;
	this.phi = 0.0 ;
	// step
	this.step = 0.30 ;
	// rot
	this.rot = 0.5 ;

  // navmesh
  this.navmesh = new atomicGL2ObjMesh("navigation", eval("new "+navMesh), 1, 1);
}

	// methods
	// --------------------------------------------------
	// up/right/left/down
	//---------------------------
	up() {
    var displaceX = +this.step*Math.sin(this.theta*3.14/180.0);
    var displaceZ = -this.step*Math.cos(this.theta*3.14/180.0);
    this.move(displaceX, displaceZ);
	}

	down() {
    var displaceX = -this.step*Math.sin(this.theta*3.14/180.0);
    var displaceZ = +this.step*Math.cos(this.theta*3.14/180.0);
    this.move(displaceX, displaceZ);
	}

	right() {
    var displaceX = +this.step*Math.cos(this.theta*3.14/180.0);
    var displaceZ = +this.step*Math.sin(this.theta*3.14/180.0);
    this.move(displaceX, displaceZ);
	}

	left() {
    var displaceX = -this.step*Math.cos(this.theta*3.14/180.0);
    var displaceZ = -this.step*Math.sin(this.theta*3.14/180.0);
    this.move(displaceX, displaceZ);
	}

  move(displaceX, displaceZ) {
    for (var i=0; i<this.navmesh.vertexIndices.length; i+=3)
    {
      var ptx = this.xc + displaceX;
      var ptz = this.zc + displaceZ;

      var v1x = this.navmesh.verticesArray[this.navmesh.vertexIndices[i]*3];
      var v1y = this.navmesh.verticesArray[(this.navmesh.vertexIndices[i]*3)+1];
      var v1z = this.navmesh.verticesArray[(this.navmesh.vertexIndices[i]*3)+2];
      var v2x = this.navmesh.verticesArray[(this.navmesh.vertexIndices[i+1])*3];
      var v2y = this.navmesh.verticesArray[((this.navmesh.vertexIndices[i+1])*3)+1];
      var v2z = this.navmesh.verticesArray[((this.navmesh.vertexIndices[i+1])*3)+2];
      var v3x = this.navmesh.verticesArray[(this.navmesh.vertexIndices[i+2])*3];
      var v3y = this.navmesh.verticesArray[((this.navmesh.vertexIndices[i+2])*3)+1];
      var v3z = this.navmesh.verticesArray[((this.navmesh.vertexIndices[i+2])*3)+2];

      var b1 = (((ptx - v2x) * (v1z - v2z)) - ((v1x - v2x) * (ptz - v2z))) < 0.0;
      var b2 = (((ptx - v3x) * (v2z - v3z)) - ((v2x - v3x) * (ptz - v3z))) < 0.0;
      var b3 = (((ptx - v1x) * (v3z - v1z)) - ((v3x - v1x) * (ptz - v1z))) < 0.0;

      var b1X = (((ptx - v2x) * (v1z - v2z)) - ((v1x - v2x) * (this.zc - v2z))) < 0.0;
      var b2X = (((ptx - v3x) * (v2z - v3z)) - ((v2x - v3x) * (this.zc - v3z))) < 0.0;
      var b3X = (((ptx - v1x) * (v3z - v1z)) - ((v3x - v1x) * (this.zc - v1z))) < 0.0;

      var b1Z = (((this.xc - v2x) * (v1z - v2z)) - ((v1x - v2x) * (ptz - v2z))) < 0.0;
      var b2Z = (((this.xc - v3x) * (v2z - v3z)) - ((v2x - v3x) * (ptz - v3z))) < 0.0;
      var b3Z = (((this.xc - v1x) * (v3z - v1z)) - ((v3x - v1x) * (ptz - v1z))) < 0.0;

      if((b1 == b2) && (b2 == b3))
      {
        this.xc = ptx;
        this.zc = ptz;
        this.moveY(ptx, ptz, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z);
      }
      else
      {
        if((b1X == b2X) && (b2X == b3X))
        {
          this.xc = ptx;
          this.moveY(ptx, this.zc, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z);
        }
        if((b1Z == b2Z) && (b2Z == b3Z))
        {
          this.zc = ptz;
          this.moveY(this.xc, ptz, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z);
        }
      }
    }
  }

  moveY(ptx, ptz, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z)
  {
    var a = Math.sqrt(Math.pow(v1x-v2x, 2) + Math.pow(v1z-v2z, 2));
    var b = Math.sqrt(Math.pow(v2x-v3x, 2) + Math.pow(v2z-v3z, 2));
    var c = Math.sqrt(Math.pow(v3x-v1x, 2) + Math.pow(v3z-v1z, 2));

    var da = Math.sqrt(Math.pow(ptx-v1x, 2) + Math.pow(ptz-v1z, 2));
    var db = Math.sqrt(Math.pow(ptx-v2x, 2) + Math.pow(ptz-v2z, 2));
    var dc = Math.sqrt(Math.pow(ptx-v3x, 2) + Math.pow(ptz-v3z, 2));

    var p = (a+b+c)/2;
    var pA = (a+da+db)/2;
    var pB = (b+db+dc)/2;
    var pC = (c+dc+da)/2;

    var Air = Math.sqrt(p*(p-a)*(p-b)*(p-c));
    var AirA = Math.sqrt(pA*(pA-a)*(pA-da)*(pA-db));
    var AirB = Math.sqrt(pB*(pB-b)*(pB-db)*(pB-dc));
    var AirC = Math.sqrt(pC*(pC-c)*(pC-dc)*(pC-da));

    var alpha = AirA / Air;
    var beta = AirB / Air;
    var gamma = AirC / Air;

    this.yc = (alpha*v3y + beta*v1y + gamma*v2y) + 2;
  }

	turnright(a) {
		this.theta += +a ;
	}

  turnleft(a) {
		this.theta += +a ;
	}

  turnup(a){
    this.phi = a
  }
}
