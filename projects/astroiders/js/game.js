/**
 * Created by franciscomorales on 6/14/16.
 */
var debug = false;
var canvas;
var okButton;
var ship;
var asteroids;
var currentState;
var states = {
    Splash: 0,
    Game: 1,
    Score: 2
};
var width;
var height;
var renderingContext;
var frames = 0;
var score = 0;
var best = 0;
var inputEvent;
var difficulty = 1;

function main(){
    windowSetup();
    canvasSetup();
    getTopScore();
    currentState = states.Splash;  // Splash screen starts

    ship = new Ship();
    asteroids = new AsteroidCollection();
    asteroids.reset();

    loadGraphics();

    //Remove debug element if debug flag is turned off
    if(!debug){
        var element = document.getElementById("debug");
        element.parentNode.removeChild(element);
    }

}
function windowSetup(){
    width = window.innerWidth;
    height = window.innerHeight;

    inputEvent = "touchStart";
    if(width >= 500){
        width = 320;
        height = 480;
        inputEvent = "mousedown";
    }
    document.addEventListener(inputEvent, onPress);
}
function canvasSetup(){
    canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = width;
    canvas.height = height;
    renderingContext = canvas.getContext("2d");
    document.body.appendChild(canvas);

    if(debug) {
        document.getElementById("canvas-height").innerText = height;
        document.getElementById("canvas-width").innerText = width;
        canvas.addEventListener("mousemove", function (evt) {
            var mouse = getMouseCanvaseOffset(evt);
            document.getElementById("mouse-x").innerText = mouse.x;
            document.getElementById("mouse-y").innerText = mouse.y;

        });
    }
}
function Ship() {
    // Ships position
    this.x = 60;
    this.y = 0;

    this.frame = 0; // The ships current frame
    this.velocity = 0; // The velocity of the ship in the y direction
    this.max_vel = 5; // The max velocity the ship can achieve
    this.animation = [0, 1, 2, 3, 4]; // The animation sequence for idle

    this.rotation = 0;
    this.radius = 12; // The collision radius of the ship

    this._thrust = 1.5; // The amount of thrust applied when clicking/tapping

    this.maxShootingDistance = 250; // The max number of pixels the ship can shoot;
    this.nearestAsteroid = null;
    this.exhauseParticles = [];

    /**
     * Engine exhaust particle
     */
    function exhaustParticle(x,y){
        this.x = x;
        this.y = y;
        this.MAX_SPEED = 4;
        this.offScreen = false;
        this.update = function(){
            this.x -= this.MAX_SPEED;
            if(this.x < -50){
                this.offScreen = true;
            }
        };
        this.draw = function(ctx){
            ctx.fillStyle = 'rgba(0, 255, 255, 0.900)';
            ctx.beginPath();
            ctx.arc(this.x-20,this.y+7,(Math.random() * 1),0,2*Math.PI);
            ctx.fill();
        };

    }

    /**
     * Reset the ship
     */
    this.reset = function(){
        this.frame = 0;
        this.velocity = 0;
        this.rotation = 0;
        this.x = 60;
        this.nearestAsteroid = null;
        this.exhauseParticles = [];
    };

    /**
     * Makes the Ship boost
     */
    this.boost = function (evt) {
        var mouse = getMouseCanvaseOffset(evt);

        // Check to see if the player clicked above the ship and make velocity negative sense
        // negative values are up in canvas
        if(mouse.y < this.y){
             this.velocity = this.velocity < -this.max_vel ?  -this.max_vel: this.velocity - this._thrust;
            if(this.velocity == 0){this.velocity = -.5;}
        }else if(mouse.y > this.y){
            // Check to see if the player clicked above the ship and make velocity negative sense
            // negative values are up in canvas
            this.velocity = this.velocity > this.max_vel ?  this.max_vel: this.velocity + this._thrust;
            if(this.velocity == 0){this.velocity = 0.5;}
        }
    };

    /**
     * Finds the nearest asteroid
     */
    this.findNearestAsteroid = function (){
        // Go through all the asteroids and find the nearest one
        var prev = this.nearestAsteroid;

        if(asteroids._asteroids.length > 0){
            if(asteroids._asteroids[0].health > 0) {
                this.nearestAsteroid = asteroids._asteroids[0];
            }
            for(var i = 1; i < asteroids._asteroids.length; i++){
                var aster = asteroids._asteroids[i];
                if(this.nearestAsteroid.distanceToShip > aster.distanceToShip && aster.health > 0){
                    this.nearestAsteroid = aster;
                }
            }
            if(this.nearestAsteroid.distanceToShip > this.maxShootingDistance){ // if all asteroids are farther away than the max distance we can shoot, then there are no asteroids
                this.nearestAsteroid = null;
            }
            if(prev !== null && this.nearestAsteroid !== null){
                if(prev.id !== this.nearestAsteroid.id){
                    prev.hit = false;
                }
            }

        }else{
            this.nearestAsteroid = null; // there is no nearest asteroid if there are no asteroids in the game
        }


    };

    /**
     *  Shoot at the nearest asteroid
     */
    this.shootNearestAsteroid = function (){
        this.findNearestAsteroid();
        if(this.nearestAsteroid !== null){
            this.nearestAsteroid.hit = true;
        }
    };

    /**
     * Update sprite animation and position of Ship
     */
    this.update = function () {
        // Play animation twice as fast during game state
        var n = currentState === states.Splash ? 10 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if (currentState === states.Splash) {
            this.updateIdle();
        } else { // Game state
            this.updatePlaying();
        }

        // Every 50 frames, add an exhaust particle
        if(frames % 20 === 0){
            this.exhauseParticles.push(new exhaustParticle(this.x, this.y + (Math.random() > .5 ? Math.random() * 3 : Math.random() * -3)));
        }
        // Update the exhaust particles
        for(var i = 0, len = this.exhauseParticles.length; i < len; i++){
            var particle = this.exhauseParticles[i];
            particle.update();
            if(particle.offScreen){
                this.exhauseParticles.splice(i, 1); // . . . remove it
                i--;
                len--;
            }
        }

    };

    /**
     * Runs the ship through its idle animation.
     */
    this.updateIdle = function () {
        this.y = height - 280 + 5 * Math.cos(frames / 10);
    };

    /**
     * Determines ship animation for the player-controlled ship.
     */
    this.updatePlaying = function () {
        //this.velocity += this.gravity;
        this.y += this.velocity;
        // If our player hits the top of the canvas, we keep it at the top
        if (this.y <= 25+41) { // 25 is a magic number that worked based on the image and +45 is the height of the score banner
            this.y = 66;
        }else if(this.y >= height - shipSprite[0].height/2){
            this.y = height - shipSprite[0].height/2;
        }
        this.shootNearestAsteroid();

    };



    /**
     * Draws the ship's exhaust
     */
    this.drawEngineExhaust = function(ctx){
        // draw the exhaust of the ship
        ctx.lineWidth = Math.random()*3 + 2;
        var gradient = ctx.createLinearGradient(this.x, this.y - ctx.lineWidth -100 , this.x - 300, this.y + ctx.lineWidth + 100);
        // Add colors
        gradient.addColorStop(0.000, 'rgba(176, 224, 230, 0.500)');
        gradient.addColorStop(0.500, 'rgba(0, 255, 255, 0.900)');
        gradient.addColorStop(1.000, 'rgba(176, 224, 230, 0.500)');
        ctx.strokeStyle = gradient;
        ctx.fillStyle = gradient;

        //Beam of the Exhaust
        ctx.beginPath();
        ctx.moveTo(this.x-20,this.y+7);
        ctx.lineTo(-300, this.y+7);
        ctx.stroke();

        //Triangle of engine exhaust
        ctx.beginPath();
        ctx.moveTo(this.x-35,this.y + 7);
        ctx.lineTo(this.x-25,(this.y + 7) + Math.random() + 5);
        ctx.lineTo(this.x-25,(this.y + 7) + Math.random() - 5);
        ctx.fill();
    }
    /**
     * Draws Ship to canvas renderingContext
     * @param  {CanvasRenderingContext2D} ctx the context used for drawing
     */
    this.draw = function (ctx) {

        // Draw the engine exhaust
        this.drawEngineExhaust(ctx);
        // Draw the exhaust particles
        for(var i = 0, len = this.exhauseParticles.length; i < len; i++){
            var particle = this.exhauseParticles[i];
            particle.draw(ctx);
        }

        // Draw the laser beam
        if(this.nearestAsteroid !== null){
            // The Line to detect collision
            var aster = this.nearestAsteroid;
            ctx.strokeStyle = "#38FF3C"
            ctx.beginPath();
            if(this.nearestAsteroid.y < this.y){
                ctx.moveTo(ship.x+5,ship.y-12);
            }else{
                ctx.moveTo(ship.x+5,ship.y+12);
            }

            ctx.lineTo(aster.x,aster.y);
            ctx.lineWidth = Math.random()*2 + 1;
            ctx.stroke();
            // Draw the explosion at the asteroid
            ctx.fillStyle = 'rgba(, 255, 255, 0.900)';
            var expRad = Math.random() * 7;
            var gradient = ctx.createLinearGradient(aster.x - expRad, aster.y - expRad , aster.x + expRad, aster.y + expRad);
            gradient.addColorStop(0.000, 'rgba(56, 255, 60, 0.500)');
            gradient.addColorStop(0.500, 'rgba(0, 255, 255, 1)');
            gradient.addColorStop(1.000, 'rgba(56, 255, 60, 0.500)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(aster.x, aster.y, expRad, 0, 2*Math.PI);
            ctx.fill();
        }

        // Draw the ship
        ctx.save();
        // translate and rotate renderingContext coordinate system
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        var n = this.animation[this.frame];
        // draws the ship with center in origin
        shipSprite[n].draw(ctx, -shipSprite[n].width / 2, -shipSprite[n].height / 2);
        ctx.restore();

        if(debug) {
            // draw the collision
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI); // Can do 0,0 for location as it has been determines in previous draw call
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 1;
            ctx.stroke();
            // Display the ship's parameters
            document.getElementById("ship-x").innerText = this.x.toString();
            document.getElementById("ship-y").innerText = this.y.toString();
            document.getElementById("ship-frame").innerText = this.frame.toString();
            document.getElementById("ship-vel").innerText = this.velocity.toString();
            document.getElementById("ship-nearest-asteroid").innerText = this.nearestAsteroid !== null ? this.nearestAsteroid.id.toString() : "None";
            document.getElementById("ship-exhaust-particles").innerText = this.exhauseParticles.length.toString();
        }
    };
}


