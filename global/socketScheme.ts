export interface ChatEvent {
  value: string
  by?: string
  date?: Date
}


export interface ErrorCallback {
  error: string
}


export interface ServerToClientEvents {
  newUser(name: string): void

  message(event: ChatEvent): void

  userLeaves(name: string): void
}


export interface ClientToServerEvents {
  roomAvailability(name: string, callback: (response: ErrorCallback | {
    exists: false
  } | {
    exists: true
    joinable: boolean
  }) => void): void

  nicknameAvailability(room: string, nickname: string, callback: (response: {
    joinable: true
    nickname: boolean
  } | {
    joinable: false
  }) => void): void

  joinChatRoom(room: string, nickname: string, callback: (response: ErrorCallback | {
    users: string[]
  }) => void): void

  message(room: string, message: string, callback: (response: ErrorCallback) => void): void

  leaveChatRoom(room: string): void
}