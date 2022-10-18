import React, { useEffect } from 'react';
import * as Y from 'yjs';
import { yCollab } from 'y-codemirror.next';
import { WebrtcProvider } from 'y-webrtc';
import ReactCodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export const usercolors = [
  { color: '#30bced', light: '#30bced33' },
  { color: '#6eeb83', light: '#6eeb8333' },
  { color: '#ffbc42', light: '#ffbc4233' },
  { color: '#ecd444', light: '#ecd44433' },
  { color: '#ee6352', light: '#ee635233' },
  { color: '#9ac2c9', light: '#9ac2c933' },
  { color: '#8acb88', light: '#8acb8833' },
  { color: '#1be7ff', light: '#1be7ff33' },
];

export const userColor = usercolors[Math.floor(Math.random() * usercolors.length)];

const ydoc = new Y.Doc();
const provider = new WebrtcProvider('123', ydoc);
const ytext = ydoc.getText('codemirror');

const undoManager = new Y.UndoManager(ytext);

function CodeMirror() {
  useEffect(() => {
    provider.awareness.setLocalStateField('user', {
      name: `Anonymous ${Math.floor(Math.random() * 100)}`,
      color: userColor.color,
      colorLight: userColor.light,
    });

    return () => {
      provider?.destroy();
    };
  }, []);

  return (
    <ReactCodeMirror
      value={ytext.toString()}
      height="200px"
      extensions={[javascript({ jsx: true }), yCollab(ytext, provider.awareness, { undoManager })]}
    />
  );
}

export default CodeMirror;
