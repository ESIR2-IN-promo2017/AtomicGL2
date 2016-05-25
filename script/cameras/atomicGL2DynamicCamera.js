"use strict";

// constructor
//------------------------
class atomicGL2DynamicCamera extends atomicGL2Camera{
	constructor(navMesh){
		super([0,0,0]);


		// attributes
		// -------------------------------------------------
		// walkStep
		this.walkStep = 0.50;
		this.jumpStep = 0.60;

		// fly
		this.isFreeCam = false;

		// jump
		this.jumping    = false;
		this.jumpUp     = false;
		this.jumpDown   = false;
		this.heightJump = 4;
		this.levelZero  = 0;

		// navmesh
		this.navmesh = new atomicGL2NavMesh(navMesh, this.xc, this.yc, this.zc);
		this.xc = this.navmesh.initPosition()[0];
		this.yc = this.navmesh.initPosition()[1] + 2;
		this.zc = this.navmesh.initPosition()[2];

		this.jump();
		this.up();
	}

	// methods
	// --------------------------------------------------
	// up/right/left/down
	//---------------------------
	up(){
		var displaceX = +this.walkStep*Math.sin(this.theta*3.14/180.0);
		var displaceZ = -this.walkStep*Math.cos(this.theta*3.14/180.0);
		this.move(displaceX, displaceZ);
	}

	down(){
		var displaceX = -this.walkStep*Math.sin(this.theta*3.14/180.0);
		var displaceZ = +this.walkStep*Math.cos(this.theta*3.14/180.0);
		this.move(displaceX, displaceZ);
	}

	right(){
		var displaceX = +this.walkStep*Math.cos(this.theta*3.14/180.0);
		var displaceZ = +this.walkStep*Math.sin(this.theta*3.14/180.0);
		this.move(displaceX, displaceZ);
	}

	left(){
		var displaceX = -this.walkStep*Math.cos(this.theta*3.14/180.0);
		var displaceZ = -this.walkStep*Math.sin(this.theta*3.14/180.0);
		this.move(displaceX, displaceZ);
	}

	move(displaceX, displaceZ){
		if(this.jumping){
			this.xc += displaceX;
			this.zc += displaceZ;
		}

	    if(this.isFreeCam){
			this.xc += displaceX;
			this.zc += displaceZ;
			this.yc += this.walkStep * Math.sin(-this.phi * 3.14 / 180);
		}

		this.navmesh.move(displaceX, displaceZ);
	}

	jump(){
		if(this.jumping == false)
		{
			this.levelZero = this.yc;
			this.jumping = true;
			this.jumpUp = true;
		}
	}

	update(){
		if(this.isFreeCam == true)
		{
			this.levelZero  = this.yc;
			this.navmesh.xc = this.xc;
			this.navmesh.zc = this.zc;
		}
		else if(this.jumping == true)
		{
			this.animJump();
			this.navmesh.xc = this.xc;
			this.navmesh.zc = this.zc;
		}
		else if(!this.navmesh.isOnNavMesh(this.xc, this.zc)){
			console.log("You died !");
			this.navmesh.xc = 0.0;
			this.navmesh.yc = 0.0;
			this.navmesh.zc = 0.0;
			this.xc = 0.0;
			this.yc = 2.0;
			this.zc = 0.0;
		}
		else {
			this.xc = this.navmesh.xc;
			this.yc = this.navmesh.yc + 2.0;
			this.zc = this.navmesh.zc;
		}
	}

	animJump(){
		if(this.jumpUp == true)
			if(this.yc < this.levelZero + this.heightJump + 2)
				this.yc += this.jumpStep * (this.levelZero + this.heightJump + 3 - this.yc) / this.heightJump;
		else
		{
			this.yc       = this.levelZero + this.heightJump + 2;
			this.jumpUp   = false;
			this.jumpDown = true;
		}

		if(this.jumpDown == true)
			if(this.yc > this.navmesh.yc + 2)
				this.yc -= this.jumpStep * (this.levelZero + this.heightJump + 3 - this.yc) / this.heightJump;
		else
		{
			this.yc       = this.navmesh.yc + 2;
			this.jumpUp   = false;
			this.jumpDown = false;
			this.jumping  = false;
		}

		if(this.yc < this.navmesh.yc + 2)
		{
			this.yc       = this.navmesh.yc + 2;
			this.jumpUp   = false;
			this.jumpDown = false;
			this.jumping  = false;
		}
	}
}
