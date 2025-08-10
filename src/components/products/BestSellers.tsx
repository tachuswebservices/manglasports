import React, { useEffect, useState } from 'react';
import { buildApiUrl, API_CONFIG } from '@/config/api';

export default function BestSellers() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(buildApiUrl(API_CONFIG.PRODUCTS.BASE))
      .then(res => res.json())
      .then(data => setProducts(data.filter((p: any) => p.isHot)));
  }, []);

  // ... render best sellers from products ...
} 