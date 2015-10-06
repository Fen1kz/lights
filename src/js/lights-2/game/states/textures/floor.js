export default function () {
    this.bitmapData.context.beginPath();
    this.bitmapData.context.fillStyle = 'rgb(128, 255, 128)';
    this.bitmapData.context.fillRect(0, 0, this.game.width, this.game.height);
    this.bitmapData.context.fill();
    this.bitmapData.context.strokeStyle = 'rgb(0, 128, 0)';
    for (let i = 50; i <= this.game.width; i += 50) {
        this.bitmapData.context.strokeRect(0, 0, i, this.game.height);
    }
    for (let i = 50; i <= this.game.height; i += 50) {
        this.bitmapData.context.strokeRect(0, 0, this.game.width, i);
    }
    this.bitmapData.context.closePath();
}