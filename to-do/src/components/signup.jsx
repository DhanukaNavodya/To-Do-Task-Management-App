import React, { useState } from 'react';
import { db, collection, addDoc } from '../firebase'; // Import Firestore functions
import Swal from 'sweetalert2'; // For popups

function Signup() {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  }); // State to store user inputs
  const [loading, setLoading] = useState(false); // State to manage loading state

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = userDetails;

    if (password !== confirmPassword) {
      Swal.fire('Error', 'Passwords do not match!', 'error');
      return;
    }

    try {
      setLoading(true);

      // Add user to Firestore
      await addDoc(collection(db, 'users'), {
        username,
        email,
        password, // Consider hashing the password before saving
      });

      Swal.fire('Success', 'User registered successfully!', 'success');
      setUserDetails({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      Swal.fire('Error', 'An error occurred while signing up. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userDetails.username}
            onChange={handleInputChange}
            required
            className="w-full p-3 mt-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userDetails.email}
            onChange={handleInputChange}
            required
            className="w-full p-3 mt-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userDetails.password}
            onChange={handleInputChange}
            required
            className="w-full p-3 mt-2 border rounded-md"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={userDetails.confirmPassword}
            onChange={handleInputChange}
            required
            className="w-full p-3 mt-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-md"
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default Signup;
