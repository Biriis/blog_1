import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: 'html' | 'javascript';
}

const darkTheme = EditorView.theme({
  '&': {
    height: '300px',
    fontSize: '14px',
    maxWidth: '100%',
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4'
  },
  '.cm-content': {
    caretColor: '#fff',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    maxWidth: '100%'
  },
  '.cm-line': {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#fff'
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#264f78'
  },
  '.cm-panels': {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4'
  },
  '.cm-panels.cm-panels-top': {
    borderBottom: '1px solid #333'
  },
  '.cm-panels.cm-panels-bottom': {
    borderTop: '1px solid #333'
  },
  '.cm-searchMatch': {
    backgroundColor: '#72a1ff',
    color: '#fff'
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: '#6199ff',
    color: '#fff'
  },
  '.cm-activeLine': {
    backgroundColor: '#2d2d2d'
  },
  '.cm-selectionMatch': {
    backgroundColor: '#3a3055'
  },
  '.cm-matchingBracket, .cm-nonmatchingBracket': {
    backgroundColor: '#2d2d2d',
    outline: '1px solid #555'
  },
  '.cm-gutters': {
    backgroundColor: '#1e1e1e',
    color: '#858585',
    borderRight: '1px solid #333'
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#2d2d2d',
    color: '#d4d4d4'
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#999'
  },
  '.cm-tooltip': {
    border: '1px solid #333',
    backgroundColor: '#1e1e1e'
  },
  '.cm-tooltip .cm-tooltip-arrow:before': {
    borderTopColor: '#333',
    borderBottomColor: '#333'
  },
  '.cm-tooltip .cm-tooltip-arrow:after': {
    borderTopColor: '#1e1e1e',
    borderBottomColor: '#1e1e1e'
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: '#094771',
      color: '#fff'
    }
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: 'Monaco, Consolas, "Courier New", monospace'
  }
}, { dark: true });

const darkHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#569cd6' },
  { tag: tags.operator, color: '#d4d4d4' },
  { tag: tags.special(tags.variableName), color: '#dcdcaa' },
  { tag: tags.typeName, color: '#4ec9b0' },
  { tag: tags.atom, color: '#569cd6' },
  { tag: tags.number, color: '#b5cea8' },
  { tag: tags.definition(tags.variableName), color: '#9cdcfe' },
  { tag: tags.string, color: '#ce9178' },
  { tag: tags.special(tags.string), color: '#ce9178' },
  { tag: tags.comment, color: '#6a9955' },
  { tag: tags.variableName, color: '#9cdcfe' },
  { tag: tags.tagName, color: '#569cd6' },
  { tag: tags.bracket, color: '#d4d4d4' },
  { tag: tags.meta, color: '#569cd6' },
  { tag: tags.attributeName, color: '#9cdcfe' },
  { tag: tags.propertyName, color: '#9cdcfe' },
  { tag: tags.className, color: '#4ec9b0' },
  { tag: tags.labelName, color: '#569cd6' },
  { tag: tags.namespace, color: '#4ec9b0' },
  { tag: tags.macroName, color: '#d4d4d4' },
  { tag: tags.literal, color: '#569cd6' },
  { tag: tags.inserted, color: '#4ec9b0' },
  { tag: tags.deleted, color: '#f44747' },
  { tag: tags.link, color: '#569cd6', textDecoration: 'underline' },
  { tag: tags.heading, color: '#569cd6', fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
  { tag: tags.invalid, color: '#f44747' },
]);

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange,
  language = 'html'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const languageExtension = language === 'html' ? html() : javascript();

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        drawSelection(),
        highlightActiveLine(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        languageExtension,
        syntaxHighlighting(darkHighlightStyle),
        darkTheme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        })
      ]
    });

    const view = new EditorView({
      state,
      parent: editorRef.current
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [language]);

  return (
    <div>
      <div ref={editorRef} className="rounded-md overflow-hidden shadow-lg" />
    </div>
  );
};

export default CodeEditor;
