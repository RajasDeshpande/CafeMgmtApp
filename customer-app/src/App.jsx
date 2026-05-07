import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import OrderStatus from './pages/OrderStatus';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order/:id" element={<OrderStatus />} />
          </Routes>
        </main>
        <Toaster position="bottom-center" />
      </BrowserRouter>
    </CartProvider>
  );
}
