const express = require('express')
const http = require('http')
const socketIO = require('socket.io')


const port = process.env.PORT || 8000;
const app = express()
const server = http.createServer(app);

const io = socketIO(server)

io.on('connection', socket => {

  socket.on('leave', user => {
    console.log(`${user.display_name} entered room_${user.room_id}`)
    socket.leave(`room_${user.room_id}`)
    io.in(`room_${user.room_id}`).emit('leaveRoom', leaveMessage(user))
  })

  socket.on('enter', user => {
    console.log(`${user.display_name} left room_${user.room_id}`)
    socket.join(`room_${user.room_id}`);
    io.in(`room_${user.room_id}`).emit('joinRoom', joinMessage(user))
  })

  socket.on('sendMessage', message => {
    io.in(`room_${message.room_id}`).emit('receiveMessage', chatMessage(message))
  })
  
})
  
server.listen(port, () => console.log(`Listening on port ${port}`))

const chatMessage = (message) => {
  return {
    user_name: message.user.display_name,
    content: message.content
  }
}

const joinMessage = (user) => {
  return {
    content: `${user.display_name} has joined the room`
  }
}

const leaveMessage = (user) => {
  return {
    content: `${user.display_name} has left the room`
  }
}