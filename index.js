require("dotenv").config()


const express = require("express")
const helmet = require("helmet")


const app = express()
const server = require("http").createServer(app)
const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
})

app.use(express.static("public"))

app.use(helmet())

app.get("/*", (req,res) => {
  res.sendFile(__dirname+"/public/index.html")
})


const rooms = {}

io.on("connection", socket => {
  // Home
  socket.on("check_roomname", name => {
    socket.emit("roomname_available", !rooms.hasOwnProperty(name))
  })
  //
  // Form Room
  var room;
  socket.on("RoomName", name => {
    room = name
  })
  socket.on("check_nickname", name => {
    var bool;
    try {
      bool = !rooms[room].users.includes(name)
    } catch {
      bool = true
    }
    socket.emit("nickname_available", bool)
  })
  //
  // Chat Room
  var nick;
  socket.on("JoinRoom", name => {
    nick = name
    if (rooms.hasOwnProperty(room)) {
      rooms[room].users.push(nick)
    } else {
      rooms[room] = {
        users: [nick],
        messages: []
      }
    }
    socket.join(room)
    socket.emit("RoomData", rooms[room])
    socket.to(room).emit("NewUser", nick)
  })
  socket.on("message", msg => {
    const obj = {
      nick, msg
    }
    rooms[room].messages.push(obj)
    io.to(room).emit("NewMsg", obj)
  })
  function LeaveRoom() {
    try {
      rooms[room].users.splice(rooms[room].users.indexOf(nick),1)
      socket.to(room).emit("UserLeaves", nick)
      socket.leave(room)
      if (!rooms[room].users.length) {
        delete rooms[room]
      }
    } catch {
      console.log("AN ERROR OCURRED")
    }
  }
  socket.on("LeaveRoom", LeaveRoom)
  socket.on("disconnect", LeaveRoom)
  //
})


server.listen(process.env.PORT, () => {
  console.log(`App listening at http://localhost:${process.env.PORT}`)
})