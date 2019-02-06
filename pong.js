// Vecteur - déterminera position des éléments
class Vec{
	constructor(x=0, y=0){
		this.x = x;
		this.y = y;
	}
	//taille vecteur - détermine vitesse
	get len(){
		//calcule hypothènuse
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}
	set len(value){
		// valeur = len du vecteur * un facteur
		const fact = value / this.len;
		// x et y du vecteur égaux
		this.x *= fact;
		this.y *= fact;
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
class Ball extends Rect{
	constructor(){
		super(10,10); // w = h = 10 - taille de la balle
		this.mouv = new Vec(); // postion initiale de la balle x = y = 0
	}
}

// Joueurs
class Player extends Rect{
	constructor(){
		super(20, 100);
		this.score = 0;
	}
}

class Pong{
// type de cadre	
	constructor (canvas){
		this._canvas = canvas;
		this._context = canvas.getContext("2d");

		this.ball = new Ball();

// 2 joueurs
        this.players = [
            new Player,
            new Player,
        ];
// position des 2 joueurs
        this.players[0].pos.x = 40; // Joueur 1 à gauche
        this.players[1].pos.x = this._canvas.width - 40; //Joueur 2 à droite
        this.players.forEach(player => {
            player.pos.y = this._canvas.height /3 /*hauteur initiale 2 joueurs 
                                                   (haut de la barre au centre de l'écran)*/
        });
//animation de la balle        
        var lastTime;
        const callback = ((millis) =>{
	        if (lastTime){
		        this.update((millis - lastTime) / 1000); // vitesse balle
	        }
	        lastTime = millis;
	        requestAnimationFrame(callback); // rappel fonction callback après rafraichissemnt de la page
        });
        callback(); 
        this.reset(); // la balle est au milieu en début de partie
	}
//collision balle - joeurs
    collision(player, ball){
    	if (player.left < ball.right && player.right > ball.left &&
    	player.top < ball.bottom && player.bottom > ball.top){
    		const len = ball.mouv.len;
    		ball.mouv.x = - ball.mouv.x // balle change direction après collision
    		ball.mouv.y += 300 * (Math.random() - .5);
    		ball.mouv.len= len *1.01 /* vitesse de la balle augmente de 1% chaque fois qu'un joueur la touche
    		                            le const permet d'augmenter de 1 % de la vitesse initiale*/
    	}
    }
	draw(){
// fond noir - longeur et largeur égale à celle de l'élément canvas
        this._context.fillStyle = "#000";
        this._context.fillRect(0, 0, canvas.width, this._canvas.height);

	    this.drawRect(this.ball); 	// dessiner la balle
	    this.players.forEach(player => this.drawRect(player))// dessiner les  2 joueurs	
	}
// dessine éléments du cadre - pour l'instant juste la balle    
	drawRect(Rect){
// balle(carrée) blanche - Joeurs (barres)
        this._context.fillStyle = "#fff";
        this._context.fillRect(Rect.left, Rect.top, //position
	                           Rect.size.x, Rect.size.y);//taille
    }
	reset(){
// position initiale de la balle - centre du cadre
        this.ball.pos.x = this._canvas.width / 2;
        this.ball.pos.y = this._canvas.height / 2;
// déplacement initial de la balle - nul (la balle reste au centre)
        this.ball.mouv.x = 0;
        this.ball.mouv.y = 0;
    }
//  reprise de la partie 
    start(){
    	// si la balle est au centre (après le reset)
		if (this.ball.mouv.x === 0 && this.ball.mouv.y === 0){
			        // balle bouge vars la gauche (joueur 1) lorsque la partie reprend
			        this.ball.mouv.x = - 300,
			         // 1 chance sur deux que la balle se dirige vers le bas ou vers le haut 
                    this.ball.mouv.y = 300 * (Math.random() > .5 ? 1 : - 1);
                    // vitesse lente à chaque reprise de la partie 
                    this.ball.mouv.len = 300;
        }
	
	}
	

	update(dt){
// déplacement de la balle
	    this.ball.pos.x += this.ball.mouv.x * dt;
	    this.ball.pos.y += this.ball.mouv.y * dt;

/*maintenant que nous avons les deux joueurs 
lorsque la balle touche les bords droite ou gauche 
On ne veut pas qu'elle rebondisse
On veut asigner un point à un joueur*/
        if (this.ball.left < 0 || this.ball.right >= this._canvas.width){
        	const playerId = this.ball.mouv.x <0 | 0 ; // la balle atteint la bord gauche
        	this.players[playerId].score++; // + 1 point lorsque la balle atteint le bord gauche.
        	console.log(playerId)
        	this.reset(); /* à chaque fois que la balle atteint le bord gauche,
        	                 elle reprend sa position initiale (centre du cadre)*/
        	this.ball.mouv.x = -this.ball.mouv.x;
        }
        if (this.ball.top < 0 || this.ball.bottom >= this._canvas.height){
        	this.ball.mouv.y = -this.ball.mouv.y;
        }

        this.players[1].pos.y = this.ball.pos.y; /*joueur 2 suit la balle
                                               impossible de le battre*/                                                   
        this.players.forEach(player => this.collision(player, this.ball)); //les deux joueurs peuvent entrer en collision avec la balle
        this.draw(); // appel fonction draw qui dessine le cadre

    }
}

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
                         
// pong est l'id d'un élément canvas - longeur 600px et largeur 400 px
const canvas = document.getElementById("pong");
const pong = new Pong(canvas);

//Joeur 1 suit la souris
canvas.addEventListener("mousemove", event => {
    pong.players[0].pos.y = event.offsetY // annule mouvements horizontales
});

//La partie reprend lorsque l'on clique sur la souris
canvas.addEventListener("click", event => {
    pong.start(); // 
});
