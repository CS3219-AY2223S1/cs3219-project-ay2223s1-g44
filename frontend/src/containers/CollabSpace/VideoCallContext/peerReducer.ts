// Ref: https://www.youtube.com/watch?v=IkNaQZG2Now
import Peer from 'peerjs';
import {
  ADD_PEER,
  REMOVE_PEER,
} from './peerActions';

export type PeerState = Record<string, { stream: MediaStream; peer: Peer }>;
type PeerAction =
    | {
      type: typeof ADD_PEER;
      payload: { peerId: string; stream: MediaStream, peer: Peer };
    }
    | {
      type: typeof REMOVE_PEER;
      payload: { peerId: string };
    };

export const peersReducer = (state: PeerState, action: PeerAction) => {
  switch (action.type) {
    case ADD_PEER:
      return {
        ...state,
        [action.payload.peerId]: {
          stream: action.payload.stream,
          peer: action.payload.peer,
        },
      };
    case REMOVE_PEER:
      // eslint-disable-next-line no-case-declarations
      const { [action.payload.peerId]: removed, ...rest } = state;
      // eslint-disable-next-line no-case-declarations

      console.log(removed);

      // removed.peer.off();
      // eslint-disable-next-line no-case-declarations
      Object.values({ ...rest }).forEach((otherPlayer: {
        stream: MediaStream;
        peer: Peer;
      }) => {
        /*
        TODO: properly disconnection the peer from the room after peer leaves, and remove stream
        suggestion. destroy peer after user disconnects from call, and create a new one
        upon user joining the call again
        */
        if (removed) {
          removed.stream.getTracks().forEach((track) => {
            otherPlayer.stream.removeTrack(track);
          });
          otherPlayer.stream.getTracks().forEach((track) => {
            removed.stream.removeTrack(track);
          });
        }
      });

      return { ...rest };
    default:
      return { ...state };
  }
};
