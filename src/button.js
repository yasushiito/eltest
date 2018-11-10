export default class Button {
  constructor(caption, image) {
    this.caption = caption;
    this.image = image;
  }

  html() {
    return '<li><img src="./build/twitter.png">' + this.caption + '</li>';
  }
}