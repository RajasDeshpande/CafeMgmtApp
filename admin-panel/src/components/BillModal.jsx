import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

export default function BillModal({ orderId, onClose }) {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await orderAPI.getBill(orderId);
        setBill(res.data);
      } catch (err) {
        console.error('Failed to fetch bill:', err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchBill();
  }, [orderId]);

  if (!orderId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Bill — Order #{bill?.order?.orderNumber}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {loading ? (
          <div className="modal-loading">Loading bill...</div>
        ) : bill ? (
          <>
            <div className="bill-preview">
              <pre>{bill.billText}</pre>
            </div>
            <div className="modal-actions">
              {bill.whatsappLink ? (
                <a href={bill.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                  📱 Send via WhatsApp
                </a>
              ) : (
                <p className="bill-note">No phone number provided. Share the bill manually.</p>
              )}
              <button className="btn-copy" onClick={() => {
                navigator.clipboard.writeText(bill.billText);
                alert('Bill copied to clipboard!');
              }}>
                📋 Copy Bill
              </button>
            </div>
          </>
        ) : (
          <p>Failed to load bill.</p>
        )}
      </div>
    </div>
  );
}
