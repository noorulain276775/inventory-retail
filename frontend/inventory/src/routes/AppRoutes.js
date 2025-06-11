// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductListPage from '../pages/ProductListPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProductListPage />} />
    </Routes>
  );
}
