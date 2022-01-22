export interface RoomRequest{
  DisplayName: string
  RoomPassword: string|undefined
}

export interface JoinRoomRequest extends RoomRequest{
  RoomId: string
}
