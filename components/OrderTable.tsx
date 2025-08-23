
import React from 'react';
import { Order, OrderStatus } from '../types';
import { useAppContext } from '../context/AppContext';

interface OrderTableProps {
  orders: Order[];
}

const statusColorMap: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [OrderStatus.InProgress]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [OrderStatus.Shipped]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [OrderStatus.Delivered]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    [OrderStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
    const { updateOrderStatus } = useAppContext();

    const handleSimulateWebhook = (orderId: string) => {
        const statuses = Object.values(OrderStatus);
        const currentStatus = orders.find(o => o.id === orderId)?.status || OrderStatus.Pending;
        const currentIndex = statuses.indexOf(currentStatus);
        const nextIndex = (currentIndex + 1) % statuses.length;
        updateOrderStatus(orderId, statuses[nextIndex]);
    }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Orders</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">Order ID</th>
                    <th scope="col" className="px-6 py-3">Customer</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Total</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{order.id}</td>
                    <td className="px-6 py-4">{order.customerName}</td>
                    <td className="px-6 py-4">{order.date}</td>
                    <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[order.status]}`}>
                            {order.status}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                       <button onClick={() => handleSimulateWebhook(order.id)} className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline text-xs">Simulate Webhook</button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default OrderTable;
