import React, { useEffect, useState } from 'react';
import { FiEye, FiEdit, FiTrash } from 'react-icons/fi';
import CardHeader from '@/components/shared/CardHeader';
import Pagination from '@/components/shared/Pagination';
import { getAllUsers, deleteUser, updateByIDUser } from '../services/api'; // <- Make sure this is correct
import { useNavigate } from 'react-router-dom';

const ALlUserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await getAllUsers("", currentPage);
    if (result?.users) {
      setUsers(result.users);
      setTotalPages(result.totalPages || 1);
    } else {
      setUsers([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        alert("Error deleting user");
      }
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      businessName: user.businessName || '',
    });
    setModalVisible(true);
    setMessage('');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const updatedData = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName,
        walletAmount: formData.walletAmount || 0,
      };

      console.log("API call data:", updatedData); // Debugging

      // Call the API to update the user
      const response = await updateByIDUser(editingUser._id, updatedData); // Pass the user ID from the frontend

      console.log("Update response:", response); // Debugging
      setMessage('User updated successfully!');
      setModalVisible(false);
      setEditingUser(null);
      fetchUsers(); // Refresh the list of users
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage('Error updating user');
    }
  };




  return (
    <div className="col-lg-12">
      <div className="card stretch stretch-full">
        <CardHeader title="All Users List" />
        <div className="card-body custom-card-action p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Business Name</th>
                  <th>Wallet Amount</th>
                  <th>Created Date</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8" className="text-center py-4">Loading...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="8" className="text-center py-4">No users found</td></tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{(currentPage - 1) * 10 + index + 1}</td>
                      <td>{user.fullName || '-'}</td>
                      <td>{user.email || '-'}</td>
                      <td>{user.phone || '-'}</td>
                      <td>{user.businessName || '-'}</td>
                      <td>{user.walletAmount ?? 0}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="hstack gap-2 justify-content-end">
                          <button
                            className="avatar-text avatar-md"
                            title="View Profile"
                            type="button"
                            onClick={() => navigate(`/user-profile/${user._id}`, { state: { user } })}
                          >
                            <FiEye />
                          </button>

                          <button className="avatar-text avatar-md" title="Edit" onClick={() => handleEditClick(user)}>
                            <FiEdit />
                          </button>
                          <button className="avatar-text avatar-md text-danger" title="Delete" onClick={() => handleDelete(user._id)}>
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
        <div className="card-footer d-flex justify-content-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>

      {/* Edit Modal */}
      {modalVisible && (
        <div className="modal d-block fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleUpdateUser}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit User</h5>
                  <button type="button" className="btn-close" onClick={() => setModalVisible(false)}></button>
                </div>
                <div className="modal-body">
                  {message && <div className="alert alert-info">{message}</div>}
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Business Name</label>
                    <input type="text" className="form-control" name="businessName" value={formData.businessName} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Update User</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ALlUserList;
