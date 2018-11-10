import Button from './button';

export class Buttons {
  constructor(json) {
    this.items = json.items.map((args) => {return new Button(args.caption, args.image);});
  }

  html() {
    return this.items.map((item) => {return item.html();});
  }
};
