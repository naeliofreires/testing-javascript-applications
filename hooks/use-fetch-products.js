import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchProducts = () => {
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('/api/products')
      .then((response) => setProducts(response.data.products))
      .catch(() => setError(true));

    return () => {
      setError(false);
      setProducts([]);
    };
  }, []);

  return { products, error };
};
