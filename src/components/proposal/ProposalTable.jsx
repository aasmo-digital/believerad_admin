import React, { useState } from 'react';
import { addUser } from '../../services/api'; // Ensure the path is correct

const ProposalTable = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    businessName: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const payload = {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        businessName: formData.businessName,
      };

      await addUser(payload);
      setMessage('✅ User added successfully!');
      setFormData({ name: '', email: '', password: '', phone: '', businessName: '' });
    } catch (err) {
      console.error("Add user error:", err);
      setError(err.message || 'Something went wrong!');
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Add New User</h3>

      <form onSubmit={handleAddUser} className="border p-4 shadow-sm rounded">
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="businessName" className="form-label">Business Name</label>
          <input
            type="text"
            className="form-control"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">Add User</button>
        </div>
      </form>
    </div>
  );
};

export default ProposalTable;
