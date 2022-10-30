// Ref: https://www.youtube.com/watch?v=IkNaQZG2Now

import Peer from 'peerjs';

export const ADD_PEER = 'ADD_PEER' as const;
export const REMOVE_PEER = 'REMOVE_PEER' as const;

export const addPeerAction = (peerId: string, stream: MediaStream, peer: Peer) => ({
  type: ADD_PEER,
  payload: { peerId, stream, peer },
});

export const removePeerAction = (peerId: string) => ({
  type: REMOVE_PEER,
  payload: { peerId },
});
