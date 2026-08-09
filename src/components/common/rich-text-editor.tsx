'use client';

import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync editor content with outer value (only when it's different to prevent resetting cursor position)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-950 focus-within:ring-1 focus-within:ring-zinc-400 focus-within:border-zinc-400 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-1.5 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-150 rounded"
          onClick={() => execCommand('bold')}
          title="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-150 rounded"
          onClick={() => execCommand('italic')}
          title="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-150 rounded"
          onClick={() => execCommand('underline')}
          title="Underline"
        >
          <Underline className="h-3.5 w-3.5" />
        </Button>
        <div className="w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 self-stretch" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-150 rounded"
          onClick={() => execCommand('insertUnorderedList')}
          title="Bullet List"
        >
          <List className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-150 rounded"
          onClick={() => execCommand('insertOrderedList')}
          title="Numbered List"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </Button>
        <div className="w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 self-stretch" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-150 rounded"
          onClick={() => execCommand('formatBlock', 'h2')}
          title="Heading 1"
        >
          <Heading1 className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-150 rounded"
          onClick={() => execCommand('formatBlock', 'h3')}
          title="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-3 min-h-[140px] focus:outline-hidden text-xs prose prose-sm dark:prose-invert max-w-none"
      />
    </div>
  );
}
