import React from 'react';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';

interface MilkdownEditorProps {
  initialContent: string;
}

const InnerEditor: React.FC<MilkdownEditorProps> = ({ initialContent }) => {
  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, initialContent);
      })
      .use(commonmark);
  }, [initialContent]);

  return <Milkdown />;
};

export const MilkdownEditorWrapper: React.FC<MilkdownEditorProps> = ({ initialContent }) => {
  return (
    <MilkdownProvider>
      <div className="milkdown-wysiwyg-container">
        <InnerEditor initialContent={initialContent} />
      </div>
    </MilkdownProvider>
  );
};
