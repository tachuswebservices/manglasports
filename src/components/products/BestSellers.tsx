import React, { useEffect, useState } from 'react';

export default function BestSellers() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.filter((p: any) => p.isHot)));
  }, []);

  // ... render best sellers from products ...
} 