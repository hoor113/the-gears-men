import { enqueueSnackbar } from 'notistack';
import { useCallback, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { httpService } from '@/base/http-service';

type TRTEProps = {
  readOnly?: boolean;
  value?: string;
  placeholder?: string;
  toolbar?: any[];
  onChange?: (_value: string) => void;
};

const RTE = ({ readOnly, toolbar, placeholder, ...rest }: TRTEProps) => {
  const quillRef = useRef<ReactQuill>(null);

  const imageHandler = useCallback(() => {
    const editor = quillRef.current?.getEditor();

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    const range = editor?.getSelection(true);

    input.onchange = async () => {
      const file = input.files;

      if (file && file[0]) {
        const res = await httpService.uploadFile({
          file: file[0],
        });

        const url = res.result.data;
        editor?.insertEmbed(range?.index as number, 'image', url);
      } else {
        enqueueSnackbar('Chưa chọn file', { variant: 'warning' });
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: toolbar || [
          [{ header: [1, 2, 3, 4, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ align: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ font: [] }],
          [{ color: [] }, { background: [] }],
          ['link', 'image'],
          ['clean'],
        ],

        handlers: {
          image: imageHandler,
        },
      },
    }),
    [toolbar, imageHandler],
  );

  return (
    <ReactQuill
      readOnly={readOnly || false}
      theme="snow"
      value={rest.value}
      onChange={rest.onChange}
      placeholder={placeholder}
      modules={modules}
    />
  );
};

export default RTE;
