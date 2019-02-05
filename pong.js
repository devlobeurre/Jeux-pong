// Vecteur - déterminera position des éléments
class Vec{
	constructor(x=0, y=0){
		this.x = x;
		this.y = y;
	}
}
// rectangle
class Rect{
	constructor(w, h){
		this.pos = new Vec(); // position par défaut de Vec (x = y = 0)
		this.size = new Vec(w,h); // remplace x et y par deux valeurs undefined w(longeur) et h(largeur)
	}
// fonctions utilisées pour la balle
	get left(){
		return this.pos.x; // balle touche la bordure gauche du cadre

	}
	get right(){
		return this.pos.x + this.size.x; //  balle touche la bordure droite du cadre
		
	}
	get top(){
		return this.pos.y; //  balle touche la bordure haute du cadre
		
	}
	get bottom(){
		return this.pos.y + this.size.y; // balle touche la bordure basse du cadre
		
	}
}
// La balle
class Ball extends Rect {
	constructor(){
		super(10,10); // w = h = 10 - taille de la balle
		this.mouv = new Vec(); // postion initiale de la balle x = y = 0
	}
}

class Pong{
// type de cadre	
	constructor (canvas){
		this._canvas = canvas;
		this._context = canvas.getContext("2d");

		this.ball = new Ball();
// position initiale de la balle
        this.ball.pos.x = 100;
        this.ball.pos.y = 50;
// déplacement initial de la balle
        this.ball.mouv.x = 100;
        this.ball.mouv.y = 100;

        var lastTime;
        const callback = ((millis) =>{
	        if (lastTime){
		        this.update((millis - lastTime) / 1000); // vitesse balle
	        }
	        lastTime = millis;
	        requestAnimationFrame(callback); // rappel fonction callback après rafraichissemnt de la page
        });
        callback(); 
	}

	draw(){
// fond noir - longeur et largeur égale à celle de l'élément canvas
        this._context.fillStyle = "#000";
        this._context.fillRect(0, 0, canvas.width, this._canvas.height);

	    this.drawRect(this.ball); 		
	}
// dessine éléments du cadre - pour l'instant juste la balle    
	drawRect(Rect){
// balle(carrée) blanche - 
        this._context.fillStyle = "#fff";
        this._context.fillRect(Rect.pos.x, Rect.pos.y, 
	                           Rect.size.x, Rect.size.y);	
	}
	update(dt){
// déplacement de la balle
	    this.ball.pos.x += this.ball.mouv.x * dt;
	    this.ball.pos.y += this.ball.mouv.y * dt;

//inverser mouvement si balle sort du cadre
        if (this.ball.left < 0 || this.ball.right >= this._canvas.width){
        	this.ball.mouv.x = -this.ball.mouv.x;
        }
        if (this.ball.top < 0 || this.ball.bottom >= this._canvas.height){
        	this.ball.mouv.y = -this.ball.mouv.y;
        }

        this.draw(); // appel fonction draw qui dessine le cadre

    }
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
                         
// pong est l'id d'un élément canvas - longeur 600px et largeur 400 px
const canvas = document.getElementById("pong");
const pong = new Pong(canvas);



