import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import htmlParse from 'html-react-parser';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import DialogExtend from '@/components/dialog-extend';
import useTranslation from '@/hooks/use-translation';

export type TBasePrintFormProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  size?: 'A4' | 'A5';
};

const pageStyleA5 = `
@media print {
  body {
    zoom: 0.55
}
  @page {
    size: A5;
  }

}
`;
const pageStyleA4 = `
@media print {
  body {
    zoom: 0.8
  }
  @page {  
    size: A4;
  }
}
`;

const BasePrintForm = (props: TBasePrintFormProps) => {
  const { open, onClose, title, content, maxWidth = 'md', size = 'A4' } = props;
  const { t } = useTranslation();
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: size === 'A5' ? pageStyleA5 : pageStyleA4,
  });

  const wrappedContent = `<div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">${content}</div>`;

  return (
    <DialogExtend maxWidth={maxWidth} open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent ref={componentRef}>
        {content && htmlParse(wrappedContent)}
      </DialogContent>

      <DialogActions>
        {content && (
          <Button variant="contained" color="secondary" onClick={handlePrint}>
            {t('In')}
          </Button>
        )}
        <Button variant="text" color="inherit" onClick={onClose}>
          {t('Đóng')}
        </Button>
      </DialogActions>
    </DialogExtend>
  );
};

export default BasePrintForm;
