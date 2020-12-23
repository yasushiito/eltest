const Twitter = require('twitter');
const Messages = require('../main/messages');

export default class Tweet {
  constructor(auth){
    this.auth = auth;
  }

  post(message) {
    var params = {status: message};
    var client = new Twitter(this.auth);
    client.post('statuses/update', params, function(error, tweet, response) {
      if (error) {
      console.log(error);
        //console.log(response);
      }
    });
  }

  simple(messages, dictionary) {
    // メッセージの無駄な空白を取り除く
    // メッセージに句点を加える
    // コマンド行を処理する(現在ハッシュタグ変換のみ)
    // メッセージをできるだけ140文字に収まるように結合する 
    // ツイートが極力無駄のないように結合するがハッシュタグが別のツイートに分断されることはある 
    return Messages.joinMessages(Messages.replaceByDictionary(Messages.replaceTag(Messages.addPeriod(Messages.strippedMessages(messages))), dictionary), true);
  }

  clip(messages, dictionary) {
    return Messages.replaceByDictionary(Messages.replaceTag(Messages.addPeriod(Messages.trimedMessages(messages))), dictionary);
  }

  //1行ごとに分割されたメッセージを140文字単位にまとめて返す。
  join(messages) {
    return Messages.joinMessages(messages, true);
  }
}

