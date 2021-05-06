const express = require('express')
const bcrypt = require('bcrypt')
const dbmodule = require('./dbmodule')
const userModel = require('./userModel')
const app = express()
const port = 4000

const clientDir = __dirname + "\\client\\"

app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(express.static(clientDir))

app.set('view engine', 'ejs')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

app.get('/', (req, res) => res.sendFile(__dirname + "\\client\\Home.html"))

app.get('/login',async (req,res) => {
  const allUsers = await userModel.getAllUsers()
  res.render('login.ejs', { users : allUsers});
 });

 app.get('/register',async (req,res) => {
  const allUsers = await userModel.getAllUsers()
  res.render('register.ejs', { users : allUsers});
 });

app.post('/login',async (req, res) => {
  const user = await userModel.getUser(req.body.email);
  await dbmodule.store(user)
  if(req.body.password === user.password) 
  res.redirect('/login')

})

app.post('/register',async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const user = await userModel.createUser(req.body.email, req.body.password)
  await dbmodule.store(user)
  res.redirect('/register')

})


const logger = function (req, res, next) {
  console.log('')
  next()
}

app.use(logger)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
}) 