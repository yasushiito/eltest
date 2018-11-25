export default class Dictionary {
  constructor (words){
    this.words = words;
  }

  replace(message){
    for(let i = 0; i < this.words.length; i++) {
      message = message.split(this.words[i][0]).join(this.words[i][1]);
    }
    return message;
  }
  
}
