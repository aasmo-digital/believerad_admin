import React, { useState, useEffect } from 'react';
import CardHeader from '@/components/shared/CardHeader';
import Pagination from '@/components/shared/Pagination';
import CardLoader from '@/components/shared/CardLoader';
import useCardTitleActions from '@/hooks/useCardTitleActions';

// Step 1: Import the new service function
import { getPaymentReport } from '../../services/api'; 

// Step 3 (Optional but Recommended): Helper function for status badge colors
const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'approved':
            return 'bg-soft-success text-success';
        case 'pending':
            return 'bg-soft-warning text-warning';
        case 'rejected':
            return 'bg-soft-danger text-danger';
        default:
            return 'bg-soft-secondary text-secondary';
    }
};

const PaymentReport = ({ title }) => {
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

    // Step 2: Set up state for data, loading, error, and totals
    const [reportData, setReportData] = useState([]);
    const [totals, setTotals] = useState({ records: 0, budgetSum: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Step 3: Fetch data using useEffect
    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getPaymentReport(); // You can pass a search term here if you add a search input
                if (response && response.data) {
                    setReportData(response.data);
                    setTotals({
                        records: response.totalRecords,
                        budgetSum: response.totalBudgetSum
                    });
                }
            } catch (err) {
                setError('Failed to fetch payment report.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [refreshKey]); // re-fetch when the refresh button is clicked

    if (isRemoved) {
        return null;
    }

    return (
        <div className="col-lg-12">
            <div className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""} ${refreshKey || loading ? "card-loading" : ""}`}>
                <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

                <div className="card-body custom-card-action p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr className="border-b">
                                    <th>Sr. No</th>
                                    <th>Client Name</th>
                                    <th>Location</th>
                                    <th>Total Budget</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">Loading...</td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="5" className="text-center text-danger">{error}</td>
                                    </tr>
                                ) : reportData.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">No payment records found.</td>
                                    </tr>
                                ) : (
                                    reportData.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    {/* You can add an avatar/initials component here if needed */}
                                                    <div>
                                                        <span className="d-block fw-bold">{item.fullName}</span>
                                                        <span className="fs-12 d-block fw-normal text-muted">{item.phone}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-gray-200 text-dark">{item.location}</span>
                                            </td>
                                            <td>₹: {item.totalBudgets.toLocaleString()} INR</td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(item.status)}`}>{item.status}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card-footer d-flex justify-content-end align-items-center">
                    <div>
                        <strong>Total Budget Sum: </strong>
                        <span className="text-success fw-bold">₹: {totals.budgetSum.toLocaleString()} INR</span>
                    </div>
                    {/* The Pagination component needs to be wired up with state for currentPage, etc. */}
                    {/* <Pagination totalItems={totals.records} /> */}
                </div>
                {/* The CardLoader is now controlled by the component's own loading state via the refreshKey */}
                {/* <CardLoader refreshKey={refreshKey || loading ? 1 : 0} /> */}
            </div>
        </div>
    );
};

export default PaymentReport;