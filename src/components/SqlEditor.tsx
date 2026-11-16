import React, { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql, SQLite } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { TableSchemaInfo } from '../types/sql';

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  schemas?: TableSchemaInfo[];
  height?: string;
}

export const SqlEditor: React.FC<SqlEditorProps> = ({
  value,
  onChange,
  onRun,
  schemas = [],
  height = '210px',
}) => {
  const extensions = useMemo(() => {
    const schemaDict: Record<string, string[]> = {};
    for (const tbl of schemas) {
      schemaDict[tbl.name] = tbl.columns.map((c) => c.name);
    }

    const runShortcut = keymap.of([
      {
        key: 'Mod-Enter',
        run: () => {
          onRun?.();
          return true;
        },
      },
    ]);

    return [
      sql({
        dialect: SQLite,
        schema: schemaDict,
        upperCaseKeywords: true,
      }),
      runShortcut,
    ];
  }, [schemas, onRun]);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/80 shadow-inner bg-[#282c34]">
      <CodeMirror
        value={value}
        height={height}
        theme={oneDark}
        extensions={extensions}
        onChange={(val) => onChange(val)}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          foldGutter: false,
          autocompletion: true,
          bracketMatching: true,
          closeBrackets: true,
        }}
      />
    </div>
  );
};
