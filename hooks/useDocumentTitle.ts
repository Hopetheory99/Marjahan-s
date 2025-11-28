
import { useEffect } from 'react';
import { CONFIG } from '../config';

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | ${CONFIG.APP_NAME}`;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
