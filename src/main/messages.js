module.exports = class Messages {
  // 受け取った文字列内の余分なスペースを取り除く 
  static strippedMessage(message) {
    if (Messages.hasTag(message)) {
      return message;
    } else {
      return message.replace(/\s+/g, "");
    }
  }

  // 配列で受け取った文字列内の余分なスペースを取り除く 
  // ただしハッシュタグ行の時は処理しない
  static strippedMessages(messages) {
    return messages.map(function (value, index, array) { return Messages.strippedMessage(value)});
  }

  // 文字列に句点を加える ただしハッシュタグ行及び 末尾が!や?の時はくわえない  
  static addPeriod(messages) {
    return messages.map(function (value, index, array) { 
      if (Messages.hasTag(value)) {
        return value;
      } else {
        return value.replace(/([^!?])$/g, "$1。");
      }
    });
  }

  // 配列で受け取った文字列を140文字を超えないように結合していく 
  static joinMessages(messages, withCR = false) {
    var res = [];
    var msg = "";
    var work;
    for (let i = 0; i < messages.length; i++) {
      work = msg + messages[i];
      if (withCR) work += "\r\n";
      if (work.length > 140) {
        res.push(msg);
        msg = messages[i];
      } else {
        msg = work;
      }
    }
    res.push(msg);
    return res;
  }

  // ハッシュタグ行ならタグを配列で返す
  // ハッシュタグ行でなければfalseを返す 
  static hasTag(message) {
    if (!message.match(/^ハッシュタグ/)) return false;
    return message.replace(/^ハッシュタグ/, '').trim().split(/\s/);
  }

  // メッセージ配列を受け取り各行がハッシュタグ行ならすべてのタグに#をつけてメッセージ配列で返す 
  static replaceTag(messages) {
    var tags;
    return messages.map((message) => {
      if (!(tags = Messages.hasTag(message))) return message;
      return tags.map((value) => {return '#' + value;}).join("\n");
    });
  }

  static replaceByDictionary(messages, dictionary) {
    if (!dictionary) return messages;
    return messages.map((message) => {
      return dictionary.replace(message);
    });
  }
}