function onPress(evt){
    switch(currentState){
        // Start the game
        case states.Splash:
            currentState = states.Game;
            break;
        case states.Game:
            ship.boost(evt);
            break;
        case states.Score:
            asteroids.reset();
            ship.reset();
            currentState = states.Splash;
            score = 0;
            difficulty = 1;
            break;
    }
}
function loadGraphics(){
    // Initialize graphics and ok button
    var image = new Image();
    image.src = "images/sheet.png";
    image.onload = function () {
        initSprites(this);
        renderingContext.fillStyle = backgroundSprite.color;

        okButton = {
            x: (width - okButtonSprite.width) / 2,
            y: height - 200,
            width: okButtonSprite.width,
            height: okButtonSprite.height
        };

        gameLoop();
    };
}

function AsteroidCollection(){
    this._asteroids = []; // Empty the array
    this._bgAsteroids = [];
    this._bgAsteroidCount = 0;
    this._asteroidCount = 0;

    // Function to clear the array
    this.reset = function(){
        this._asteroids = [];
        this._asteroidCount = 0;
        this._bgAsteroids = [];
        this._bgAsteroidCount = 0;

        // Add a bunch of randomly placed background sprites
        for(var i = 0; i < 30; i++){
            var asteroid = new Asteroid();
            asteroid.asterSize = Math.floor(Math.random() * 3); // 0 to 2 as we currently have three background asteroids
            asteroid.radius = asteroid.asterSize == 0 ? 12.5 : asteroid.asterSize == 1 ? 8 : 7.5;
            this._bgAsteroidCount++;
            asteroid.id = this._bgAsteroidCount;
            asteroid.x = Math.random() * width*2;
            asteroid.y = Math.random() * height;
            this._bgAsteroids.push(asteroid);
        }
    };

    // Function to add asteroids
    this.add = function(foreground){
        var asteroid = new Asteroid();
        asteroid.asterSize = Math.floor(Math.random() * 3); // 0 to 2 as we currently have three background asteroids
        if(foreground) {
            this._asteroidCount++;
            asteroid.id = this._asteroidCount;
            asteroid.radius = asteroid.asterSize == 0 ? 11.5 : asteroid.asterSize == 1 ? 19.5 : 32;
            asteroid.health += asteroid.asterSize; // increase the health by the size
            this._asteroids.push(asteroid);
        }else{
            this._bgAsteroidCount++;
            asteroid.id = this._bgAsteroidCount;
            asteroid.radius = asteroid.asterSize == 0 ? 12.5 : asteroid.asterSize == 1 ? 8 : 7.5;
            asteroid.x = width + 100;
            asteroid.y = Math.random() * height;
            this._bgAsteroids.push(asteroid);
        }
        return asteroid;
    };

    this.addForeground = function(x, y, size){
        var asteroid = new Asteroid();
        asteroid.asterSize = size;
        this._asteroidCount++;
        asteroid.id = this._asteroidCount;
        asteroid.radius = asteroid.asterSize == 0 ? 11.5 : asteroid.asterSize == 1 ? 19.5 : 32;
        asteroid.health += asteroid.asterSize; // increase the health by the size
        asteroid.x = x;
        asteroid.y = y;
        this._asteroids.push(asteroid);

    };

    // Update function adds a new coral every 100 frames
    // As well as updating
    this.update = function(){
        // Add one every 100 frames
        if(frames % 100 === 0){
            for(var i = 0; i < difficulty; i++) {
                this.add(true);
            }
            for(var j = 0; j < Math.ceil(Math.random() * 8); j++){ // Add some more background asteroids
                this.add(false);
            }
        }
        // Foreground: Update every asteroid in the array
        for (i = 0, len = this._asteroids.length; i < len; i++) { // Iterate through the array of asteroids and update each.
            var asteroid = this._asteroids[i]; // The current asteroid
            asteroid.update(); // Update the asteroid
            asteroid.detectCollision(); // . . . so, determine if the ship has collided with this asteroid
            if (asteroid.offScreen || asteroid.health <= 0) { // If the asteroid has moved off screen . . .
                this._asteroids.splice(i, 1); // . . . remove it
                i--;
                len--;
            }
        }
        // Background: Update every asteroid in the array
        for (i = 0, len = this._bgAsteroids.length; i < len; i++) { // Iterate through the array of asteroids and update each.
            asteroid = this._bgAsteroids[i]; // The current asteroid
            asteroid.update(); // Update the asteroid
            if (asteroid.offScreen) { // If the asteroid has moved off screen . . .
                this._bgAsteroids.splice(i, 1); // . . . remove it
                i--;
                len--;
            }
        }
        if(debug){
            // Foreground
            document.getElementById("total-asteroids").innerText = this._asteroids.length.toString();
            var asteroidList = document.getElementById("asteroid-list");
            asteroidList.innerHTML = "";
            for(i = 0; i < this._asteroids.length; i++){
                var li = document.createElement("li");
                var aster = this._asteroids[i];
                li.id = aster.id;
                li.innerText = "ID:" + li.id + " X:" + parseFloat(Math.round(aster.x * 100) / 100).toFixed(2) + " Y:" + parseFloat(Math.round(aster.y * 100) / 100).toFixed(2) + " HP:" + aster.health + " Hittable:" + aster.hittable;
                asteroidList.appendChild(li);
            }
            // Background
            document.getElementById("total-background-asteroids").innerText = this._bgAsteroids.length.toString();
            asteroidList = document.getElementById("background-asteroid-list");
            asteroidList.innerHTML = "";
            for(i = 0; i < this._bgAsteroids.length; i++){
                li = document.createElement("li");
                aster = this._bgAsteroids[i];
                li.id = aster.id;
                li.innerText = "ID:" + li.id + " Size:" +  aster.asterSize + " X:" + parseFloat(Math.round(aster.x * 100) / 100).toFixed(2) + " Y:" + parseFloat(Math.round(aster.y * 100) / 100).toFixed(2);
                asteroidList.appendChild(li);
            }
        }
    };

    // Call the draw function on every asteroid in the list
    this.draw = function(){

        this._bgAsteroids.forEach(function(element, index, array){element.draw(renderingContext, false)}); // Draw the background first so they show behind the targetable asteroids
        this._asteroids.forEach(function(element, index, array){element.draw(renderingContext, true)});
    };
}

