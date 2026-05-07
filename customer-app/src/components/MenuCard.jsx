import { useCart } from '../context/CartContext';
import { IoAddCircle, IoCheckmarkCircle } from 'react-icons/io5';
import toast from 'react-hot-toast';

export default function MenuCard({ item }) {
  const { items, addItem } = useCart();
  const isInCart = items.some(i => i._id === item._id);

  const handleAdd = () => {
    if (!item.inStock) {
      toast.error('This item is currently out of stock');
      return;
    }
    addItem(item);
    toast.success(`${item.name} added to cart!`, {
      icon: '☕',
      style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(212,175,55,0.3)' },
    });
  };

  return (
    <div className={`menu-card ${!item.inStock ? 'out-of-stock' : ''}`}>
      <div className="menu-card-image">
        <img src={item.image} alt={item.name} loading="lazy" />
        {!item.inStock && <div className="stock-overlay">Out of Stock</div>}
        <span className={`veg-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
          {item.isVeg ? '●' : '●'}
        </span>
      </div>
      <div className="menu-card-body">
        <h3 className="menu-card-title">{item.name}</h3>
        <p className="menu-card-desc">{item.description}</p>
        <div className="menu-card-footer">
          <span className="menu-card-price">₹{item.price}</span>
          <button
            className={`add-btn ${isInCart ? 'in-cart' : ''}`}
            onClick={handleAdd}
            disabled={!item.inStock}
          >
            {isInCart ? (
              <><IoCheckmarkCircle /> Added</>
            ) : (
              <><IoAddCircle /> Add</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
