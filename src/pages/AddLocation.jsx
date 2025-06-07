import React, { useState } from 'react';
import { addLocation } from '../services/api';

const AddLocation = () => {
  const [formData, setFormData] = useState({
    location: '',
    package: 'Standard',
    url: '',
    city: '',
    dailyReach: '',
    visiblity: '',
    maxAmount: '',
    minAmount: '',
    peakHoursAmount: '',
    normalHoursAmount: '',
    costPerImpression: '0.09',
    budget: '',
  });

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFormData((prev) => ({ ...prev, url: '' })); // reset url if file is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation to ensure either file or URL is provided
    if (file && formData.url) {
      setMessage("Please provide either a media file or a URL, not both.");
      return;
    }

    if (!file && !formData.url) {
      setMessage("Please provide either a media file or a URL.");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    if (file) {
      payload.append('file', file);
    }

    try {
      await addLocation(payload);
      setMessage("Location added successfully!");
      setFormData({
        location: '',
        package: 'Standard',
        url: '',
        city: '',
        dailyReach: '',
        visiblity: '',
        maxAmount: '',
        minAmount: '',
        peakHoursAmount: '',
        normalHoursAmount: '',
        costPerImpression: '0.09',
        budget: '',
      });
      setFile(null);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Add New Location</h3>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} className="border p-4 shadow-sm rounded">
        <div className="row">
          {/* Left Column */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Package</label>
              <select className="form-select" name="package" value={formData.package} onChange={handleChange} required>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">City</label>
              <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Daily Reach</label>
              <input type="text" className="form-control" name="dailyReach" value={formData.dailyReach} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Visibility</label>
              <input type="text" className="form-control" name="visiblity" value={formData.visiblity} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Cost Per Impression</label>
              <input type="number" step="0.01" className="form-control" name="costPerImpression" value={formData.costPerImpression} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Budget</label>
              <input type="number" className="form-control" name="budget" value={formData.budget} onChange={handleChange} />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Maximum Amount</label>
              <input type="number" className="form-control" name="maxAmount" value={formData.maxAmount} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Minimum Amount</label>
              <input type="number" className="form-control" name="minAmount" value={formData.minAmount} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Peak Hours Amount</label>
              <input type="number" className="form-control" name="peakHoursAmount" value={formData.peakHoursAmount} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Normal Hours Amount</label>
              <input type="number" className="form-control" name="normalHoursAmount" value={formData.normalHoursAmount} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Upload Media (gif, image, mp4 - max 15s)</label>
              <input
                type="file"
                className="form-control"
                accept="image/*,video/mp4,image/gif"
                onChange={handleFileChange}
                disabled={!!formData.url}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">OR Media URL</label>
              <input
                type="url"
                className="form-control"
                name="url"
                value={formData.url}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value) setFile(null); // reset file if URL is added
                }}
                placeholder="https://example.com/media.mp4"
                disabled={!!file}
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button type="submit" className="btn btn-success">Add Location</button>
        </div>
      </form>
    </div>
  );
};

export default AddLocation;
