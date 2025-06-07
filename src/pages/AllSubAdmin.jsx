import React, { useEffect, useState } from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi';
import CardHeader from '@/components/shared/CardHeader';
import {
  getAllSubAdmins,
  deleteSubAdmin,
  updateSubAdmin,
} from '../services/api';

const AllSubAdmin = () => {
  const [subadmins, setSubadmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', location: '' });

  const fetchSubAdmins = async () => {
    try {
      setLoading(true);
      const res = await getAllSubAdmins();
      setSubadmins(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch sub-admins.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      email: admin.email || '',
      password: '', // Leave blank for update unless user provides new
      location: admin.location || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this sub-admin?")) {
      try {
        await deleteSubAdmin(adminId);
        fetchSubAdmins(); // Refresh the list
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateSubAdmin(selectedAdmin._id, formData);
      setIsModalOpen(false);
      fetchSubAdmins();
    } catch (err) {
      alert(err.message || 'Failed to update sub-admin.');
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5 text-danger">{error}</div>;

  return (
    <div className="col-lg-12">
      <div className="card stretch stretch-full">
        <CardHeader title="All Sub-Admins" />

        <div className="card-body custom-card-action p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  {/* <th>Name</th> */}
                  <th>Email</th>
                  <th>Location</th>
                  <th>Created At</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {subadmins.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">No sub-admins found</td>
                  </tr>
                ) : (
                  subadmins.map((admin, index) => (
                    <tr key={admin._id || index}>
                      <td>{index + 1}</td>
                      {/* <td>{admin.name || '—'}</td> */}
                      <td>{admin.email}</td>
                      <td>{admin.location}</td>
                      <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="hstack gap-2 justify-content-end">
                          <button className="avatar-text avatar-md" title="Edit" onClick={() => handleEdit(admin)}>
                            <FiEdit />
                          </button>
                          <button className="avatar-text avatar-md" title="Delete" onClick={() => handleDelete(admin._id)}>
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
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Sub-Admin</h5>
                  <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Password (leave blank to keep existing)</label>
                    <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label>Location</label>
                    <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSubAdmin;
