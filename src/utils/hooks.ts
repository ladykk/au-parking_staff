import { Dispatch, SetStateAction, useEffect } from "react";

export const useUpdateFilePreview = (
  file: File | null | undefined,
  setPreview: Dispatch<SetStateAction<string>>
) => {
  useEffect(() => {
    // create the preview
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview("");
    }
  }, [file, setPreview]);
};

export function useTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    return () => {
      document.title = prevTitle;
    };
  });
}
