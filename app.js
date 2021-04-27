const express = require('express')
const dbmodule = require('./dbmodule')
const MessageModel = require('./MessageModel')
const app = express()
const port = 3000

const clientDir = __dirname + "\\client\\"

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(clientDir))

app.set('view engine', 'ejs')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

app.get('/', (req, res) => res.sendFile(__dirname + "\\client\\Home.html"))

app.get('/blogg',async (req,res) => {
  const allMessages = await MessageModel.getAllMessages()
  res.render('blogg.ejs', { message : allMessages});
 });

app.post('/blogg', async (req, res) => {
  const message = await MessageModel.createMessage(req.body.email, req.body.message)
  await dbmodule.store(message)
  res.redirect('/blogg')
})

const logger = function (req, res, next) {
  console.log('')
  next()
}

app.use(logger)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
}) 