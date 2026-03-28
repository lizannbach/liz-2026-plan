import { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  tag?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div';
  className?: string;
  multiline?: boolean;
}

export function EditableText({ value, onChange, tag: Tag = 'span', className = '', multiline = false }: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft.trim() && draft !== value) {
      onChange(draft.trim());
    } else {
      setDraft(value);
    }
  };

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
          className={`editable-field w-full resize-none ${className}`}
          rows={3}
        />
      );
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
        className={`editable-field w-full ${className}`}
      />
    );
  }

  return (
    <Tag
      className={`editable-field cursor-pointer ${className}`}
      onDoubleClick={() => setEditing(true)}
      title="Double-click to edit"
    >
      {value}
    </Tag>
  );
}
