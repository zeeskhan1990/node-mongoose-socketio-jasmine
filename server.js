const express = require('express')
const bodyParser = require('body-parser')
const app = express()

/**
 * To use socket io, we would need to create a standard http node server
 * and then share it with both socket io & express. We cannot directly serve
 * our backend with express any longer. Node http server is to be used for
 * both socket & express to run
 */
const http = require('http').Server(app)
const io = require('socket.io')(http)

let messages = [
    {name: 'Tim', message: 'Hi'},
    {name: 'Brown', message: 'Hello Test'}
]

app.use(express.static(__dirname))
//This lets body parser know that we expect json to be coming in through the request
app.use(bodyParser.json())
//We need to do this because the request that comes in from browswer is url-encoded
app.use(bodyParser.urlencoded({extended: false}))

app.get('/messages', (req, res) => res.send(messages))
app.post('/messages', (req, res) => {
    messages.push(req.body)
    //Add a new message on every new push
    io.emit('message', req.body)
    res.status(200).send(req.body)
})

io.on("connection", (socket) => {
    console.log("User connected")
})

const server = http.listen(3000, () => {
    console.log(server.address())
})