import React, { useState } from 'react';
import { db, collection, getDocs, query, where } from '../firebase'; // Import Firestore functions
import { useNavigate } from 'react-router-dom'; // For navigation
import Swal from 'sweetalert2'; // For popups
import LoginImg from '../images/login.jpg'

function Login() {
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  }); // State to store user input
  const [loading, setLoading] = useState(false); // State to manage loading state
  const navigate = useNavigate(); // Hook for navigation

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
    const { email, password } = userDetails;

    try {
      setLoading(true);

      // Query Firestore to find the user with the entered email
      const userQuery = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        Swal.fire('Error', 'No user found with this email.', 'error');
        return;
      }

      let userFound = false;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.password === password) {
          userFound = true;
          // Store user details in localStorage (you could use sessionStorage as well)
          localStorage.setItem('loggedInUser', JSON.stringify(userData));

          // Display user details in the console
          console.log('Logged in user details:', userData);

          // Show success message and redirect to the home page
          Swal.fire('Success', 'Login successful!', 'success').then(() => {
            navigate('/home'); // Navigate to home page after login
          });
        }
      });

      if (!userFound) {
        Swal.fire('Error', 'Incorrect password. Please try again.', 'error');
      }

    } catch (error) {
      console.error("Error during login: ", error);
      Swal.fire('Error', 'An error occurred while logging in. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white p-6 border rounded-lg shadow-lg">
        {/* Login Form */}
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
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

            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded-md"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
          <img 
            src={LoginImg} 
            alt="Login Illustration" 
            className="max-w-full h-auto rounded-lg "
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
