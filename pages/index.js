import { useState, useEffect, useMemo } from 'react';

import Search from '../components/search';
import ProductCard from '../components/product-card';
import { useFetchProducts } from '../hooks/use-fetch-products';

export default function Home() {
  const { products, error } = useFetchProducts();

  const [term, setTerm] = useState('');
  const [localProducts, setLocalProducts] = useState([]);

  useEffect(() => {
    if (term === '') {
      setLocalProducts(products);
    } else {
      setLocalProducts(
        products.filter(({ title }) => {
          return title.toLowerCase().indexOf(term.toLowerCase()) > -1;
        }),
      );
    }
  }, [term, products]);

  const renderErrorMessage = () => {
    if (error) {
      return <h4 data-testid="error-message">error</h4>;
    }

    return null;
  };

  const renderProductCard = () => {
    if (localProducts.length === 0 && !error) {
      return <h4 data-testid="no-products">no products message</h4>;
    }

    return localProducts.map((i) => <ProductCard key={i.title} product={i} />);
  };

  const amountText = useMemo(() => {
    if (localProducts.length === 0 || localProducts.length === 1) {
      return `${localProducts.length} Product`;
    }

    return `${localProducts.length} Products`;
  }, [localProducts]);

  return (
    <main data-testid="product-list" className="my-8">
      <Search doSearch={(_term) => setTerm(_term)} />
      <div className="container mx-auto px-6">
        <h3 className="text-gray-700 text-2xl font-medium">Wrist Watch</h3>
        <span className="mt-3 text-sm text-gray-500">{amountText}</span>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {renderProductCard()}

          {renderErrorMessage()}
        </div>
      </div>
    </main>
  );
}
