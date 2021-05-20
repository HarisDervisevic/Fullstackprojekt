const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    email: String,
    text: String,
    city: String
});

const Message = mongoose.model('Message', messageSchema);

exports.createMessage = (inMail, inText, inCity) => {
    var message = new Message({
      email: inMail,
      text: inText,
      city: inCity
    })

    return message
}

exports.getAllMessages = async () => {
    let message = await Message.find({})
    return message
  }