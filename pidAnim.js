/*
    File: pidAnim.js
    Author: Timothy Cherney
    Javascript animation of a pid controlled system

    dependencies: jquery
*/
function PIDAnim(interval)
{
    this.ctx = 0;
    this.handle = 0;
    this.interval = interval;
    this.width = 0;
    this.height = 0;
    this.c;
    this.tube = new Tube(25,25,30,200,15,Math.PI,0);
    this.fan = new Fan(25,245,30,30,0,10);
    this.ball = new Ball(40,210,15);
    this.desired = 0;
}
function Ball(x,y,radius)
{
    this.x = x;
    this.y = y;
    this.yStart = y;
    this.radius = radius;
}

Ball.prototype.draw = function(ctx)
{
    ctx.save();
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

PIDAnim.prototype.adjustBall = function(dist)
{
    this.ball.y = this.ball.yStart-((dist/(this.desired*2))*(this.tube.height));
}

PIDAnim.prototype.adjustFan = function(curr,max)
{
    if(max > 0)this.fan.curSpeed = parseFloat(((curr/max)*this.fan.maxSpeed));
    else this.fan.curSpeed = 0;
}

//round portion drawn at x,y
function Tube(x,y,width,height,radius,start,end)
{
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.start = start;
    this.end = end;
    this.width = width;
    this.height = height;
}

Tube.prototype.draw = function(ctx)
{
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x+this.radius,this.y-10,this.radius,this.start,this.end);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(this.x,this.y-10);
    ctx.lineTo(this.x,this.y+this.height);
    ctx.lineTo(this.x+this.width,this.y+this.height);
    ctx.lineTo(this.x+this.width,this.y-10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

}

function Fan(x,y,width,height,angle,maxSpeed)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.maxSpeed = maxSpeed;
    this.curSpeed = 0;
}

Fan.prototype.draw = function(ctx)
{
    ctx.save();
    ctx.lineWidth = 2;
    ctx.translate(this.x+(this.width/2),this.y+(this.height/2));
    ctx.rotate((this.angle)*Math.PI/180);
    ctx.translate(-(this.x+(this.width/2)),-(this.y+(this.height/2)));
    this.angle += this.curSpeed;
    ctx.beginPath();
    ctx.moveTo(this.x,this.y+(this.height/2));
    ctx.lineTo(this.x+this.width,this.y+(this.height/2));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.x+(this.width/2),this.y);
    ctx.lineTo(this.x+(this.width/2),this.y+this.height);
    ctx.stroke();
    ctx.restore();

}



PIDAnim.prototype.draw = function()
{
    this.ctx.clearRect(0,0,this.width,this.height);
    this.tube.draw(this.ctx);
    this.fan.draw(this.ctx);
    this.ball.draw(this.ctx);
    //draw desired line

    this.ctx.save();
    this.ctx.strokeStyle = "#c5b47f";
    this.ctx.beginPath();
    this.ctx.moveTo(this.tube.x,(this.ball.yStart-((this.desired/(this.desired*2))*this.tube.height)));
    this.ctx.lineTo(this.tube.x+this.tube.width,(this.ball.yStart-((this.desired/(this.desired*2))*this.tube.height)));
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore();


}

PIDAnim.prototype.init = function(desired)
{
    this.c = $("#modelAnimation")[0];
    this.width = this.c.width;
    this.height = this.c.height;
    this.ctx = this.c.getContext("2d");
    var self = this;
    this.handle = setInterval(function(){self.draw();},this.interval);
    this.desired = desired;
}