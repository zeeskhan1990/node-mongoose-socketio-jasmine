const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongooose = require('mongoose')

/**
 * To use socket io, we would need to create a standard http node server
 * and then share it with both socket io & express. We cannot directly serve
 * our backend with express any longer. Node http server is to be used for
 * both socket & express to run
 */
const http = require('http').Server(app)
const io = require('socket.io')(http)

const dbUrl = 'mongodb+srv://admin:1234@cluster0-f0haz.mongodb.net/test?retryWrites=true&w=majority'

//create the Message model & define it's schema
const Message = mongooose.model('Message', {
    name: String,
    message: String
})

app.use(express.static(__dirname))
//This lets body parser know that we expect json to be coming in through the request
app.use(bodyParser.json())
//We need to do this because the request that comes in from browswer is url-encoded
app.use(bodyParser.urlencoded({extended: false}))

app.get('/messages', (req, res) => {
    Message.find({}).then((messages) => {
        res.send(messages)
    }).catch((err) => {
        console.log("Failed to retrieve messages", err)
    })
})

app.post('/messages', (req, res) => {
    const message = new Message(req.body)
    //Not to be done in real app, the message is saved and then deleted. A soft delete or not saving in the first place is better.
    message.save().then(() => {
        console.log("Saved")
        //Add a new message on every new push
        return Message.findOne({message: 'badword'})
    }).then((censored) => {
        const censorPromise = new Promise((resolve) => {
            if (censored) {
                console.log("Badword found")
                resolve(Message.deleteOne({_id: censored.id}))
                //return Message.remove({_id: censored.id})
            } else {
                //Emit message only if no badword
                io.emit('message', req.body)
                resolve()
            }  
        })
        return censorPromise
    }).then((deletedWord) => {
        if(deletedWord)
            console.log("Word Deleted is ", deletedWord)
        res.status(200).send(req.body)
    }).catch((err) => {
        console.log("Posting message failed ", err)
        res.sendStatus(500)
    })
})

io.on("connection", (socket) => {
    console.log("User Socket connected")
})

mongooose.connect(dbUrl, {useNewUrlParser: true}, (err) => {
    if (!!err)
        console.log("Connection failed", err)
})

const server = http.listen(3000, () => {
    console.log(server.address())
})