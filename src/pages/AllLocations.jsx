import React, { useState, useEffect } from 'react';
import CardHeader from '@/components/shared/CardHeader';
import Pagination from '@/components/shared/Pagination';
import { FiEdit, FiEye, FiTrash } from 'react-icons/fi';
import { getAllLocations, updateLocation, deleteLocation } from '../services/api'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

// --- Helper to determine backend URL for assets ---
let BACKEND_ASSET_ORIGIN = 'https://admin.believerad.space'; // Default

if (import.meta.env.VITE_API_BASE_URL) {
  try {
    BACKEND_ASSET_ORIGIN = new URL(import.meta.env.VITE_API_BASE_URL).origin;
  } catch (e) {
    console.error(
      `Invalid VITE_API_BASE_URL ('${import.meta.env.VITE_API_BASE_URL}') for deriving asset origin. Using fallback: ${BACKEND_ASSET_ORIGIN}`,
      e
    );
  }
} else if (import.meta.env.VITE_BACKEND_ASSET_URL) {
  BACKEND_ASSET_ORIGIN = import.meta.env.VITE_BACKEND_ASSET_URL;
} else {
  console.warn(
    `VITE_API_BASE_URL or VITE_BACKEND_ASSET_URL not set. Falling back to '${BACKEND_ASSET_ORIGIN}' for asset URLs. Please verify this is correct or configure the .env variable.`
  );
}
BACKEND_ASSET_ORIGIN = BACKEND_ASSET_ORIGIN.endsWith('/')
  ? BACKEND_ASSET_ORIGIN.slice(0, -1)
  : BACKEND_ASSET_ORIGIN;

