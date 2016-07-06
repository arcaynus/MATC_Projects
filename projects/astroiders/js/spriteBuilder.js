/**
 * Created by franciscomorales on 6/14/16.
 */
// Sprite variables
var shipSprite;
var backgroundSprite;
var backgroundAsteroidSprite;
var foregroundAstroidSprite;
var foregroundAsteroidSpriteHit;
var textSprites;
var scoreSprite;
var splashScreenSprite;
var okButtonSprite;
var tapButtonSprite;
var clickButtonSprite;
var scoreBannerSprite;
var largeNumberSprite;

/**
 * Sprite class
 * @param {Image} img - sprite sheet image
 * @param {number} x - x-position in sprite sheet
 * @param {number} y - y-position in sprite sheet
 * @param {number} width - width of sprite
 * @param {number} height - height of sprite
 */
function Sprite(img, x, y, width, height) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

/**
 * Draw sprite to canvas context
 *
 * @param {CanvasRenderingContext2D} renderingContext context used for drawing
 * @param {number} x   x-position on canvas to draw from
 * @param {number} y   y-position on canvas to draw from
 */
Sprite.prototype.draw = function (renderingContext, x, y) {
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height,
        x, y, this.width, this.height);
};

/**
 * Initate all sprite
 * @param {Image} img spritesheet image
 */
function initSprites(img) {

    shipSprite = [
        new Sprite(img, 262, 8, 56, 30),
        new Sprite(img, 262, 48, 56, 30),
        new Sprite(img, 262, 89, 56, 30),
        new Sprite(img, 262, 129, 56, 30),
        new Sprite(img, 262, 169, 56, 30)
    ];
    backgroundAsteroidSprite = [
        new Sprite(img, 362, 172, 25, 25),
        new Sprite(img, 394, 170, 18, 16),
        new Sprite(img, 413, 182, 17, 15)
    ];
    foregroundAstroidSprite = [
        new Sprite(img, 372,15,23,23),
        new Sprite(img, 368,49,40,39),
        new Sprite(img, 361,92,62,64)

    ];
    foregroundAsteroidSpriteHit = [
        new Sprite(img, 398,15,23,23),
        new Sprite(img, 412,49,40,39),
        new Sprite(img, 427,92,62,64)
    ];
    scoreBannerSprite = new Sprite(img, 0,257,320,41);
    largeNumberSprite = [
        new Sprite(img, 4,298,14,21),
        new Sprite(img, 27,298,14,21),
        new Sprite(img, 49,298,14,21),
        new Sprite(img, 72,298,14,21),
        new Sprite(img, 95,298,14,21),
        new Sprite(img, 118,298,14,21),
        new Sprite(img, 141,298,14,21),
        new Sprite(img, 164,298,14,21),
        new Sprite(img, 187,298,14,21),
        new Sprite(img, 210,298,14,21)
    ];
    splashScreenSprite = new Sprite(img, 5,8,252,244);



    var bgImg = new Image();
    bgImg.src = "images/space.jpg";
    backgroundSprite = new Sprite(bgImg, 0, 0, 256, 256);


    textSprites = {
        splash: new Sprite(img, 358,203, 208, 111),
        topScore: new Sprite(img, 3, 326, 68, 16),
        playerScore: new Sprite(img, 3, 345, 76, 16),
        gameOver: new Sprite(img, 3, 363, 188, 28)
    };



    okButtonSprite = new Sprite(img, 237, 379, 82, 31);
    clickButtonSprite = new Sprite(img, 237, 347, 82, 31);
    tapButtonSprite = new Sprite(img, 315, 347, 82, 31);

    scoreSprite = new Sprite(img, 138, 56, 113, 58);

}