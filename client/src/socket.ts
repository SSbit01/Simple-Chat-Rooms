import { io, Socket } from "socket.io-client"
import type { ServerToClientEvents, ClientToServerEvents } from "@global/socketScheme"

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  autoConnect: false
})

export default socket
