import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { API_BASE } from "../config";

export default function OrderHistory() {
  const { user } = useUser();
  const userId = user?.id;
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/order/customer/${userId}`);
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-3xl mx-auto mt-10 p-5 bg-white rounded-2xl shadow-2xl'
    >
      <h2 className='text-3xl font-bold mb-6 text-center'>
        Your Order History
      </h2>

      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className='border p-4 rounded-xl mb-5 bg-gray-50'
          >
            <div className='flex justify-between mb-2'>
              <span className='font-semibold'>Order Date:</span>
              <span>
                {new Date(order.createdAt).toLocaleDateString("en-US")}
              </span>
            </div>

            <ul>
              {order.items.map((item) => (
                <li
                  key={item.productId?._id || Math.random()}
                  className='flex justify-between py-1'
                >
                  <span>
                    {item.productId?.name || "Unknown Product"} ×{" "}
                    {item.quantity}
                  </span>
                  <span>
                    ${((item.productId?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <hr className='my-2' />

            <div className='flex justify-between font-bold'>
              <span>Total:</span>
              <span>
                $
                {order.items
                  .reduce(
                    (acc, item) =>
                      acc + (item.productId?.price || 0) * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
          </div>
        ))
      )}

      <button
        onClick={() => navigate("/customer")}
        className='mt-6 w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition'
      >
        Back to Customer Page
      </button>
    </motion.div>
  );
}
