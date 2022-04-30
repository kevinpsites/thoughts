import { useEffect } from "react";
import { useState } from "react";

const useEffectAfterInitialLoad = (cb: Function, ...dep: any[]) => {
  const [initialLoadComplete, setInitialLoad] = useState(false);

  useEffect(() => {
    if (initialLoadComplete) {
      cb();
    }
    setInitialLoad(true);
  }, [...dep]);
};

export default useEffectAfterInitialLoad;
