export interface RoomRequest{
  displayName: string
  roomPassword: string|undefined
}

export interface JoinRoomRequest extends RoomRequest{
  roomId: string
}
