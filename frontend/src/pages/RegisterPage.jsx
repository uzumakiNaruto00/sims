import React, { useState } from "react";
import { registerUser, loginUser } from "../services/api";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      setMessage(response.data.message);
      const loginResponse = await loginUser(formData);
      localStorage.setItem("token", loginResponse.data.token);
      window.location.href = "/products";
    } catch (error) {
      setMessage(error.response?.data?.error || "Error registering user.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded shadow-md w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Username</label>
          <input
            type="text"
            name="username"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Password</label>
          <input
            type="password"
            name="password"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
        <p className="text-sm text-gray-600 mt-4"><a className="text-blue-500 hover:underline" href="/">Already have an account? Login</a></p>
        {message && <p className="text-red-500 mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;
