const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    email: String,
    text: String
});

const Message = mongoose.model('Message', messageSchema);

exports.createMessage = (inMail, inText) => {
    var message = new Message({
      email: inMail,
      text: inText
    })

    return message
}

exports.getAllMessages = async () => {
    let message = await Message.find({})
    return message
  }