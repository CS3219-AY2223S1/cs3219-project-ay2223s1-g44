import * as Automerge from "@automerge/automerge";

export type TextDoc = {
  text: Automerge.Text,
};

export type User = {
  id: string,
  username: string,
};

export type MatchData = {
  matchId: string,
  user: User,
}

export type Chat = {
  id: string,
  username?: string,
  content: string,
}