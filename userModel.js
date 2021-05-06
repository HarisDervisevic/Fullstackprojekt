const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

exports.createUser = (inMail, inPassword) => {
    var user= new User({
      email: inMail,
      password: inPassword,
    })

    return user
}

exports.getUser = async function(uEmail) {
    return await User.findOne({email : uEmail});
  };

  exports.getAllUsers = async () => {
    let user = await User.find({})
    return user
}