/**
 * Define a Asteroid
 */
function Asteroid() {
    // Member variables
    this.asterSize = 0;
    this.background = false;
    this.MAX_SPEED = 2;
    this.x = width + 100; // Make sure the asteroid instance will be off screen to the right
    this.y = height/2 * Math.random();
    this.radius = 12; // The radius of the asteroid this will be based on the image
    this.xVelocity = Math.random()*this.MAX_SPEED + 1;
    this.yVelocity = Math.round(Math.random()) > 0 ? -1: 1;
    this.offScreen = false;
    this.id = 1;
    this.health = 5;
    this.hit = false; // when the asteroid is being hit
    this.hittable = true;
    this.rotation = 0;
    this.rotationDirection = Math.random() > 0.5 ? -1: 1;
    this.rotationSpeed = 0.1;
    this.distanceToShip = 5000; // The distance of the asteroid to the ship since we find this when checking collision we will store it so that we do not have to recalculate it for targeting
    this.DAMAGETIMEOUT = 200; // the time in milliseconds that the asterpoid can take damage, this prevents the asteroid from dying instantly
    this.damageTimer = null;

    // Methods
    this.detectCollision = function(){
        // intersection using the distance formula of the pythagorean theorem
        var dx = ship.x - this.x;
        var dy = ship.y - this.y;
        var distance = Math.sqrt(Math.pow(dx,2)+Math.pow(dy, 2));
        this.distanceToShip = distance;
        // Determine intersection if we are intersecting, then the shis is dead
        if (distance < this.radius) { // Then we are colliding
            currentState = states.Score;
            ship.velocity = 0; // set the ship velocity to 0
        }

    };

    this.update = function(){
        this.x -= this.xVelocity;
        this.y -= this.yVelocity;
        this.rotation += this.rotationSpeed * this.rotationDirection;
        var asteroidWidth = this.radius*2;

        if(this.hit && this.hittable){
            this.health--;
            this.hittable = false;
            if(this.health > 0) {
                this.damageTimer = setTimeout((function () {
                    this.hittable = true
                }).bind(this), this.DAMAGETIMEOUT); // set a time out to make the asteroid hittable again
            }
        }

        // Check to see if it dead, increase the score if it is
        if(this.health <= 0){
            score+= this.asterSize * 2 + 1;
            // Update the difficulty based the new score
            if(score > 10 && difficulty == 1){
                difficulty = 2;
            }else if(score > 20 && difficulty == 2){
                difficulty = 3;
            }else if(score > 40 && difficulty == 3){
                difficulty = 4;
            }

            // Create new Asteroids based on the current position and size
            if(this.asterSize == 1){ // create 2 small ones
                asteroids.addForeground(this.x + Math.random()*this.radius, this.y + Math.random()*this.radius, 0);
                asteroids.addForeground(this.x + Math.random()*this.radius, this.y + Math.random()*this.radius, 0);
            }else if(this.asterSize == 2){
                asteroids.addForeground(this.x + Math.random()*this.radius, this.y + Math.random()*this.radius, 1);
                asteroids.addForeground(this.x + Math.random()*this.radius, this.y + Math.random()*this.radius, 1);
            }
            if(this.damageTimer !== null){
                clearTimeout(this.damageTimer);
            }
        }

        // Check to see if the Asteroid is off the left screen
        if(this.x < -asteroidWidth){
            this.offScreen = true;
        }
        // Check to see if the Asteroid is off the top of the screen
        else if(this.y < -asteroidWidth){
            this.offScreen = true;
        }
        // Check to see if the Asteroid is off the bottom of the screen
        else if(this.y > height + asteroidWidth){
            this.offScreen = true;
        }
    };

    // Draw function
    this.draw = function(ctx, foreground){

        if(foreground) {
            ctx.save();
            // translate and rotate renderingContext coordinate system
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            // draws the ship with center in origin
            if(this.hit) {
                foregroundAsteroidSpriteHit[this.asterSize].draw(ctx, -foregroundAsteroidSpriteHit[this.asterSize].width / 2, -foregroundAsteroidSpriteHit[this.asterSize].height / 2);
            }else{
                foregroundAstroidSprite[this.asterSize].draw(ctx, -foregroundAstroidSprite[this.asterSize].width / 2, -foregroundAstroidSprite[this.asterSize].height / 2);
            }
            ctx.restore();

            if (debug) {
                // Collision
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                ctx.strokeStyle = '#ff0000';
                ctx.stroke();

                // Render the id
                ctx.font = "20px Helvetica";
                ctx.fillStyle = "#ff0000";
                ctx.fillText(this.id, this.x - (this.id.toString().length * 20) / 2 + 5, this.y + (5)); // Offset the text by 20px (the font asterSize) times the length of the number value

                // The Line to detect collision
                ctx.beginPath();
                ctx.moveTo(ship.x, ship.y);
                ctx.lineTo(this.x, this.y);
                ctx.stroke();
            }
        }else{
            ctx.save();
            // translate and rotate renderingContext coordinate system
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            // draws the ship with center in origin
            backgroundAsteroidSprite[this.asterSize].draw(ctx, -backgroundAsteroidSprite[this.asterSize].width / 2, -backgroundAsteroidSprite[this.asterSize].height / 2);
            ctx.restore();


            if (debug) {
                // Collision
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                ctx.strokeStyle = '#00ff00';
                ctx.stroke();

                // Render the id
                ctx.font = "20px Helvetica";
                ctx.fillStyle = "#00ff00";
                ctx.fillText(this.id, this.x - (this.id.toString().length * 20) / 2 + 5, this.y + (5)); // Offset the text by 20px (the font asterSize) times the length of the number value

            }
        }
    }
}
function getTopScore(){
    var val = localStorage.getItem("topScore");
    if(val === null){
        localStorage.setItem("topScore", best);
    }else{
        best=val;
    }
}
function setTopScore(val){
    if(val > best){
        localStorage.setItem("topScore", val);
    }
}
function drawPlayerScore(ctx){
    var num = score.toString();
    // Add the leading zeros
    for(var i = num.length - 1, j =0; i >= 0; i--, j++){
        var val = parseInt(num[j]);
        ctx.save();
        ctx.translate(250 - (i*23), 9 - largeNumberSprite[val].height / 2);
        largeNumberSprite[val].draw(renderingContext, -largeNumberSprite[val].width / 2, largeNumberSprite[val].height / 2);
        ctx.restore();
    }

}
function drawScore(ctx, x, y, score){
    var num = score.toString();
    // Add the leading zeros
    for(var i = num.length - 1, j =0; i >= 0; i--, j++){
        var val = parseInt(num[j]);
        ctx.save();
        ctx.translate(x - (i*12), y - largeNumberSprite[val].height / 2);
        largeNumberSprite[val].draw(renderingContext, -largeNumberSprite[val].width / 2, largeNumberSprite[val].height / 2);
        ctx.restore();
    }
}

