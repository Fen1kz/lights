export default function (color, x, y) {
    return function () {
        this.arc(x, y, 10, color);
    }
}