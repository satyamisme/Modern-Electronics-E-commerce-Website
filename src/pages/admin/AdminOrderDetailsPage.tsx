import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { OrderService } from '../../services/orderService';
import type { Database } from '../../lib/supabase';
import { useAdmin } from '../../context/AdminContext'; // For potential admin actions
import { useAuth } from '../../context/AuthContext'; // For permissions
import { formatKWD } from '../../utils/currency';
import { ArrowLeft, Edit3, Package, Truck, CheckCircle, XCircle, Calendar, User, MapPin, CreditCard, FileText, MessageSquare, Tag, ShoppingBag, Image } from 'lucide-react';

// Assuming OrderRow is the correct type from your services or types definition
type OrderRow = Database['public']['Tables']['orders']['Row'] & {
  order_items: (Database['public']['Tables']['order_items']['Row'] & {
    products: Pick<Database['public']['Tables']['products']['Row'], 'id' | 'name'> & {
      product_images: Pick<Database['public']['Tables']['product_images']['Row'], 'url' | 'is_primary'>[] | null;
    } | null;
  })[];
  profiles: Pick<Database['public']['Tables']['profiles']['Row'], 'full_name' | 'email' | 'phone'> | null;
};


const AdminOrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  // const { dispatch } = useAdmin(); // If needed for global admin state updates

  const [order, setOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newStatus, setNewStatus] = useState<OrderRow['status'] | ''>('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [adminNotes, setAdminNotes] = useState(''); // For adding new notes or displaying existing

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is missing.');
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const fetchedOrder = await OrderService.getOrder(orderId);
        if (fetchedOrder) {
          setOrder(fetchedOrder);
          setNewStatus(fetchedOrder.status || '');
          setTrackingNumber(fetchedOrder.tracking_number || '');
          setAdminNotes(fetchedOrder.admin_notes || '');
        } else {
          setError('Order not found.');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleUpdateStatus = async () => {
    if (!order || !newStatus || newStatus === order.status) return;
    try {
      const updatedOrder = await OrderService.updateOrderStatus(order.id, newStatus, adminNotes);
      setOrder(updatedOrder);
      // dispatch({ type: 'UPDATE_ORDER_IN_LIST', payload: updatedOrder }); // Example admin context update
      alert('Order status updated successfully!');
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status.');
    }
  };

  const handleAddTracking = async () => {
    if (!order || !trackingNumber || trackingNumber === order.tracking_number) return;
    try {
      const updatedOrder = await OrderService.addTrackingNumber(order.id, trackingNumber);
      setOrder(updatedOrder);
      // dispatch({ type: 'UPDATE_ORDER_IN_LIST', payload: updatedOrder });
      alert('Tracking number updated successfully!');
    } catch (err) {
      console.error('Error adding tracking number:', err);
      alert('Failed to add tracking number.');
    }
  };

  // Helper to get primary image URL
  const getPrimaryImageUrl = (orderItem: OrderRow['order_items'][0]): string => {
    if (orderItem.products && orderItem.products.product_images && orderItem.products.product_images.length > 0) {
      const primaryImage = orderItem.products.product_images.find(img => img.is_primary);
      if (primaryImage && primaryImage.url) return primaryImage.url;
      // Fallback to the first image if no primary is marked
      if (orderItem.products.product_images[0] && orderItem.products.product_images[0].url) {
        return orderItem.products.product_images[0].url;
      }
    }
    return '/placeholder-image.svg'; // Default placeholder
  };


  if (loading) {
    return <div className="p-8 text-center">Loading order details...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!order) {
    return <div className="p-8 text-center">Order not found.</div>;
  }

  const canUpdateOrder = user?.permissions?.includes('orders.update');

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center text-primary hover:underline"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Orders
        </button>
        {/* Add other actions like Print Invoice, Resend Confirmation if needed */}
      </div>

      <div className="bg-white shadow-xl rounded-lg">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Order #{order.order_number || order.id}</h1>
              <p className="text-gray-500 flex items-center mt-1">
                <Calendar size={16} className="mr-2" />
                Placed on: {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <div className={`mt-4 md:mt-0 px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center
              ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'}`}
            >
              {order.status === 'pending' && <Clock size={16} className="mr-1.5" />}
              {order.status === 'processing' && <Package size={16} className="mr-1.5" />}
              {order.status === 'shipped' && <Truck size={16} className="mr-1.5" />}
              {order.status === 'delivered' && <CheckCircle size={16} className="mr-1.5" />}
              {order.status === 'cancelled' && <XCircle size={16} className="mr-1.5" />}
              Status: <span className="font-semibold ml-1">{order.status?.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Items & Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items List */}
            <div className="bg-gray-50 rounded-lg p-2 sm:p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><ShoppingBag size={20} className="mr-2 text-primary"/>Items Ordered</h2>
              <div className="space-y-4">
                {order.order_items.map(item => (
                  <div key={item.id} className="flex items-start sm:items-center space-x-3 p-3 bg-white rounded-md shadow-sm">
                    <img
                      src={getPrimaryImageUrl(item)}
                      alt={item.products?.name || 'Product Image'}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border border-gray-200"
                      onError={(e) => (e.currentTarget.src = '/placeholder-image.svg')}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base">{item.products?.name || 'N/A'}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">SKU: {item.product_sku || 'N/A'}</p>
                      <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity} x {formatKWD(item.unit_price || 0)}</p>
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-gray-800 whitespace-nowrap">
                      {formatKWD((item.unit_price || 0) * (item.quantity || 0))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><FileText size={20} className="mr-2 text-primary"/>Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal:</span> <span className="font-medium">{formatKWD(order.subtotal || 0)}</span></div>
                <div className="flex justify-between"><span>Shipping:</span> <span className="font-medium">{formatKWD(order.shipping_cost || 0)}</span></div>
                <div className="flex justify-between"><span>Tax (0%):</span> <span className="font-medium">{formatKWD(order.tax_amount || 0)}</span></div>
                <hr className="my-2"/>
                <div className="flex justify-between text-lg font-bold text-gray-800"><span>Grand Total:</span> <span>{formatKWD(order.total_amount || 0)}</span></div>
              </div>
            </div>

            {/* Admin Notes - Display and Edit */}
            {canUpdateOrder && (
            <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center"><Edit3 size={20} className="mr-2 text-primary"/>Admin Notes</h2>
                <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes for this order..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    rows={3}
                    disabled={!canUpdateOrder}
                />
                <p className="text-xs text-gray-500 mt-1">These notes are for internal use and not visible to the customer. Changes are saved when updating order status.</p>
            </div>
            )}
          </div>

          {/* Right Column: Customer, Addresses, Payment, Actions */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><User size={18} className="mr-2 text-primary"/>Customer</h3>
              <p className="text-sm text-gray-600"><strong>Name:</strong> {order.profiles?.full_name || 'N/A'}</p>
              <p className="text-sm text-gray-600"><strong>Email:</strong> {order.profiles?.email || 'N/A'}</p>
              <p className="text-sm text-gray-600"><strong>Phone:</strong> {order.profiles?.phone || 'N/A'}</p>
              {order.user_id && <Link to={`/admin/users/${order.user_id}`} className="text-sm text-primary hover:underline mt-1 block">View Customer Profile</Link>}
            </div>

            {/* Shipping Address */}
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><MapPin size={18} className="mr-2 text-primary"/>Shipping Address</h3>
              <address className="text-sm text-gray-600 not-italic">
                {(order.shipping_address as any)?.name && <p><strong>{(order.shipping_address as any)?.name}</strong></p>}
                <p>{(order.shipping_address as any)?.address_line1 || 'N/A'}</p>
                {(order.shipping_address as any)?.address_line2 && <p>{(order.shipping_address as any)?.address_line2}</p>}
                <p>{(order.shipping_address as any)?.city}, {(order.shipping_address as any)?.state_province_region} {(order.shipping_address as any)?.postal_zip_code}</p>
                <p>{(order.shipping_address as any)?.country || 'Kuwait'}</p>
                {(order.shipping_address as any)?.phone && <p>Phone: {(order.shipping_address as any)?.phone}</p>}
              </address>
            </div>

            {/* Billing Address (if different) */}
            {/* Consider adding logic to compare shipping and billing and only show if different */}
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><MapPin size={18} className="mr-2 text-primary"/>Billing Address</h3>
              <address className="text-sm text-gray-600 not-italic">
                {(order.billing_address as any)?.name && <p><strong>{(order.billing_address as any)?.name}</strong></p>}
                <p>{(order.billing_address as any)?.address_line1 || 'N/A'}</p>
                {(order.billing_address as any)?.address_line2 && <p>{(order.billing_address as any)?.address_line2}</p>}
                <p>{(order.billing_address as any)?.city}, {(order.billing_address as any)?.state_province_region} {(order.billing_address as any)?.postal_zip_code}</p>
                <p>{(order.billing_address as any)?.country || 'Kuwait'}</p>
                {(order.billing_address as any)?.phone && <p>Phone: {(order.billing_address as any)?.phone}</p>}
              </address>
            </div>

            {/* Payment Details */}
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center"><CreditCard size={18} className="mr-2 text-primary"/>Payment</h3>
              <p className="text-sm text-gray-600"><strong>Method:</strong> {order.payment_method || 'N/A'}</p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong>
                <span className={`ml-1 font-medium px-2 py-0.5 rounded-full text-xs
                  ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                    order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.payment_status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'}`}>
                  {order.payment_status?.toUpperCase() || 'N/A'}
                </span>
              </p>
              {order.payment_transaction_id && <p className="text-sm text-gray-600"><strong>Transaction ID:</strong> {order.payment_transaction_id}</p>}
            </div>

            {/* Customer Notes */}
            {order.customer_notes && (
              <div className="bg-white shadow rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><MessageSquare size={18} className="mr-2 text-primary"/>Customer Notes</h3>
                <p className="text-sm text-gray-600 italic">"{order.customer_notes}"</p>
              </div>
            )}

            {/* Actions */}
            {canUpdateOrder && (
              <div className="bg-white shadow rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Admin Actions</h3>
                {/* Update Status */}
                <div>
                  <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-1">Update Order Status</label>
                  <div className="flex space-x-2">
                    <select
                      id="orderStatus"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as OrderRow['status'])}
                      className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={handleUpdateStatus}
                      disabled={newStatus === order.status}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                    >
                      Update
                    </button>
                  </div>
                </div>

                {/* Tracking Number */}
                <div>
                  <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="trackingNumber"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                    <button
                      onClick={handleAddTracking}
                      disabled={trackingNumber === (order.tracking_number || '')}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                  {order.shipped_at && <p className="text-xs text-gray-500 mt-1">Shipped on: {new Date(order.shipped_at).toLocaleDateString()}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailsPage;
