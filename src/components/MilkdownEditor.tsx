import React from 'react';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { Editor, rootCtx, defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core';
import { gfm } from '@milkdown/preset-gfm';
import { nord } from '@milkdown/theme-nord';

interface MilkdownEditorProps {
  initialContent: string;
}

const InnerEditor: React.FC<MilkdownEditorProps> = ({ initialContent }) => {
  const { loading } = useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, initialContent);
        // Make it clean, no border, nice placeholder
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: {
            class: 'milkdown-wysiwyg-editor prose prose-invert focus:outline-none',
          },
        }));
      })
      .config(nord)
      .use(gfm);
  }, [initialContent]);

  if (loading) {
    return <div className="milkdown-loading">Summoning Editor...</div>;
  }

  return <Milkdown />;
};

export const MilkdownEditorWrapper: React.FC<MilkdownEditorProps> = ({ initialContent }) => {
  return (
    <MilkdownProvider>
      <InnerEditor initialContent={initialContent} />
    </MilkdownProvider>
  );
};
