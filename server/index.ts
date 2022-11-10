import { config as envConfig} from "dotenv"

import { createServer } from "http"

import express from "express"
import { Server } from "socket.io"
import helmet from "helmet"

import { roomSizeLimit, roomNameAttributes, nicknameAttributes, messageAttributes } from "@global/roomAttributes"

import type { ServerToClientEvents, ClientToServerEvents } from "@global/socketScheme"



interface InterServerEvents {
  ping(): void
}

interface SocketData {
  nickname: string
}



envConfig({
  path: "../.env"
})

const app = express(),
      httpServer = createServer(app),
      io = new Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
      >(httpServer, {
        serveClient: false,
      })

app.use(helmet())


if (process.env.NODE_ENV == "production") {
  const PUBLIC_PATH = __dirname + "/public/"

  app.use(express.static(PUBLIC_PATH))

  app.get("/*", (req, res) => {
    res.sendFile(PUBLIC_PATH + "index.html")
  })
}



io.on("connection", socket => {
  socket.on("roomAvailability", (room, callback) => {
    room = room.trim()

    if (!room) {
      return callback({
        error: "Room name not provided"
      })
    }

    if (room.length > roomNameAttributes.maxLength) {
      return callback({
        error: "Invalid room name"
      })
    }

    const roomData = io.sockets.adapter.rooms.get(room)

    callback(roomData ? {
      exists: true,
      joinable: roomData.size < roomSizeLimit
    } : {
      exists: false
    })
  })


  socket.on("nicknameAvailability", async(room, nickname, callback) => {
    room = room.trim()

    if (!room) {
      return callback({
        error: "Room name is required"
      })
    }

    if (room.length > roomNameAttributes.maxLength) {
      return callback({
        error: "Invalid room name"
      })
    }

    const clients = await io.in(room).fetchSockets(),
          joinable = clients.length < roomSizeLimit
    
    nickname = nickname.trim()
    
    callback(joinable ? {
      joinable: true,
      nickname: nickname.length > 0 && nickname.length <= nicknameAttributes.maxLength && !clients.some(({data}) => data.nickname == nickname)
    } : {
      joinable: false
    })
  })


  socket.on("joinChatRoom", async(room, nickname, callback) => {
    room = room.trim()

    if (!room) {
      return callback({
        error: "Room name is required"
      })
    }

    if (room.length > roomNameAttributes.maxLength) {
      return callback({
        error: "Invalid room name"
      })
    }

    nickname = nickname.trim()

    if (!nickname) {
      return callback({
        error: "Nickname is required"
      })
    }

    if (nickname.length > nicknameAttributes.maxLength) {
      return callback({
        error: "Invalid nickname"
      })
    }

    const clients = await io.in(room).fetchSockets()

    if (clients.length >= roomSizeLimit) {
      return callback({
        error: "The room is full"
      })
    }

    const users = clients.map(({data: {nickname}}) => nickname)

    if (users.includes(nickname)) {
      return callback({
        error: "Nickname has already been taken"
      })
    }

    socket.data.nickname = nickname
    socket.join(room)
    socket.to(room).emit("newUser", nickname)

    callback({ users })
  })


  socket.on("message", (room, msg, callback) => {
    room = room.trim()
    
    if (!room) {
      return callback({
        error: "Room name is required"
      })
    }

    if (room.length > roomNameAttributes.maxLength) {
      return callback({
        error: "Invalid room name"
      })
    }

    msg = msg.trim()

    if (!msg) {
      return callback({
        error: "Message is required"
      })
    }

    if (msg.length > messageAttributes.maxLength) {
      return callback({
        error: "Invalid message"
      })
    }

    socket.to(room).emit("message", {
      by: socket.data.nickname,
      value: msg
    })
  })


  socket.on("leaveChatRoom", room => {
    socket.leave(room)

    if (socket.data.nickname) {
      io.in(room).emit("userLeaves", socket.data.nickname)
    }
  })


  socket.on("disconnecting", () => {
    const [, ...rooms] = socket.rooms

    if (socket.data.nickname) {
      socket.to(rooms).emit("userLeaves", socket.data.nickname)
    }
  })
})



const PORT = process.env.SERVER_PORT || 3000

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
