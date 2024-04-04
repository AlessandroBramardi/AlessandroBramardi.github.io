let MENU = 0;
let img2;

let DIFF = 0;
let GAME_STATE = 0; // Aggiunto uno stato per gestire il gioco

let mattoncini;
let pallina;
let paddle;
let coll = false;

function preload() {
  img2 = loadImage('img/ciao.png');
}

function setup() {
  createCanvas(1000, 700);
  paddle = new Paddle(100, 20);
  mattoncini = new Mattoncini();
  mattoncini.creaMatt();
  background(0);
}

function draw() {
  if (MENU == 0) {
    console.log("menu iniziale")
    background(255);
    image(img2, 0, 0, 550, 550);
    fill(0, 255, 0);
    rect(50, 50, 200, 75);
    fill(255, 0, 255);
    rect(50, 200, 200, 75);
    fill(255, 0, 0);
    rect(50, 350, 200, 75);
    textSize(50);
    fill(255);
    text('GIOCA', 70, 106);
    text('ESCI', 94, 406);
    textSize(26);
    fill(255);
    text('ISTRUZIONI', 76, 248);
  } else if (MENU == 1) {
    background(255);
    image(img2, 0, 0, 550, 550);
    fill(0, 255, 0);
    rect(50, 50, 200, 75);
    fill(255, 0, 255);
    rect(50, 200, 200, 75);
    fill(255, 0, 0);
    rect(50, 350, 200, 75);
    textSize(40)
    fill(255);
    text('FACILE', 85, 100);
    text('MEDIO', 85, 255);
    text('DIFFICILE', 60, 406);
    if (DIFF == 1 || DIFF == 2 || DIFF == 3) {
      // controllo per il gioco svviato
      GAME_STATE = 1;
    }
    if (GAME_STATE == 1) {
      clear();
      aggiorna();
      mostra();
      if (keyIsDown(82)) {
        MENU = 0;
        GAME_STATE = 0;
        DIFF = 0
        paddle = new Paddle(100, 20);
        mattoncini = new Mattoncini();
        mattoncini.creaMatt();
        pallina = new Pallina(paddle, mattoncini, DIFF);
      }
    }
  } else if (MENU == 2) {
    background(0, 0, 0);
    textSize(20);
    text('Premi il tasto R per tornare indietro', 525, 30);
    textSize(30);
    text('1. Avrai a disposizione un paddle ed una pallina', 50, 150);
    text('2. Dovrai distruggere tutti i rettangoli senza far cadere la pallina', 50, 200);
    text('3. Usa le frecce per spostare il paddle e', 50, 240);
    text('    spazio per far partire la pallina',50, 265)
    text('4. La partita finisce quando perdi tutte le vite', 50, 310);

    if (keyIsDown(82)) {
      MENU = 0;
      GAME_STATE = 0;
      DIFF = 0;
      paddle = new Paddle(100, 20); // Reimposta il paddle
      mattoncini = new Mattoncini(); // Reimposta i mattoncini
      mattoncini.creaMatt(); // Ricrea i mattoncini
      pallina = null; // Resetta la pallina
    }
  } else if (MENU == 3) {
    background(255, 0, 0);
    textSize(75);
    text('TORNA A GIOCARE', 25, height / 2);
    textSize(20);
    text('Premi il tasto R per tornare indietro', 525, 30);
    if (keyIsDown(82)) {
      MENU = 0;
      GAME_STATE = 0;
      DIFF = 0
      paddle = new Paddle(100, 20);
      mattoncini = new Mattoncini();
      mattoncini.creaMatt();
      pallina = new Pallina(paddle, mattoncini, DIFF);
    }
  }
}

function mouseClicked() {
  if (MENU == 0) {
    if (mouseX < 200 && mouseX > 50) {
      if (mouseY < 125 && mouseY > 50) {
        MENU = 1;
      }
      if (mouseY < 275 && mouseY > 200) {
        MENU = 2;
      }
      if (mouseY < 425 && mouseY > 350) {
        MENU = 3;
      }
    }
  } else if (MENU == 1) {
    if (mouseX < 200 && mouseX > 50) {
      if (mouseY < 125 && mouseY > 50) {
        DIFF = 1;
        pallina = new Pallina(paddle, mattoncini, DIFF); //creo pallina dopo aver assegnato diff
      }
      if (mouseY < 275 && mouseY > 200) {
        DIFF = 2;
        pallina = new Pallina(paddle, mattoncini, DIFF);
      }
      if (mouseY < 425 && mouseY > 350) {
        DIFF = 3;
        pallina = new Pallina(paddle, mattoncini, DIFF);
      }
    }
  }
}

//funzione presa da manuale p5
function collisionCircleRect(circleX, circleY, circleRadius, rectX, rectY, rectWidth, rectHeight) {
  let closestX = constrain(circleX, rectX, rectX + rectWidth);
  let closestY = constrain(circleY, rectY, rectY + rectHeight);

  let distanceX = circleX - closestX;
  let distanceY = circleY - closestY;

  let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

  return distanceSquared < (circleRadius * circleRadius);
}

function mostra() {
  mattoncini.mostra();
  pallina.mostra();
  paddle.mostra();
  noStroke();
  fill("black");
  textSize(15)
  text("Vite: " + pallina.vite, 10, height - 10);
  text("Punteggio: " + pallina.punteggio, 10, height - 30);
}

