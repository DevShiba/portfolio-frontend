import { useCallback, useEffect, useRef } from "react";
import mitt, { type Emitter } from "mitt";

type Events = {
  "shader:running": void;
  "loader:end": void;
  "pointer:inactive": void;
  "overlay:hiding": void;
  "images:loaded": void;
};

const globalEmitter: Emitter<Events> = mitt<Events>();

export const useEmitter = () => {
  const once = useCallback((eventName: keyof Events, cb: () => void) => {
    const handler = () => {
      if (typeof cb === "function") cb();
      globalEmitter.off(eventName, handler);
    };
    globalEmitter.on(eventName, handler);
  }, []);

  return {
    ...globalEmitter,
    once,
  };
};
