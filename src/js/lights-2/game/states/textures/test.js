export default function () {
    this.bitmapData.context.beginPath();
    this.fromCenter(this.arc, 0, -50)(10, '255,0,0');
    this.fromCenter(this.arc, -50, 0)(10, '0,0,255');
    this.bitmapData.context.closePath();
}