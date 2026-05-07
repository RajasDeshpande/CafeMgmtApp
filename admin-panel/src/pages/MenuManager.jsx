import { useState, useEffect, useRef } from 'react';
import { menuAPI } from '../services/api';
import toast from 'react-hot-toast';
import { IoAddCircleOutline, IoCreateOutline, IoTrashOutline, IoCloudUploadOutline, IoLinkOutline } from 'react-icons/io5';

const EMPTY_ITEM = { name: '', description: '', price: '', category: 'Beverages', image: '', isVeg: true, inStock: true };

export default function MenuManager() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_ITEM });
  const [uploadMode, setUploadMode] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchMenu = async () => {
    try {
      const res = await menuAPI.getAll();
      setItems(res.data);
    } catch (err) {
      toast.error('Failed to fetch menu');
    }
  };

  useEffect(() => { fetchMenu(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await menuAPI.update(editing, { ...form, price: Number(form.price) });
        toast.success('Item updated!');
      } else {
        await menuAPI.create({ ...form, price: Number(form.price) });
        toast.success('Item added!');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ ...EMPTY_ITEM });
      fetchMenu();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category, image: item.image, isVeg: item.isVeg, inStock: item.inStock });
    setEditing(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await menuAPI.delete(id);
      toast.success('Item deleted');
      fetchMenu();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleToggleStock = async (id) => {
    try {
      await menuAPI.toggleStock(id);
      fetchMenu();
    } catch (err) {
      toast.error('Failed to update stock');
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      return toast.error('File size must be less than 2MB');
    }
    
    setUploading(true);
    try {
      const res = await menuAPI.uploadImage(file);
      setForm({ ...form, image: res.data.imageUrl });
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const categories = ['Beverages', 'Snacks', 'Mains', 'Desserts'];

  return (
    <div className="menu-manager">
      <div className="page-header">
        <h1>Menu Manager</h1>
        <button className="btn-add" onClick={() => { setShowForm(true); setEditing(null); setForm({ ...EMPTY_ITEM }); }}>
          <IoAddCircleOutline /> Add Item
        </button>
      </div>

      {showForm && (
        <div className="menu-form-card">
          <h2>{editing ? 'Edit Item' : 'New Item'}</h2>
          <form onSubmit={handleSubmit} className="menu-form">
            <div className="form-row">
              <div className="form-group"><label>Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label>Price (₹)</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
            </div>
            <div className="form-group"><label>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={2} /></div>
            <div className="form-row">
              <div className="form-group"><label>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select></div>
              <div className="form-group">
                <div className="image-input-header">
                  <label>Image</label>
                  <button type="button" className="mode-toggle" onClick={() => setUploadMode(!uploadMode)}>
                    {uploadMode ? <><IoLinkOutline /> Use URL</> : <><IoCloudUploadOutline /> Upload</>}
                  </button>
                </div>
                {uploadMode ? (
                  <div 
                    className="upload-zone"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={(e) => handleFileUpload(e.target.files[0])} 
                      accept="image/jpeg, image/png, image/webp" 
                      hidden 
                    />
                    {uploading ? (
                      <div className="upload-state"><div className="loader small"></div><span>Uploading...</span></div>
                    ) : form.image ? (
                      <div className="upload-preview">
                        <img src={form.image} alt="Preview" />
                        <span>Click or drag to change</span>
                      </div>
                    ) : (
                      <div className="upload-state">
                        <IoCloudUploadOutline className="upload-icon" />
                        <span>Drag & drop or click to upload</span>
                        <small>Max 2MB (JPG, PNG, WEBP)</small>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="url-input-wrap">
                    <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                    {form.image && <img src={form.image} alt="Preview" className="url-preview" />}
                  </div>
                )}
              </div>
            </div>
            <div className="form-row">
              <label className="checkbox-label">
                <input type="checkbox" checked={form.isVeg} onChange={e => setForm({ ...form, isVeg: e.target.checked })} /> Vegetarian
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} /> In Stock
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-save">Save</button>
              <button type="button" className="btn-cancel" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="menu-table-wrap">
        <table className="menu-table">
          <thead>
            <tr><th>Item</th><th>Category</th><th>Price</th><th>Orders</th><th>Stock</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                <td>
                  <div className="menu-table-item">
                    {item.image && <img src={item.image} alt={item.name} className="menu-table-img" />}
                    <div>
                      <span className="menu-table-name">{item.isVeg ? '🟢' : '🔴'} {item.name}</span>
                      <small>{item.description.substring(0, 50)}...</small>
                    </div>
                  </div>
                </td>
                <td><span className="badge">{item.category}</span></td>
                <td className="price-cell">₹{item.price}</td>
                <td>{item.orderCount}</td>
                <td>
                  <button className={`stock-toggle ${item.inStock ? 'in' : 'out'}`} onClick={() => handleToggleStock(item._id)}>
                    {item.inStock ? 'In Stock' : 'Out'}
                  </button>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn-icon edit" onClick={() => handleEdit(item)}><IoCreateOutline /></button>
                    <button className="btn-icon delete" onClick={() => handleDelete(item._id)}><IoTrashOutline /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
