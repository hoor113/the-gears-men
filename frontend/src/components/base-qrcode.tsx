import { QRCodeCanvas } from 'qrcode.react';
import { useCallback, useEffect } from 'react';

export type TBaseQRCode = {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  logoSrc?: string;
  logoSize?: number;
  id?: string;
  nameFileDownload?: string;
  triggerDownload?: boolean;
};

const BaseQRCode = ({
  value,
  size = 128,
  bgColor = '#ffffff',
  fgColor = '#000000',
  level = 'M',
  includeMargin = true,
  logoSrc = '/assets/images/logo.png',
  logoSize = size / 10,
  id = 'base-qr-code',
  nameFileDownload = 'qr-code.png',
  triggerDownload = false,
}: TBaseQRCode) => {
  const downloadQRCode = useCallback(() => {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    const pngUrl = canvas
      ?.toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');

    downloadLink.href = pngUrl;
    downloadLink.download = nameFileDownload;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }, [id, nameFileDownload]);

  useEffect(() => {
    if (triggerDownload) {
      downloadQRCode();
    }
  }, [triggerDownload, downloadQRCode]);

  return (
    <QRCodeCanvas
      id={id}
      value={value}
      size={size}
      bgColor={bgColor}
      fgColor={fgColor}
      level={level}
      includeMargin={includeMargin}
      imageSettings={
        logoSize > 0
          ? {
              src: logoSrc,
              x: undefined,
              y: undefined,
              height: logoSize,
              width: logoSize,
              excavate: true,
            }
          : undefined
      }
    />
  );
};

export default BaseQRCode;
