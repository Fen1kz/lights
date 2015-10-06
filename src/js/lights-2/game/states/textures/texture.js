export default class Texture {
    constructor(game, fn) {
        this.game = game;
        this.bitmapData = this.game.add.bitmapData(this.game.width, this.game.height);
        this.image = this.game.add.image(0, 0, this.bitmapData);
        fn.call(this);
    }

    arc(x, y, r = 20) {
        this.bitmapData.context.beginPath();
        this.bitmapData.context.fillStyle = 'rgb(255,255,255)';
        this.bitmapData.context.arc(x, y, r, 0, 2 * Math.PI);
        this.bitmapData.context.fill();
        this.bitmapData.context.closePath();
    }

    arcFromCenter(x, y, r) {
        return this.arc(this.game.width / 2 + x, this.game.height / 2 + y, r);
    }
}