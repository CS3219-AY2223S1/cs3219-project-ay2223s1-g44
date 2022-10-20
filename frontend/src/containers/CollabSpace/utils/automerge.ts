// Adapted from https://github.com/jonfk/text-crdt-experiment-automerge-ts

import DiffMatchPatch from 'diff-match-patch';
import * as Automerge from '@automerge/automerge';

export type TextDoc = {
  text: Automerge.Text;
};

export const changeTextDoc = (
  doc: Automerge.Doc<TextDoc>,
  updatedText: string,
): Automerge.Doc<TextDoc> => {
  // eslint-disable-next-line new-cap
  const dmp = new DiffMatchPatch.diff_match_patch();

  // Compute the diff:
  const diff = dmp.diff_main(doc.text.toString(), updatedText);
  // diff is simply an array of binary tuples representing the change
  // [[-1,"The ang"],[1,"Lucif"],[0,"e"],[-1,"l"],[1,"r"],[0," shall "],[-1,"fall"],[1,"rise"]]

  // This cleans up the diff so that the diff is more human friendly.
  dmp.diff_cleanupSemantic(diff);
  // [[-1,"The angel"],[1,"Lucifer"],[0," shall "],[-1,"fall"],[1,"rise"]]

  const patches = dmp.patch_make(doc.text.toString(), diff);
  // console.log(patches);

  // A patch object wraps the diffs along with some change metadata:
  //
  // [{
  //   "diffs":[[-1,"The angel"],[1,"Lucifer"],[0," shall "],[-1,"fall"], [1,"rise"]],
  //   "start1":0,
  //   "start2":0,
  //   "length1":20,
  //   "length2":18
  // }]

  // We can use the patch to derive the changedText from the sourceText
  // console.log(dmp.patch_apply(patches, doc.text.toString())[0]); // "Lucifer shall rise"

  // Now we translate these patches to operations against Automerge.Text instance:
  const newDoc = Automerge.change(doc, (doc1) => {
    patches.forEach((patch) => {
      let idx = patch.start1;
      if (idx !== null) {
        patch.diffs.forEach(([operation, changeText]) => {
          switch (operation) {
            case 1: // Insertion
              doc1.text.insertAt?.bind(doc1.text)!(
                idx!,
                ...changeText.split(''),
              );
              idx! += changeText.length;
              break;
            case 0: // No Change
              idx! += changeText.length;
              break;
            case -1: // Deletion
              for (let i = 0; i < changeText.length; i += 1) {
                doc1.text.deleteAt!(idx!);
              }
              break;
            default:
          }
        });
      }
    });
  });
  return newDoc;
};
