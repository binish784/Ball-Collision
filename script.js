function ball(radius,parentElem){

	var MAX_SPEED=8;

	this.radius=radius;
	// this.mass=radius;
	this.x=0;
	this.y=0;
	this.dx=getRandomInt(-MAX_SPEED,MAX_SPEED+1);
	this.dy=getRandomInt(-MAX_SPEED,MAX_SPEED+1);;
	this.parentElem=parentElem;
	this.element=null;


	this.init=function(){
		this.element=document.createElement('div');
		this.element.className='ball';

		// console.log(this.radius);
		this.element.style.backgroundColor=getRandomColor();
		this.element.style.height=this.radius*2+'px';
		this.element.style.width=this.radius*2+'px';
		this.parentElem.appendChild(this.element);
		return this;
	}

	this.draw=function(){
		this.element.style.top=this.y + 'px';
		this.element.style.left=this.x + 'px';
	}

	this.move=function(){
		this.x+=this.dx;
		this.y+=this.dy;
	}

	this.setPosition=function(x,y){
		this.x=x;
		this.y=y;
	}

}

function getRandomColor(){
	return ('#' + (Math.random().toString(16) + "000000").substring(2,8));
}

function getRandomInt(min,max){
	var min= Math.ceil(min);
	var max=Math.floor(max);
	return (Math.random()*(max-min))+min;;
}


function gameAnimation(parentElem){

	var	CANVAS_HEIGHT=600;
	var CANVAS_WIDTH=1200;

	this.parentElem=parentElem;
	var balls=[]

	var FPS=60;

	var NUM_OF_BALLS=25;
	var MAX_RADIUS=40;
	var MIN_RADIUS=10;

	this.init=function(){
		for(var i=1 ;i<=NUM_OF_BALLS;i++){
			var ran_radius=getRandomInt(MIN_RADIUS,MAX_RADIUS);
			var ball_elem= new ball(ran_radius,this.parentElem).init();
			if(balls.length!=0){
				ball_elem.setPosition(getRandomInt(0,CANVAS_WIDTH-ball_elem.radius*2),getRandomInt(0,CANVAS_HEIGHT-ball_elem.radius*2))
				for(var k=0;k<balls.length;k++){
					if(!hasOverlapped(ball_elem,balls[k])){
						continue;
					}
					ball_elem.setPosition(getRandomInt(0,CANVAS_WIDTH-ball_elem.radius*2),getRandomInt(0,CANVAS_HEIGHT-ball_elem.radius*2))
					k=-1;
				}
			}else{
				ball_elem.setPosition(getRandomInt(0,CANVAS_WIDTH-ball_elem.radius*2),getRandomInt(0,CANVAS_HEIGHT-ball_elem.radius*2))		
			}
			ball_elem.draw();
			balls.push(ball_elem);
		}
		

		this.parentElem.addEventListener('click',function(e){
			if(e.target.className=='ball'){
				parentElem.removeChild(e.target);
				var index=-1;
				for(i=0;i<balls.length;i++){
					if(balls[i].element === e.target){
						index=i;
					}
				}
				if(index>-1){
					balls.splice(index,1);
				}
			}
			// console.log(balls);
		})

		setInterval(this.start.bind(this),1000/FPS);
	}

	this.start=function(){
		balls.forEach(function(ball,i1){
			ball.draw();
			ball.move();
			borderCollision(ball);
			balls.forEach(function(ball2,i2){
				if(i1!=i2){
					if(hasCollided(ball,ball2)){
						ballCollision(ball,ball2);						
					}
				}
			})
		})
	}

	function ballCollision(ball,ball2){
		temp_x=ball.dx;
		temp_y=ball.dy;
		ball.dx=ball2.dx;
		ball.dy=ball2.dy;
		ball2.dx=temp_x;
		ball2.dy=temp_y;
		if(hasOverlapped(ball,ball2)){
			fixOverlap(ball,ball2);
		}

	}

	function fixOverlap(c1,c2){
		var dx=(c1.x+c1.radius)-(c2.x+c2.radius);
		var dy=(c1.y+c1.radius)-(c2.y+c2.radius);
		var	distance=Math.sqrt(dx*dx+dy*dy)
		var not_overlapped_c1=distance-c2.radius;
		var overlapped=c1.radius-not_overlapped_c1;
		if(c1.x<c2.x){
			c1.x=c1.x-overlapped/2;
			c2.x=c2.x+overlapped/2;
		}else{
			c1.x=c1.x+overlapped/2;
			c2.x=c2.x-overlapped/2;
		}
		if(c1.y<c2.y){
			c1.y=c1.y-overlapped/2;
			c2.y=c2.y+overlapped/2;
		}else{
			c1.y=c1.y+overlapped/2;
			c2.y=c2.y-overlapped/2;
		}
}


	function borderCollision(c1){

		if(c1.x>=(CANVAS_WIDTH-c1.radius*2) ){
			c1.dx*=-1;
			c1.x=CANVAS_WIDTH-c1.radius*2;
		}else if(c1.x<=0){
			c1.x=0;
			c1.dx*=-1;
		}

		if(c1.y<=0){
			c1.y=0;
			c1.dy*=-1;
		}else if(c1.y>=(CANVAS_HEIGHT-c1.radius*2)){
			c1.dy*=-1;
			c1.y=(CANVAS_HEIGHT-c1.radius*2)
		}
	}

	function hasCollided(c1,c2){
		var dx=(c1.x+c1.radius)-(c2.x+c2.radius);
		var dy=(c1.y+c1.radius)-(c2.y+c2.radius);

		var	distance=Math.sqrt(dx*dx+dy*dy);
		var radius_sum=c1.radius+c2.radius;
		if(distance<=radius_sum){
			// console.log("Collision");
			return true;	
		}
		else{
			return false;
		}
	}

	function hasOverlapped(c1,c2){
		if(c1.x +c1.radius*2 > c2.x && c1.x<c2.x + c2.radius*2 && c1.y + c1.radius*2 > c2.y && c1.y < c2.y +c2.radius*2){
			// console.log("hasOverlapped");
			return true;

		}else{
			return false;
		}
	}

	this.removeBall=function(c1){
		balls=balls.filter(function(value){
			// console.log(c1);
			// console.log(value);
			return value!=c1;
		})
		// console.log(balls);
	}	

}


var canvas= document.getElementById("canvas");


new gameAnimation(canvas).init();
