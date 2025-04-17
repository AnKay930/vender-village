import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser, SignInButton, useClerk } from "@clerk/clerk-react";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const { isSignedIn } = useUser();
  const { redirectToSignUp, redirectToSignIn } = useClerk();
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        const limited = res.data.slice(0, 4);
        setFeatured(limited);
      } catch (err) {
        console.error("Failed to load featured products.", err);
      }
    };
    fetchFeatured();
  }, [API_URL]);

  const handleExplore = () => {
    if (isSignedIn) {
      navigate("/customer");
    } else {
      document.querySelector('[data-mode="modal"]')?.click();
    }
  };

  const handleVendorSignUp = () => {
    redirectToSignUp({
      redirectUrl: "/vendor",
      additionalParams: {
        metadata: JSON.stringify({ role: "vendor" }),
      },
    });
  };

  const handleViewDetails = (productId) => {
    if (isSignedIn) {
      navigate(`/product/${productId}`);
    } else {
      redirectToSignIn({
        redirectUrl: `/product/${productId}`,
      });
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 bg-white shadow-md">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
          Welcome to Vendor Village
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Connecting Vendors & Customers Seamlessly
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <SignInButton mode="modal">
            <button
              onClick={handleExplore}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg font-semibold"
            >
              Explore Products
            </button>
          </SignInButton>

          <button
            onClick={handleVendorSignUp}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg font-semibold transition-colors duration-200"
          >
            Become a Vendor
          </button>
        </div>
      </section>

      {/* Hero Image */}
      <section className="px-4 md:px-16 lg:px-24 py-8">
        <img
          src="/hero-image.png"
          alt="Vendor Village Hero"
          className="w-full h-auto max-h-[450px] mx-auto rounded-xl shadow-md object-contain"
        />
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 p-8 text-center">
        {[
          "Multi-Vendor Support",
          "Secure Checkout",
          "Customer Reviews",
          "Fast Delivery",
        ].map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              {feature}
            </h3>
            <p className="text-gray-500 text-sm">
              Trusted and reliable features to enhance your shopping experience.
            </p>
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section className="p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Featured Products
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md overflow-hidden p-4 flex flex-col items-center"
            >
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="h-40 object-contain mb-3"
              />
              <h3 className="font-semibold text-center text-sm mb-1">
                {product.name}
              </h3>
              <p className="text-blue-600 font-bold text-sm mb-1">
                ${product.price}
              </p>
              <button
                onClick={() => handleViewDetails(product._id)}
                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm font-medium transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-600 border-t py-4">
        © 2025 Vendor Village. All rights reserved.
      </footer>
    </div>
  );
}
