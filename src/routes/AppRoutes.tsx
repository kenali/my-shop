import { Routes, Route } from 'react-router-dom';
import ProductsPage from '../pages/ProductsPage';
import ProductPage from '../pages/ProductPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
    </Routes>
  );
}
