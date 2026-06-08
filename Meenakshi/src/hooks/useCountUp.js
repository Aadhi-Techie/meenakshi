import { useState, useEffect } from "react";

export default function useCountUp(target, go, dur = 1800) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!go) return;
    const step = Math.ceil(target / (dur / 16));
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      setN(cur);
      if (cur >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [go, target, dur]);
  return n;
}