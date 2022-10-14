import React, { useState } from 'react';

import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  onChange: any,
  language: string,
  code: string,
  theme: string | undefined,
}

function CodeEditorWindow({
  onChange, language, code, theme,
}: CodeEditorProps) {
  const [value, setValue] = useState(code || '');

  const handleEditorChange = (val: any) => {
    setValue(val);
    onChange('code', val);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width="100%"
        language={language || 'javascript'}
        value={value}
        theme={theme}
        defaultValue="// some comment"
        onChange={handleEditorChange}
      />
    </div>
  );
}

export default CodeEditorWindow;
