const express = require('express')
const bcrypt = require('bcryptjs')
const dbmodule = require('./dbmodule')
const MessageModel = require('./messageModel')
const userModel = require('./userModel')
const app = express()
const port = 3000

const clientDir = __dirname + "\\client\\"

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(clientDir))

app.set('view engine', 'ejs')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

app.get('/', async (req, res) => {
  res.render('home.ejs')
});

app.get('/home', async (req, res) => {
  const allUsers = await userModel.getAllUsers()
  res.render('home.ejs', { users: allUsers });
});

app.get('/city-reviews', async (req, res) => {
  const allMessages = await MessageModel.getAllMessages()
  const madridReviews = []
  const tokyoReviews = []
  for (let i = 0; i < allMessages.length; i++) {
    const element = allMessages[i];
    if(element.city === "Madrid")
    {
      madridReviews.push(element)
    }
    else if(element.city === "Tokyo")
    {
      tokyoReviews.push(element)
    }
  }
  res.render('city-reviews.ejs', { tokyoReviews: tokyoReviews, madridReviews: madridReviews});
});

app.post('/city-reviews-tokyo', async (req, res) => {
  const message = await MessageModel.createMessage(req.body.email, req.body.message, "Tokyo")
  await dbmodule.store(message)
  res.redirect('/city-reviews')
})

app.post('/city-reviews-madrid', async (req, res) => {
  const message = await MessageModel.createMessage(req.body.email, req.body.message, "Madrid")
  await dbmodule.store(message)
  res.redirect('/city-reviews')
})

app.post('/Home', async (req, res) => {
  res.redirect('/')
})



app.get('/login', async (req, res) => {
  const allUsers = await userModel.getAllUsers()
  res.render('login.ejs', { users: allUsers });
});


app.get('/register', async (req, res) => {
  const allUsers = await userModel.getAllUsers()
  res.render('register.ejs', { users: allUsers });
});


app.post('/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const user = await userModel.createUser(req.body.name, req.body.email, hashedPassword)
  await dbmodule.store(user)
  res.redirect('/register')
})

app.post('/login', async (req, res) => {
  const user = await userModel.getUser(req.body.email);
  console.log("Apa");
  await bcrypt.compare(req.body.password, user.password, (err, success) => {
    if (err) {
      console.log("err");      
      res.redirect('/login');
    }

    if (success) {
      console.log("Success");
      res.redirect('/city-reviews')
    }

    else {
      console.log("Fail")
      res.redirect('/login');
    }
  });
});

const logger = function (req, res, next) {
  console.log('')
  next()
}

app.use(logger)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})