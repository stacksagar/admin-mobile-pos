import Editor from 'suneditor-react';
import { SunEditorReactProps } from 'suneditor-react/dist/types/SunEditorReactProps';
import SunEditorCore from 'suneditor/src/lib/core';
import imageUpload from '../../utils/imageUpload';
import DefaultSketelon from '../Skeletons/DefaultSketelon';

interface props extends SunEditorReactProps {
  editor: React.MutableRefObject<SunEditorCore | undefined>;
  loading?: boolean;
}

export default function SunEditor({ editor, ...props }: props) {
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  function onImageUploadBefore(): any {
    return (
      files: File[],
      _info: object,
      _core: object,
      uploadHandler: Function
    ) => {
      (async () => {
        const data = await imageUpload(files[0]);
        const res = {
          result: [
            {
              url: data?.url,
              name: 'Thumbnail',
            },
          ],
        };

        uploadHandler(res);
      })();
      uploadHandler();
    };
  }

  if (props.loading) return <DefaultSketelon />;
  return (
    <div className="w-full">
      <Editor
        {...props}
        getSunEditorInstance={getSunEditorInstance}
        onImageUploadBefore={onImageUploadBefore()}
        setOptions={{
          defaultStyle:
            'font-size: 16px; font-family: arial; font-weight: normal;',
          buttonList: [
            ['fontSize', 'formatBlock'],
            [
              'bold',
              'underline',
              'italic',
              'strike',
              'subscript',
              'superscript',
            ],
            ['align', 'horizontalRule', 'list', 'table'],
            ['fontColor', 'hiliteColor'],
            ['outdent', 'indent'],
            ['link', 'image', 'video'],
            ['preview', 'print'],
            ['fullScreen', 'showBlocks', 'codeView'],
          ],
        }}
      />
    </div>
  );
}