function aggiorna() {
  if (mattoncini.vMatt.length == 0) {
    MENU = 0;
    DIFF = 0;
    GAME_STATE = 0;
    paddle = new Paddle(100, 20);
    mattoncini = new Mattoncini();
    mattoncini.creaMatt();
    pallina = new Pallina(paddle, mattoncini, DIFF);
  }
  if(GAME_STATE == 0){
    paddle = new Paddle(100, 20);
    mattoncini = new Mattoncini();
    mattoncini.creaMatt();
    pallina = new Pallina(paddle, mattoncini, DIFF);
  }
  mattoncini.aggiorna();
  pallina.aggiorna();
  paddle.aggiorna();
}

class Mattoncini {
  constructor() {
    this.spaziamento = 15;
    this.righe = 2;
    this.colonne = 4;
    this.n_mat = this.righe * this.colonne;
    this.larghezza_mat = 0;
    this.altezza_mat = 0;
    this.vMatt = [];
    this.creaMatt();
  }

  creaMatt() {
    this.larghezza_mat = (width - (this.colonne + 1) * this.spaziamento) / this.colonne;
    this.altezza_mat = this.larghezza_mat * 0.4;

    this.vMatt = []; // Azzera l'array dei mattoncini prima di ricrearlo

    for (let righe = 0; righe < this.righe; righe++) {
      for (let col = 0; col < this.colonne; col++) {
        let x = this.spaziamento + col * (this.spaziamento + this.larghezza_mat);
        let y = this.spaziamento + righe * (this.spaziamento + this.altezza_mat);
        this.vMatt.push({ x, y });
      }
    }
  }

  mostra() {
    stroke("black");
    fill("red");
    for (let mattoncino of this.vMatt) {
      rect(mattoncino.x, mattoncino.y, this.larghezza_mat, this.altezza_mat);
    }
  }

  aggiorna() {
    for (let i = this.vMatt.length - 1; i >= 0; i--) {
      let mattoncino = this.vMatt[i];
      if (mattoncino.colpito) {
        this.vMatt.splice(i, 1);
      }
    }
  }

  colpito(pallina) {
    for (let i = this.vMatt.length - 1; i >= 0; i--) {
      let mattoncino = this.vMatt[i];
      if (pallina.colpito) continue;
      let collisione = collisionCircleRect(
        pallina.x,
        pallina.y,
        pallina.r,
        mattoncino.x,
        mattoncino.y,
        this.larghezza_mat,
        this.altezza_mat
      );
      if (collisione && coll == false) {
        coll = true;
        //return true;
      }
      if(coll == true && collisione){
        mattoncino.colpito = true;
        return true
      }
      
    }
  }
}

class Paddle {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.x = (width - this.w) / 2;
    this.y = height - this.h - 10;
  }

  mostra() {
    stroke("white");
    fill("black");
    rect(this.x, this.y, this.w, this.h);
  }

  aggiorna() {
    if (keyIsDown(LEFT_ARROW) && this.x > 0) {
      this.x -= 10;
    } else if (keyIsDown(RIGHT_ARROW) && this.x < width - this.w) {
      this.x += 10;
    }
  }
}

class Pallina {
  constructor(paddle, mattoncini, diff) {
    this.paddle = paddle;
    this.mattoncini = mattoncini;
    if(diff == 1){
      this.vel = 2;
      this.vite = 5;
    }else if(diff == 2){
      this.vel = 4;
      this.vite = 3;
    }else if(diff == 3){
      this.vel = 6;
      this.vite = 1;
    } 
    
    this.r = 12;
    this.punteggio = 0;
    this.x = this.paddle.x + this.paddle.w / 2;
    this.y = this.paddle.y - this.r;
    this.dx = random([-1, 1]);
    this.dy = -1;
    
    this.movimento = false;
  }

  mostra() {
    stroke("black");
    fill("black");
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  aggiorna() {
    if (this.movimento) {
      this.aggiornaMov();
    } else {
      this.aggiornaPaddle();
    }
    if (this.vite <= 0) {
      MENU = 0;
      DIFF = 0;
      GAME_STATE = 0; // Resetta lo stato del gioco quando perdo
      paddle = new Paddle(100, 20);
      mattoncini = new Mattoncini();
      mattoncini.creaMatt();
      pallina = new Pallina(paddle, mattoncini, DIFF);
    }
  }

  aggiornaMov() {
    this.x += this.dx * this.vel;
    this.y += this.dy * this.vel;
    if (this.x < 0 || this.x > width) {
      this.dx *= -1;
    }
    if (this.y < 0) {
      this.dy *= -1;
    }

    if (
      this.y > this.paddle.y - this.vel &&
      this.paddle.x < this.x &&
      this.paddle.x + this.paddle.w > this.x
    ) {
      this.y = this.paddle.y - this.r;
      this.dy *= -1;
      this.punteggio += 1;
    }

    if (this.y > height) {
      this.vite--;
      this.movimento = false;
      if (this.punteggio - 5 > 0) {
        this.punteggio -= 5;
      } else {
        this.punteggio = 0;
      }
    }

    if (this.mattoncini.colpito(this)) {
      this.dy *= -1;
    }
  }

  aggiornaPaddle() {
    if (keyIsDown(32)) {
      this.movimento = true;
    }
    this.x = this.paddle.x + this.paddle.w / 2;
    this.y = this.paddle.y - this.r;
  }
}