function gameLoop(){
    update();
    render();
    window.requestAnimationFrame(gameLoop);
}

function update(){
    frames++;

    if(currentState !== states.Score){
        setTopScore(score);
        getTopScore();
    }
    if(currentState === states.Game){
        asteroids.update();
    }
    ship.update();
}

function render(){
    // Draw the background color
    renderingContext.fillRect(0,0, width, height);
    
    // Draw background sprite
    renderingContext.fillStyle = renderingContext.createPattern(backgroundSprite.img, 'repeat');
    renderingContext.fillRect(0,0, canvas.width, canvas.height);



    asteroids.draw(renderingContext);
    ship.draw(renderingContext);

    if(currentState === states.Splash) {
        splashScreenSprite.draw(renderingContext, width/2-splashScreenSprite.width/2,height/2 - splashScreenSprite.height/2);
        textSprites['splash'].draw(renderingContext, width/2-textSprites['splash'].width/2,height/2 - textSprites['splash'].height/2);
        if(inputEvent == "touchStart"){
            tapButtonSprite.draw(renderingContext, width/2 - tapButtonSprite.width/2,height/2 - tapButtonSprite.height/2);
        }else{
            clickButtonSprite.draw(renderingContext, width/2 - clickButtonSprite.width/2,height/2 + textSprites['splash'].height - clickButtonSprite.height);
        }
    }else if(currentState === states.Game) {
        scoreBannerSprite.draw(renderingContext, 0,0);
        drawPlayerScore(renderingContext);

    }else if(currentState === states.Score) {
        splashScreenSprite.draw(renderingContext, width/2-splashScreenSprite.width/2,height/2 - splashScreenSprite.height/2);
        textSprites["gameOver"].draw(renderingContext, width/2-textSprites['gameOver'].width/2,height/2 - textSprites['gameOver'].height-40);
        textSprites["topScore"].draw(renderingContext, width/2-textSprites['topScore'].width/2,height/2 - textSprites['topScore'].height-15);
        drawScore(renderingContext, width/2 + (best.toString().length-1)*12, height/2-12, best);
        textSprites["playerScore"].draw(renderingContext, width/2-textSprites['playerScore'].width/2,height/2 + textSprites['playerScore'].height+10);
        drawScore(renderingContext, width/2 + (score.toString().length-1)*12, height/2+45, score);
        okButtonSprite.draw(renderingContext, width/2 - okButtonSprite.width/2,height/2 + textSprites['splash'].height - okButtonSprite.height);
    }

    // Display the score if we are un debug mode
    if(debug){
        document.getElementById("score").innerText = score.toString();
        document.getElementById("top-score").innerText = best.toString();
        document.getElementById("difficulty").innerText = difficulty.toString();
    }

}

function getMouseCanvaseOffset(evt){
    var xpos, ypos;

    if(evt.offsetX == undefined) // this works for Firefox
    {
        xpos = evt.pageX - document.getElementById('canvas').offset().left;
        ypos = evt.pageY - document.getElementById('canvas').offset().top;
    }
    else                     // works in Google Chrome
    {
        xpos = evt.offsetX;
        ypos = evt.offsetY;
    }
    return {x:xpos, y:ypos};
}