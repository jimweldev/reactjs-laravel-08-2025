import { useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { defaultModules, simpleModules } from '@/08_configs/react-quill.config';
import 'react-quill-new/dist/quill.snow.css';
import ReactQuillInsertImageDialog from './_dialogs/react-quill-insert-image-dialog';

// Define type for Quill instance
type QuillEditor = ReactQuill & {
  getEditor: () => ReactQuill;
};

interface ReactQuillEditorProps {
  type?: 'default' | 'simple';
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ReactQuillEditor = ({
  type = 'default',
  value,
  onChange,
  placeholder,
  className = '',
}: ReactQuillEditorProps) => {
  const quillRef = useRef<QuillEditor | null>(null);

  const [openReactQuillImageDialog, setOpenReactQuillImageDialog] =
    useState(false);
  const [selection, setSelection] = useState<ReactQuill.Range | null>(null);

  const modules = useMemo(
    () => ({
      ...(type === 'default' ? defaultModules : simpleModules),
      toolbar: {
        ...(type === 'default' ? defaultModules : simpleModules).toolbar,
        handlers: {
          image: () => {
            if (quillRef.current) {
              const quill = quillRef.current.getEditor();
              const range = quill.getSelection();
              if (range) setSelection(range);
              setOpenReactQuillImageDialog(true);
            }
          },
        },
      },
    }),
    [type],
  );

  return (
    <>
      <ReactQuill
        ref={quillRef}
        className={className}
        theme="snow"
        modules={modules}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      <ReactQuillInsertImageDialog
        open={openReactQuillImageDialog}
        setOpen={setOpenReactQuillImageDialog}
        ref={quillRef}
        selection={selection}
      />
    </>
  );
};

export default ReactQuillEditor;