const getFullAssetUrl = (path) => {
  if (!path) return '#';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_ASSET_ORIGIN}${cleanPath}`;
};
// --- End Helper ---


const AllLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    package: '',
    dailyReach: '',
    visiblity: '',
    maxAmount: '',
    minAmount: '',
    peakHoursAmount: '',
    normalHoursAmount: '',
    city: '',
    costPerImpression: '',
    budget: '',
    fileUrl: '', // This is a text input in your modal
    url: '',     // This is also a text input
    slotStartTimes: '',
  });

  const userToken = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchLocations = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllLocations(pageNum);
      console.log('API Response for locations:', response);

      if (response && response.data && Array.isArray(response.data)) {
        setLocations(response.data);
        setTotalPages(response.totalPages || 1);
      } else if (response && response.locations && Array.isArray(response.locations)) {
        setLocations(response.locations);
        setTotalPages(response.totalPages || 1);
      } else if (response && Array.isArray(response)) {
        setLocations(response);
        setTotalPages(1);
      } else if (response && typeof response === 'object' && response !== null && Object.keys(response).length > 0) {
        const arrayKey = Object.keys(response).find(key => Array.isArray(response[key]));
        if (arrayKey) {
          setLocations(response[arrayKey]);
        } else {
          console.warn('Could not find an array of locations in the response object:', response);
          setLocations([]);
        }
        setTotalPages(response.totalPages || 1);
      } else {
        console.warn('Received empty or unexpected response structure for locations:', response);
        setLocations([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setError('Failed to load locations. Please try again later.');
      setLocations([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations(page);
  }, [page]);

  const handleEditClick = (location) => {
    setSelectedLocation(location);
    setFormData({
      location: location.location || '',
      package: location.package || '',
      dailyReach: location.dailyReach || '',
      visiblity: location.visiblity || '',
      maxAmount: location.maxAmount || '',
      minAmount: location.minAmount || '',
      peakHoursAmount: location.peakHoursAmount || '',
      normalHoursAmount: location.normalHoursAmount || '',
      city: location.city || '',
      costPerImpression: location.costPerImpression || '',
      budget: location.budget || '',
      fileUrl: location.fileUrl || '', // Initialize with existing fileUrl
      url: location.url || '',         // Initialize with existing url
      slotStartTimes: (location.slotStartTimes || []).join(', '),
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedLocation) return;

    try {
      // Create payload from formData
      const payload = {
        ...formData,
        slotStartTimes: formData.slotStartTimes
          ? formData.slotStartTimes.split(',').map((s) => s.trim()).filter(s => s)
          : [],
      };

      // **MODIFICATION START**
      // If the 'url' field (external URL text input) has a non-empty value,
      // it means the user intends to use this URL for the media.
      // In this case, we should clear the 'fileUrl' (path to an uploaded file or another direct file link from its text input).
      // The backend will then store the new 'url' and a null/empty 'fileUrl'.
      if (payload.url && payload.url.trim() !== "") {
        payload.fileUrl = null; // Or use "" if your backend/schema prefers empty strings over null
      }
      // If payload.url is empty or whitespace, payload.fileUrl (from its own input field) will be sent as is.
      // The backend will handle if a new file was uploaded separately (req.file).
      // **MODIFICATION END**

      // Note: The current edit form doesn't have a file input, so `updateLocation`
      // will likely not send multipart/form-data unless you modify it to include one.
      // If it did, the backend logic for `req.file` would take precedence.
      await updateLocation(selectedLocation._id, payload, userToken);
      fetchLocations(page); // Refetch to see changes
      setIsModalOpen(false);
      setSelectedLocation(null);
    } catch (error) {
      console.error('Error updating location:', error);
      setError('Failed to update location. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    try {
      await deleteLocation(id, userToken);
      if (locations.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchLocations(page);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      setError('Failed to delete location. Please try again.');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5 text-danger">{error}</div>;

  return (
    <div className="col-lg-12">
      <div className="card stretch stretch-full">
        <CardHeader title="All Locations" />
        <div className="card-body custom-card-action p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Media</th>
                  <th>Location</th>
                  <th>Package</th>
                  <th>Daily Reach</th>
                  <th>Visibility</th>
                  <th>Max Amt</th>
                  <th>Min Amt</th>
                  <th>Peak Hrs</th>
                  <th>Normal Hrs</th>
                  <th>City</th>
                  <th>Cost/Impression</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {locations.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="text-center py-4">
                      No locations found
                    </td>
                  </tr>
                ) : (
                  locations.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {/* This rendering logic will now correctly pick up the url if fileUrl is null */}
                        {item.fileUrl ? (
                          <a href={getFullAssetUrl(item.fileUrl)} target="_blank" rel="noopener noreferrer">
                            View File
                          </a>
                        ) : item.url ? (
                          <a href={getFullAssetUrl(item.url)} target="_blank" rel="noopener noreferrer">
                            View URL
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>{item.location}</td>
                      <td>{item.package}</td>
                      <td>{item.dailyReach}</td>
                      <td>{item.visiblity}</td>
                      <td>{item.maxAmount}</td>
                      <td>{item.minAmount}</td>
                      <td>{item.peakHoursAmount}</td>
                      <td>{item.normalHoursAmount}</td>
                      <td>{item.city}</td>
                      <td>{item.costPerImpression}</td>
                      <td>
                        <div className="hstack gap-2 justify-content-end">
                          <button
                            className="btn btn-sm btn-info"
                            title="View Profile"
                            type="button"
                            onClick={() => navigate(`/location/${item._id}`)}
                          >
                            <FiEye />
                          </button>
                          <button
                            className="btn btn-sm btn-warning"
                            title="Edit"
                            onClick={() => handleEditClick(item)}
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            title="Delete"
                            onClick={() => handleDelete(item._id)}
                          >
                            <FiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="card-footer d-flex justify-content-center">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Location</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)} aria-label="Close" />
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {[
                    { label: 'Location', name: 'location' },
                    { label: 'Package', name: 'package' },
                    { label: 'Daily Reach', name: 'dailyReach' },
                    { label: 'Visibility', name: 'visiblity' },
                    { label: 'Max Amount', name: 'maxAmount', type: 'number' },
                    { label: 'Min Amount', name: 'minAmount', type: 'number' },
                    { label: 'Peak Hours Amount', name: 'peakHoursAmount', type: 'number' },
                    { label: 'Normal Hours Amount', name: 'normalHoursAmount', type: 'number' },
                    { label: 'City', name: 'city' },
                    { label: 'Cost per Impression', name: 'costPerImpression', type: 'number', step: '0.01' },
                    { label: 'Budget', name: 'budget', type: 'number', step: '0.01' },
                    { label: 'URL (External Link for Media)', name: 'url' }, // Clarified label
                    // { label: 'File URL (Direct link or path to existing file)', name: 'fileUrl' }, // Clarified label
                    
                  ].map(({ label, name, type = 'text', step }) => (
                    <div className="mb-3" key={name}>
                      <label htmlFor={name} className="form-label">
                        {label}
                      </label>
                      <input
                        type={type}
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="form-control"
                        placeholder={`Enter ${label.toLowerCase()}`}
                        step={step}
                      />
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedLocation(null);
                    }}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllLocations;