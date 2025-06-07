import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getUserById, getAlldata } from '../services/api';

const ViewUserProfile = () => {
    const { id } = useParams();
    const location = useLocation();

    const [user, setUser] = useState(location.state?.user || null);
    const [loading, setLoading] = useState(!location.state?.user);
    const [userSlots, setUserSlots] = useState([]);
    const [paymentReports, setPaymentReports] = useState([]);
    const [userCampaigns, setUserCampaigns] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!user) {
                    const res = await getUserById(id);
                    setUser(res);
                    setUserSlots(res.slots || []);
                    setPaymentReports(res.paymentReports || []);
                }
            } catch (error) {
                console.error('Error fetching user:', error.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    useEffect(() => {
        const fetchUserCampaigns = async () => {
            try {
                const res = await getAlldata();
                const allCampaigns = res.data || [];
                const userSpecific = allCampaigns.filter(
                    c => c.clientId && c.clientId._id === id
                );
                setUserCampaigns(userSpecific);
            } catch (err) {
                console.error('Failed to fetch user campaigns:', err);
            }
        };

        fetchUserCampaigns();
    }, [id]);

    if (loading) return <div className="p-4">Loading user profile...</div>;
    if (!user) return <div className="p-4 text-danger">User not found.</div>;

    return (
        <div className="container py-4">
            <div className="card mb-4">
                <div className="card-header"><strong>User Profile</strong></div>
                <div className="card-body">
                    <table className="table table-bordered">
                        <tbody>
                            <tr><th>ID</th><td>{user._id}</td></tr>
                            <tr><th>Name</th><td>{user.fullName || 'N/A'}</td></tr>
                            <tr><th>Email</th><td>{user.email || 'N/A'}</td></tr>
                            <tr><th>Phone</th><td>{user.phone || 'N/A'}</td></tr>
                            <tr><th>Business Name</th><td>{user.businessName || 'N/A'}</td></tr>
                            <tr><th>Wallet Amount</th><td>₹{user.walletAmount}</td></tr>
                            <tr><th>Created At</th><td>{new Date(user.createdAt).toLocaleString()}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Combined User Slots & Campaign Slots */}
            <div className="card mb-4">
                <div className="card-header"><strong>User Slots (including Campaign Slots)</strong></div>
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Slot Name</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* User Slots (Static/Assigned) */}
                            {userSlots.map((slot, index) => (
                                <tr key={`userslot-${index}`}>
                                    <td>{slot.name}</td>
                                    <td>-</td>
                                    <td>{slot.isActive ? 'Active' : 'Deactivated'}</td>
                                    <td>-</td>
                                </tr>
                            ))}

                            {/* Campaign Slots */}
                            {userCampaigns.length > 0 ? (
                                userCampaigns.map((campaign, index) => (
                                    <tr key={`campaign-${index}`}>
                                        <td>{campaign.userId?.fullName || user?.fullName || 'N/A'}</td>
                                        <td>{campaign.locationId?.location || 'N/A'}</td>
                                        <td>{campaign.status === 'Approved' ? 'Booked' : campaign.status}</td>
                                        <td>{new Date(campaign.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No campaign slots available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Reports */}
            {/* Payment Reports */}
            <div className="card">
                <div className="card-header"><strong>Payment Reports</strong></div>
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Campaign Amount</th>
                                <th>Created At</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userCampaigns.length > 0 ? (
                                userCampaigns.map((campaign, index) => (
                                    <tr key={index}>
                                        <td>
                                            ₹{campaign.totalBudgets != null ? Number(campaign.totalBudgets).toFixed(2) : '0.00'}
                                        </td>
                                        <td>{new Date(campaign.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {campaign.status === 'Approved' ? (
                                                <span className="text-success fw-bold">Done</span>
                                            ) : (
                                                campaign.status
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">No payment reports available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default ViewUserProfile;
