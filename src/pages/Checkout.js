import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useCart } from "../context/cartContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (cart.items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    try {
      await axios.post(`${API_BASE}/api/order/create`, {
        userId: cart.userId,
        items: cart.items,
        customerDetails: data,
      });

      clearCart();
      toast.success("Order placed successfully!");
      navigate("/customer");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order.");
    }
  };

  const total = cart.items.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-xl mx-auto mt-10 p-8 rounded-2xl shadow-2xl bg-white'
    >
      <h2 className='text-3xl font-bold mb-6 text-center'>Checkout</h2>

      {/* Cart Summary */}
      <div className='mb-6'>
        <h3 className='text-xl font-semibold mb-2'>Order Summary:</h3>
        {cart.items.map((item) => (
          <div key={item.productId._id} className='flex justify-between'>
            <span>
              {item.productId.name} × {item.quantity}
            </span>
            <span>${(item.productId.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <hr className='my-3' />
        <div className='flex justify-between font-bold'>
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        {/* Customer Info */}
        <div>
          <label className='block text-sm font-semibold'>Full Name</label>
          <input
            {...register("name", { required: true })}
            className='w-full border p-2 rounded mt-1'
            placeholder='John Doe'
          />
          {errors.name && (
            <p className='text-red-500 text-sm'>Name is required</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-semibold'>Email</label>
          <input
            type='email'
            {...register("email", { required: true })}
            className='w-full border p-2 rounded mt-1'
            placeholder='john@example.com'
          />
          {errors.email && (
            <p className='text-red-500 text-sm'>Email is required</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-semibold'>Phone Number</label>
          <input
            type='tel'
            {...register("phone", {
              required: true,
              pattern: {
                value:
                  /^(\+1\s?)?(\([0-9][0-9]{2}\)|[0-9][0-9]{2})[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$/,
                message: "Invalid Canadian phone number",
              },
            })}
            className='w-full border p-2 rounded mt-1'
            placeholder='+1 123 456 7890'
          />
          {errors.phone && (
            <p className='text-red-500 text-sm'>
              {errors.phone.message || "Phone number is required"}
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-semibold'>Address</label>
          <input
            {...register("address", { required: true })}
            className='w-full border p-2 rounded mt-1'
            placeholder='123 Street, Apt #4B'
          />
          {errors.address && (
            <p className='text-red-500 text-sm'>Address is required</p>
          )}
        </div>

        <div className='flex gap-4'>
          <div className='w-1/2'>
            <label className='block text-sm font-semibold'>City</label>
            <input
              {...register("city", { required: true })}
              className='w-full border p-2 rounded mt-1'
            />
            {errors.city && (
              <p className='text-red-500 text-sm'>City is required</p>
            )}
          </div>
          <div className='w-1/2'>
            <label className='block text-sm font-semibold'>Postal Code</label>
            <input
              {...register("zip", {
                required: true,
                pattern: {
                  value: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
                  message: "Invalid Canadian postal code",
                },
              })}
              className='w-full border p-2 rounded mt-1'
              placeholder='A1A 1A1'
            />
            {errors.zip && (
              <p className='text-red-500 text-sm'>
                {errors.zip.message || "Postal code is required"}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className='block text-sm font-semibold'>Country</label>
          <select
            {...register("country", { required: true })}
            className='w-full border p-2 rounded mt-1'
            defaultValue=''
          >
            <option value=''>Select a country</option>
            <option value='canada'>Canada</option>
            <option value='usa'>United States</option>
            <option value='uk'>United Kingdom</option>
          </select>
          {errors.country && (
            <p className='text-red-500 text-sm'>Country is required</p>
          )}
        </div>

        {/* Payment Section */}
        <hr className='my-6' />
        <h3 className='text-xl font-semibold mb-4'>Payment Details</h3>

        <div>
          <label className='block text-sm font-semibold'>Cardholder Name</label>
          <input
            {...register("cardName", { required: true })}
            className='w-full border p-2 rounded mt-1'
            placeholder='John Doe'
          />
          {errors.cardName && (
            <p className='text-red-500 text-sm'>Cardholder name is required</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-semibold'>Card Number</label>
          <input
            {...register("cardNumber", {
              required: "Card number is required",
              pattern: {
                value: /^[0-9]{16}$/,
                message: "Card number must be 16 digits",
              },
            })}
            className='w-full border p-2 rounded mt-1'
            placeholder='1234 5678 9012 3456'
          />
          {errors.cardNumber && (
            <p className='text-red-500 text-sm'>{errors.cardNumber.message}</p>
          )}
        </div>

        <div className='flex gap-4'>
          <div className='w-1/2'>
            <label className='block text-sm font-semibold'>
              Expiry Date (MM/YY)
            </label>
            <input
              {...register("expiryDate", {
                required: "Expiry date is required",
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                  message: "Invalid expiry format (MM/YY)",
                },
                validate: (value) => {
                  const [month, year] = value.split("/");
                  if (!month || !year) return "Invalid expiry format";
                  const inputDate = new Date(`20${year}`, parseInt(month), 0);
                  const cutoff = new Date(2025, 3, 1);
                  return (
                    inputDate >= cutoff ||
                    "Expiry date cannot be before April 2025"
                  );
                },
              })}
              className='w-full border p-2 rounded mt-1'
              placeholder='MM/YY'
            />
            {errors.expiryDate && (
              <p className='text-red-500 text-sm'>
                {errors.expiryDate.message}
              </p>
            )}
          </div>

          <div className='w-1/2'>
            <label className='block text-sm font-semibold'>CVV</label>
            <input
              {...register("cvv", {
                required: "CVV is required",
                pattern: {
                  value: /^[0-9]{3,4}$/,
                  message: "CVV must be 3 or 4 digits",
                },
              })}
              className='w-full border p-2 rounded mt-1'
              placeholder='123'
            />
            {errors.cvv && (
              <p className='text-red-500 text-sm'>{errors.cvv.message}</p>
            )}
          </div>
        </div>

        <hr className='my-6' />

        <button
          type='submit'
          className='w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition'
        >
          Place Order
        </button>
      </form>
    </motion.div>
  );
}
