import { useEffect, useRef, useState } from "react";

function useResizeTimer() {
  const [resizing, setResizing] = useState(false);
  const [width, setWidth] = useState<number>();
  const resizeTimer = useRef<NodeJS.Timeout>();
  const setTimer = () => setTimeout(() => setResizing(false), 1000);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      if (width !== newWidth) {
        setWidth(newWidth);
        setResizing(true);

        if (resizeTimer && resizeTimer.current) {
          clearTimeout(resizeTimer.current);
        }
        resizeTimer.current = setTimer();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return resizing;
}

export default useResizeTimer;
