import { useState, useEffect } from "react";

export default function useInView(ref, thr = 0.18) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: thr });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [ref, thr]);
  return v;
}