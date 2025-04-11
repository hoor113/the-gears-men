import prettyBytes from 'pretty-bytes';
import SHA256 from 'crypto-js/sha256';
import { TCrudFormField } from '@/base/crud-form-field.type';

export const removeEmptyKeys = (obj: any) => {
  const newObj: any = {};

  if (obj === null || obj === undefined) {
    return newObj;
  }
  Object.keys(obj).forEach((key) => {
    if (obj[key] instanceof Date) {
      newObj[key] = obj[key].toISOString();
      return;
    }

    if (obj[key] !== undefined && obj[key] !== '' && obj[key] !== null) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

export const convertFieldsToValues = (fields: TCrudFormField[]) => {
  return removeEmptyKeys(
    fields.reduce((acc, { name, defaultValue }) => {
      acc[name as string] = defaultValue;
      return acc;
    }, {} as any),
  );
};

export const resetFields = (fields: TCrudFormField[]) => {
  return fields.reduce((acc: any, { name }) => {
    acc[name as string] = null;
    return acc;
  }, {});
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

export const fileListToArray = (listFile: FileList) => {
  return Array.from(listFile);
};

export const getFileDetail = (value: File) => {
  const name = value.name;
  const parts = name.split('.');
  const extension = parts.pop() as string;
  const filenameWithoutExtension = parts.join('.');
  return {
    filename: filenameWithoutExtension,
    extension,
    size: value.size,
    sizeString: prettyBytes(value.size),
  };
};

export const toBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const blobToFile = (theBlob: Blob, fileName: string) => {
  return new File([theBlob], fileName, {
    lastModified: new Date().getTime(),
    type: theBlob.type,
  });
};

export const getTotalPage = (total: number, limit: number) => {
  let totalPage =
    total % limit === 0
      ? (total - (total % limit)) / limit
      : (total - (total % limit)) / limit + 1;
  totalPage = Number.isNaN(Number(totalPage)) ? 0 : Number(totalPage);
  return totalPage === 0 ? 1 : totalPage;
};


export const getErrorMessage = (message: string, err: any) => {
  let errormsg = message;
  if (err?.response?.data?.error?.message)
    errormsg = errormsg + ': ' + err?.response?.data?.error?.message;
  return errormsg;
};

export const hashUUIDTo8Char = (uuid: string) => {
  // Hash the UUID using SHA-256
  const hash = SHA256(uuid).toString();
    
  // Take the first 8 characters of the hash
  const hash8Char = hash.substring(0, 8);
  
  return hash8Char;

}



