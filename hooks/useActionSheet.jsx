import { useState, useCallback } from "react";

const useActionSheet = () => {
  const [isVisible, setIsVisible] = useState(false);

  const open = useCallback(() => {
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    isVisible,
    open,
    close,
  };
};

export default useActionSheet;
