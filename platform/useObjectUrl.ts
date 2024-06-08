import { useState, useEffect } from "react";

export default function useObjectUrl(value: string) {
  const [objectUrl, setObjectUrl] = useState("");
  useEffect(() => {
    const newObjectURL = URL.createObjectURL(new Blob([value]));
    setObjectUrl(newObjectURL);
    return function cleanup() {
      URL.revokeObjectURL(newObjectURL);
      setObjectUrl("");
    };
  }, [value, setObjectUrl]);
  return objectUrl;
}
