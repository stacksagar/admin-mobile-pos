import { useRef } from 'react';
import Editor from 'suneditor-react';
import { SunEditorReactProps } from 'suneditor-react/dist/types/SunEditorReactProps';
import SunEditorCore from 'suneditor/src/lib/core';

interface props extends SunEditorReactProps {
  loading?: boolean;
  styles?: string;
}

export default function SunEditorReadOnly({ styles, ...props }: props) {
  const editor = useRef<SunEditorCore>();
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };
  if (props.loading) return <h3>Loading...</h3>;

  return (
    <div className="readonlyeditor w-full">
      <Editor
        {...props}
        getSunEditorInstance={getSunEditorInstance}
        setDefaultStyle={`font-size:20px; font-family:arial; ${styles}`}
        disableToolbar={true}
        hideToolbar={true}
        readOnly={true}
        autoFocus={false}
      />
    </div>
  );
}
