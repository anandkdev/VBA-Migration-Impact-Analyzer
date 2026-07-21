'use client'

import React, { useEffect, useRef } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import { VBAFile } from '@/types/index'
import { useProjectStore } from '@/store/project-store'

const VBA_KEYWORDS = [
  'Sub', 'Function', 'End', 'If', 'Then', 'Else', 'ElseIf', 'For', 'Next', 'While', 'Wend',
  'Do', 'Loop', 'Select', 'Case', 'With', 'Private', 'Public', 'Friend', 'Static', 'Global',
  'Dim', 'As', 'Const', 'Type', 'Enum', 'Class', 'Property', 'Set', 'Let', 'Get',
  'Optional', 'ByRef', 'ByVal', 'ParamArray', 'And', 'Or', 'Not', 'Mod', 'Call',
  'Exit', 'GoTo', 'Resume', 'On', 'Error', 'Declare', 'Lib', 'Alias', 'Me', 'Nothing',
  'Empty', 'Null', 'True', 'False', 'New', 'Is', 'In', 'Like', 'Erase',
]

const VBA_BUILTINS = [
  'MsgBox', 'InputBox', 'Beep', 'Range', 'Cells', 'Selection', 'ActiveSheet',
  'Workbook', 'Worksheet', 'Application', 'ThisWorkbook', 'Debug', 'Err',
  'CreateObject', 'GetObject', 'Len', 'Mid', 'Left', 'Right', 'Trim', 'UCase',
  'LCase', 'Val', 'Str', 'CInt', 'CLng', 'CSng', 'CDbl', 'CBool', 'CDate',
  'CVar', 'CStr', 'Date', 'Now', 'Time', 'Hour', 'Minute', 'Second', 'Day',
  'Month', 'Year', 'IsDate', 'IsNumeric', 'IsEmpty', 'IsNull', 'IsError',
]

function registerVBALanguage(monaco: Monaco) {
  monaco.languages.register({ id: 'vba' })

  monaco.languages.setMonarchTokensProvider('vba', {
    keywords: VBA_KEYWORDS,
    builtins: VBA_BUILTINS,
    tokenizer: {
      root: [
        // Comments
        [/^'.*$/, 'comment'],
        [/\bREM\b.*$/, 'comment'],

        // Strings
        [/"(?:\\"|[^"])*"/, 'string'],

        // Keywords
        [/\b(?:Sub|Function|End|If|Then|Else|ElseIf|For|Next|While|Wend|Do|Loop|Select|Case|With|Private|Public|Friend|Static|Global|Dim|As|Const|Type|Enum|Class|Property|Set|Let|Get|Optional|ByRef|ByVal|ParamArray|And|Or|Not|Mod|Call|Exit|GoTo|Resume|On|Error|Declare|Lib|Alias|Me|Nothing|Empty|Null|True|False|New|Is|In|Like|Erase)\b/i, 'keyword'],

        // Built-in functions
        [/\b(?:MsgBox|InputBox|Beep|Range|Cells|Selection|ActiveSheet|Workbook|Worksheet|Application|ThisWorkbook|Debug|Err|CreateObject|GetObject|Len|Mid|Left|Right|Trim|UCase|LCase|Val|Str|CInt|CLng|CSng|CDbl|CBool|CDate|CVar|CStr|Date|Now|Time|Hour|Minute|Second|Day|Month|Year|IsDate|IsNumeric|IsEmpty|IsNull|IsError)\b/i, 'type'],

        // Numbers
        [/\d+(\.\d+)?/, 'number'],

        // Identifiers and function calls
        [/[A-Za-z_]\w*/, 'identifier'],

        // Whitespace
        [/\s+/, 'white'],

        // Operators
        [/[+\-*/%=<>!&|^~]/, 'operator'],
      ],
    },
  })

  monaco.editor.defineTheme('vba-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'type', foreground: '4EC9B0' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'operator', foreground: 'D4D4D4' },
    ],
    colors: {
      'editor.background': '#1E1E1E',
      'editor.foreground': '#D4D4D4',
      'editor.lineHighlightBackground': '#2D2D30',
      'editorLineNumber.foreground': '#858585',
    },
  })

  monaco.editor.defineTheme('vba-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '008000' },
      { token: 'string', foreground: 'A31515' },
      { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
      { token: 'type', foreground: '0070C1' },
      { token: 'number', foreground: '098658' },
      { token: 'operator', foreground: '000000' },
    ],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.foreground': '#000000',
      'editor.lineHighlightBackground': '#F3F3F3',
      'editorLineNumber.foreground': '#999999',
    },
  })
}

interface MonacoViewerProps {
  file: VBAFile | null
}

export function MonacoViewer({ file }: MonacoViewerProps) {
  const editorRef = useRef<any>(null)
  const decorationsRef = useRef<any>(null)
  const { activeLineNumber, activeMatchRange } = useProjectStore()

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor
    registerVBALanguage(monaco)
  }

  useEffect(() => {
    if (editorRef.current && activeLineNumber) {
      editorRef.current.revealLineInCenter(activeLineNumber)
      editorRef.current.setPosition({ lineNumber: activeLineNumber, column: 1 })
    }
  }, [activeLineNumber])

  useEffect(() => {
    if (!editorRef.current) return

    // Clear previous decorations
    if (decorationsRef.current) {
      editorRef.current.deltaDecorations(decorationsRef.current, [])
      decorationsRef.current = null
    }

    // Add new decorations if match range exists
    if (activeLineNumber && activeMatchRange) {
      const newDecorations = [
        {
          range: new (window as any).monaco.Range(
            activeLineNumber,
            activeMatchRange.start + 1,
            activeLineNumber,
            activeMatchRange.end + 1
          ),
          options: {
            inlineClassName: 'bg-yellow-400/40',
            isWholeLine: false,
          },
        },
      ]
      decorationsRef.current = editorRef.current.deltaDecorations([], newDecorations)
    }
  }, [activeLineNumber, activeMatchRange])

  if (!file) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground">
        <p className="text-sm">Select a file to view</p>
      </div>
    )
  }

  const getLanguage = (): string => {
    switch (file.type) {
      case 'sql':
        return 'sql'
      case 'json':
        return 'json'
      case 'xml':
        return 'xml'
      case 'bas':
      case 'cls':
      case 'frm':
        return 'vba'
      default:
        return 'plaintext'
    }
  }

  return (
    <Editor
      defaultValue={file.content}
      language={getLanguage()}
      theme={typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'vba-dark' : 'vba-light'}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        fontSize: 13,
        lineNumbersMinChars: 3,
        padding: { top: 16, bottom: 16 },
      }}
      onMount={handleEditorDidMount}
    />
  )
}
