import React, { useState } from 'react';
import { uploadMedia } from '../services/api';

export const AdminAddMedia = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token'); // or get from auth context

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUrl('');
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const formData = new FormData();

    if (file) {
      formData.append('media', file);
    } else if (url) {
      formData.append('url', url);
    } else {
      setMessage('Please provide either a media file or a URL.');
      setLoading(false);
      return;
    }

    try {
      const data = await uploadMedia(formData, token);
      setMessage(data.message || 'Uploaded successfully!');
      setFile(null);
      setUrl('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add Media</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Upload Media File</label>
          <input
            type="file"
            className="form-control"
            disabled={!!url}
            onChange={handleFileChange}
          />
        </div>

        <div className="mb-3">
          <label>Or Enter URL</label>
          <input
            type="text"
            className="form-control"
            value={url}
            disabled={!!file}
            onChange={handleUrlChange}
            placeholder="https://example.com/media"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Uploading...' : 'Submit'}
        </button>

        {message && (
          <div className="alert alert-info mt-3">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};
