export default class Texture {
    constructor(game, fn) {
        this.game = game;
        this.bitmapData = this.game.add.bitmapData(this.game.width, this.game.height);
        this.image = this.game.add.image(0, 0, this.bitmapData);
        this.draw(fn);
    }

    draw(fn) {
        return fn.call(this);
    }

    arc(x, y, r = 20, color = '255,255,255', a = 255) {
        this.bitmapData.context.beginPath();
        this.bitmapData.context.fillStyle = `rgba(${color}, ${a})`;
        this.bitmapData.context.arc(x, y, r, 0, 2 * Math.PI);
        this.bitmapData.context.fill();
        this.bitmapData.context.closePath();
    }

    arcClip(x, y, r = 15) {
        this.bitmapData.context.beginPath();
        this.bitmapData.context.arc(x, y, r, 0, 2 * Math.PI);
        this.bitmapData.context.clip();
        this.bitmapData.context.clearRect(0, 0, this.game.width, this.game.height);
        this.bitmapData.context.closePath();
    }

    fromCenter(fn, x, y) {
        return (...args) => {
            //console.log(args);
            //debugger;
            return fn.call(this, this.game.width / 2 + x, this.game.height / 2 + y, ...args);
        }
    }
}