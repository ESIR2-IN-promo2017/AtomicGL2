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
	this.step = 0.50 ;

  // rot
	this.rot = 0.5 ;

  // jump
  this.jumping = false;
  this.jumpUp = false;
  this.jumpDown = false;
  this.relativeYc = 0;
  this.timer = 0;

  // navmesh
  this.heightJump = 3;

  this.navmesh = new atomicGL2NavMesh(navMesh, this.xc, this.yc, this.zc);
}

	// methods
	// --------------------------------------------------
	// up/right/left/down
	//---------------------------
	up() {
    var displaceX = +this.step*Math.sin(this.theta*3.14/180.0);
    var displaceZ = -this.step*Math.cos(this.theta*3.14/180.0);
    this.navmesh.move(displaceX, displaceZ);
	}

	down() {
    var displaceX = -this.step*Math.sin(this.theta*3.14/180.0);
    var displaceZ = +this.step*Math.cos(this.theta*3.14/180.0);
    this.navmesh.move(displaceX, displaceZ);
	}

	right() {
    var displaceX = +this.step*Math.cos(this.theta*3.14/180.0);
    var displaceZ = +this.step*Math.sin(this.theta*3.14/180.0);
    this.navmesh.move(displaceX, displaceZ);
	}

	left() {
    var displaceX = -this.step*Math.cos(this.theta*3.14/180.0);
    var displaceZ = -this.step*Math.sin(this.theta*3.14/180.0);
    this.navmesh.move(displaceX, displaceZ);
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

  jump() {
    if(this.jumping == false)
    {
      this.jumping = true;
      this.jumpUp = true;
    }
  }

  update(){
    this.xc = this.navmesh.getX();
    this.yc = this.navmesh.getY() + 2;
    this.zc = this.navmesh.getZ();

    if(this.jumping == true)
    {
      if(this.jumpUp == true)
      {
        if(this.relativeYc < this.heightJump)
        {
          //this.timer += this.clock.get();
          this.relativeYc += 0.1; //this.heightJump * this.timer/500;
          this.yc += this.relativeYc;
        }
        else
        {
          this.jumpUp = false;
          this.jumpDown = true;
          this.relativeYc = this.heightJump;
        }
      }

      if(this.jumpDown == true)
      {
        if(this.relativeYc > 0)
        {
        //this.timer += this.clock.get();
        this.relativeYc -= 0.1; //this.heightJump * this.timer/500;
        this.yc -= this.relativeYc;
        }
        else
        {
          this.jumpUp = false;
          this.jumpDown = false;
          this.jumping = false;
          this.relativeYc = 0;
        }
      }
    }
    // console.log(this.yc);
  }
}
