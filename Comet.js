
function Comet(ctx){
    this.cw = 5000;
    this.ch = 5000;
    
    this.ctx            = ctx;
    
    this.cometId        = Math.floor(Math.random()*90000) + 10000;
    this.x              = 0;
    this.y              = 0; 
    this.length         = 300;
    this.speed          = 2;
    this.hue            = 1;
    this.thickness      = 35;
    this.blur           = 25;
    this.particles      = [];
    this.particleMax    = 100;
    this.rotation       = 0;
    this.flareDist      = 20;
    
    this.endPoint       = {"x": this.x, "y": this.y};
        
    this.ctx.shadowBlur = this.blur;
    this.ctx.shadowColor = 'hsla('+this.hue+', 80%, 60%, 1)';
    this.ctx.lineCap = 'round'
    
    this.gradient1 = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.length);      
    this.gradient1.addColorStop(0, 'hsla('+this.hue+', 60%, 50%, .25)');
    this.gradient1.addColorStop(1, 'hsla('+this.hue+', 60%, 50%, 0)');

    this.gradient2 = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.length);      
    this.gradient2.addColorStop(0, 'hsla('+this.hue+', 100%, 50%, 0)');
    this.gradient2.addColorStop(.1, 'hsla('+this.hue+', 100%, 100%, .7)');
    this.gradient2.addColorStop(1, 'hsla('+this.hue+', 100%, 50%, 0)');
    
    var ref = this;
    
    this.dToR = function(degrees){
        return degrees * (Math.PI / 180);
    }
    
    this.rand = function(a,b){return ~~((Math.random()*(b-a+1))+a);}
    
    this.setEnd = function(end){
        this.rotation = Math.atan2(end.y - this.y, end.x - this.x) * 180 / Math.PI;
        this.end = end;
        
        time = end["time"]|| 5000;
        onComplete = end["onComplete"]|| function(){};
        easing = end["easing"]|| TWEEN.Easing.Linear.None;
        
        this.tween = new TWEEN.Tween(this)
            .to(end, time)
            .easing(easing)
            .onUpdate(function () {
                this.setHue(this.hue);
            } )
            .onComplete(onComplete)
            .start(); 
    }
    
    this.setHue = function(hue){
        this.hue = hue;
        
        this.gradient1 = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.length);      
        this.gradient1.addColorStop(0, 'hsla('+this.hue+', 60%, 50%, .25)');
        this.gradient1.addColorStop(1, 'hsla('+this.hue+', 60%, 50%, 0)');

        this.gradient2 = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.length);      
        this.gradient2.addColorStop(0, 'hsla('+this.hue+', 100%, 50%, 0)');
        this.gradient2.addColorStop(.1, 'hsla('+this.hue+', 100%, 100%, .7)');
        this.gradient2.addColorStop(1, 'hsla('+this.hue+', 100%, 50%, 0)');
    }
    
    this.renderCircle = function(){
      this.ctx.save();
      this.ctx.translate(this.x, this.y);
      this.ctx.rotate(this.dToR(this.rotation));
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(-this.length, 0);
      
      this.ctx.lineWidth = this.thickness;   
      this.ctx.strokeStyle = this.gradient1;
      this.ctx.stroke();
      this.ctx.restore();
    }
    
    this.renderCircleBorder = function(){
      this.ctx.save();
      this.ctx.translate(this.x, this.y);
      this.ctx.rotate(this.dToR(this.rotation));
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(-this.length, 0);
      
      this.ctx.moveTo(0, 0);//-(comet.thickness/2));
      this.ctx.lineTo(-this.length, 0);//-(comet.thickness/2));
      
      this.ctx.lineWidth = 2;  
      this.ctx.strokeStyle = this.gradient2;
      this.ctx.stroke();
      this.ctx.restore();
    }
    
    
	this.renderCircleFlare = function(){
      this.ctx.save();
      this.ctx.translate(this.x, this.y);
      this.ctx.rotate(this.dToR(this.rotation));
      this.ctx.scale(1,1);
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.arc(0, 0, 30, 0, Math.PI *2, false);
      
      this.ctx.closePath();
      gradient3 = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 30);      
      gradient3.addColorStop(0, 'hsla(330, 50%, 50%, .35)');
      gradient3.addColorStop(1, 'hsla(330, 50%, 50%, 0)');
      this.ctx.fillStyle = gradient3;
      this.ctx.fill();     
      this.ctx.restore();
    }
    
    this.renderCircleFlare2 = function(){
      this.ctx.save();
      this.ctx.translate(this.x-(this.flareDist*Math.cos(this.dToR(this.rotation))), this.y-(this.flareDist*Math.sin(this.dToR(this.rotation))));
      this.ctx.rotate(this.dToR(this.rotation));
      this.ctx.scale(1.5,1);
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.arc(0, 0, 25, 0, Math.PI *2, false);
      
      this.ctx.closePath();
      gradient4 = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 25);
      gradient4.addColorStop(0, 'hsla(30, 100%, 50%, .2)');
      gradient4.addColorStop(1, 'hsla(30, 100%, 50%, 0)');
      this.ctx.fillStyle = gradient4;
      this.ctx.fill();     
      this.ctx.restore();
    }
    
    this.createParticles = function(){
      if(this.particles.length < this.particleMax){
        this.particles.push({
          x: this.x + (this.rand(0, this.thickness*2) - this.thickness),
          y: this.y + (this.rand(0, this.thickness*2) - this.thickness),
          vx: (this.rand(0, 100)-50)/1000,
          vy: (this.rand(0, 100)-50)/1000,
          radius: this.rand(1, 6)/2,
          alpha: this.rand(10, 20)/100
        });
      }
    }
    
    this.updateParticles = function(){
      var i = this.particles.length;
      while(i--){
      	var p = this.particles[i];
        p.vx += (this.rand(0, 100)-50)/750;
        p.vy += (this.rand(0, 100)-50)/750;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= .01;
        
        if(p.alpha < .02){
          this.particles.splice(i, 1)
        }
      }
    }
    
    this.renderParticles = function(){
      var i = this.particles.length;
      while(i--){
      	var p = this.particles[i];
        this.ctx.beginPath();
        this.ctx.fillRect(p.x, p.y, p.radius, p.radius);
        this.ctx.closePath();
        this.ctx.fillStyle = 'hsla(0, 0%, 100%, '+p.alpha+')';
      }
    }
    
    this.clear = function(){
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.fillStyle = 'rgba(0, 0, 0, .1)';
      this.ctx.fillRect(0, 0, this.cw, this.ch);
      this.ctx.globalCompositeOperation = 'lighter';		
    }      
    
    this.render = function(){
      this.renderCircle();
      this.renderCircleBorder();
      this.renderCircleFlare();
      this.renderCircleFlare2();
      this.createParticles();
      this.updateParticles();
      this.renderParticles();
    } 
    
    this.startLoop = function(){
        this.looper = setInterval(function() {
            ref.clear();
            ref.render();
        }, 16);
    }     
    
    this.stopLoop = function(){
        window.clearInterval(this.looper);
    }
}


//Render List
var cometObj = [];

function animate() {  
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, .1)';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalCompositeOperation = 'lighter';

    for (var key in cometObj){
        cometObj[key].render();
    }

    requestAnimationFrame(animate);
    TWEEN.update();
}

/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish / http://paulirish.com/
 */
 
if ( !window.requestAnimationFrame ) {
  window.requestAnimationFrame = ( function() {
    return window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
      window.setTimeout( callback, 1000 / 60 );
    };
  } )();
}


