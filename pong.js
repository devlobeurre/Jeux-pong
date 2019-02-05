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

        this.players[1].pos.y = this.ball.pos.y; /*joueur 2 suit la balle
                                                   impossible de le battre*/

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
