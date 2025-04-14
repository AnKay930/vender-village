import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

export default function Checkout() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert("Checkout successful!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-xl mx-auto mt-10 p-8 rounded-2xl shadow-2xl bg-white'
    >
      <h2 className='text-3xl font-bold mb-6 text-center'>Checkout</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        {/* Full Name */}
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

        {/* Email */}
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

        {/* Phone */}
        <div>
          <label className='block text-sm font-semibold'>Phone Number</label>
          <input
            type='tel'
            {...register("phone", { required: true })}
            className='w-full border p-2 rounded mt-1'
            placeholder='+1 123 456 7890'
          />
          {errors.phone && (
            <p className='text-red-500 text-sm'>Phone number is required</p>
          )}
        </div>

        {/* Address */}
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

        {/* City & Zip */}
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
            <label className='block text-sm font-semibold'>Zip Code</label>
            <input
              {...register("zip", { required: true })}
              className='w-full border p-2 rounded mt-1'
            />
            {errors.zip && (
              <p className='text-red-500 text-sm'>Zip code is required</p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className='block text-sm font-semibold'>Country</label>
          <select
            {...register("country", { required: true })}
            className='w-full border p-2 rounded mt-1'
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

        <hr className='my-6' />

        {/* Card Info */}
        <div>
          <label className='block text-sm font-semibold'>Card Number</label>
          <input
            {...register("cardNumber", { required: true })}
            className='w-full border p-2 rounded mt-1'
            placeholder='1234 5678 9012 3456'
          />
          {errors.cardNumber && (
            <p className='text-red-500 text-sm'>Card number is required</p>
          )}
        </div>

        <div className='flex gap-4'>
          <div className='w-1/2'>
            <label className='block text-sm font-semibold'>Expiry Date</label>
            <input
              type='text'
              {...register("expiry", { required: true })}
              className='w-full border p-2 rounded mt-1'
              placeholder='MM/YY'
            />
            {errors.expiry && (
              <p className='text-red-500 text-sm'>Expiry is required</p>
            )}
          </div>
          <div className='w-1/2'>
            <label className='block text-sm font-semibold'>CVV</label>
            <input
              type='password'
              {...register("cvv", { required: true })}
              className='w-full border p-2 rounded mt-1'
              placeholder='123'
            />
            {errors.cvv && (
              <p className='text-red-500 text-sm'>CVV is required</p>
            )}
          </div>
        </div>

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
