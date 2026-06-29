import { useState, useEffect } from 'react';

export default function useFetch(fetchFunction, ...args) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchFunction(...args)
      .then(result => {
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false; // Memory leak-ஐ தடுக்க
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFunction, JSON.stringify(args)]);

  return { data, loading, error };
}
