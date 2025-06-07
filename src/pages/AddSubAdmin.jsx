import React, { useState, useEffect } from 'react';
import { addSubadmin, getAllLocations } from '../services/api'; // Adjust path as needed

const AddSubAdmin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    location: '',
  });
  const [locations, setLocations] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Fetch locations
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await getAllLocations();  // Fetch the locations here
      setLocations(res || []);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setMessage('Failed to load locations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();  // Call the fetch function when the component mounts
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
  
    // Find the location name by ID
    const selectedLocation = locations.find(loc => loc._id === formData.location);
  
    if (!selectedLocation) {
      setMessage('Please select a valid location.');
      return;
    }
  
    const dataToSend = {
      ...formData,
      location: selectedLocation.location, // send name instead of ID
    };
  
    try {
      await addSubadmin(dataToSend);
      setMessage('Sub-admin added successfully!');
      setFormData({ email: '', password: '', location: '' });
    } catch (err) {
      setMessage(err?.message || 'Error adding sub-admin');
    }
  };
  

  if (loading) return <div>Loading locations...</div>;

  return (
    <div className="container py-4">
      <h3 className="mb-4">Add Sub-Admin</h3>
      <form onSubmit={handleAddUser} className="border p-4 shadow-sm rounded">
        {message && <div className="alert alert-info">{message}</div>}

        {/* Email */}
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

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
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

        {/* Location Dropdown */}
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <select
            className="form-select"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location._id} value={location._id}>
                {location.location} {/* Display location name */}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">Add Sub-Admin</button>
        </div>
      </form>
    </div>
  );
};

export default AddSubAdmin;
