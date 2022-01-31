export interface Participant{
  id: string
  displayName: string
  memberType: number
  isVoted?: boolean | undefined
  voteResult?: number | undefined
}

export interface ParticipantsChange{
  affectedParticipant: Participant
  participants: Participant[]
}
