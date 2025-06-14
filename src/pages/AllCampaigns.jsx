import React, { useState, useEffect } from 'react';
import CardHeader from '@/components/shared/CardHeader';
import Pagination from '@/components/shared/Pagination';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { getAllLocations, getAlldata, updateByIDAssignData, deleteAssignData, getUserSlotDetails } from '../services/api';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AllCampaigns = ({ filterStatus = null, onDataLoaded }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [locations, setLocations] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [campaignNameSearch, setCampaignNameSearch] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState([]); // This will store the 'slots' array from API
    const [modalCampaignDetails, setModalCampaignDetails] = useState(null); // Store campaignDetails
    const [modalClientDetails, setModalClientDetails] = useState(null); // Store clientDetails


    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await getAllLocations();
                if (data && Array.isArray(data)) {
                    // Assuming getAllLocations returns an array of objects like [{ _id: 'id1', location: 'Loc A', address: '...' }, ...]
                    // And you want unique location names for the dropdown.
                    const uniqueLocationNames = [...new Set(data.map(loc => loc.location))];
                    setLocations(uniqueLocationNames.map(name => ({ _id: name, name: name }))); // Use name for both _id and name for simplicity in dropdown
                } else {
                    console.error("Unexpected response format for locations:", data);
                    setLocations([]);
                }
            } catch (error) {
                console.error("Error fetching locations:", error);
                setLocations([]);
            }
        };

        fetchLocations();
    }, []);

    function getFileType(url) {
        if (!url) return 'View File';

        const extension = url.split('.').pop().toLowerCase();
        const iconStyle = { marginRight: '5px' };

        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <><i className="fas fa-image" style={iconStyle}></i> View Image</>;
            case 'pdf':
                return <><i className="fas fa-file-pdf" style={iconStyle}></i> View PDF</>;
            case 'mp4':
            case 'mov':
            case 'avi':
                return <><i className="fas fa-video" style={iconStyle}></i> View Video</>;
            case 'doc':
            case 'docx':
                return <><i className="fas fa-file-word" style={iconStyle}></i> View Document</>;
            case 'xls':
            case 'xlsx':
                return <><i className="fas fa-file-excel" style={iconStyle}></i> View Spreadsheet</>;
            default:
                return <><i className="fas fa-file" style={iconStyle}></i> View File</>;
        }
    }

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const formattedDate = selectedDate ? moment(selectedDate).format('YYYY-MM-DD') : null;
            // const formattedTime = selectedTime ? moment(selectedTime, 'HH:mm').format('HH:mm') : null; // Not used in getAlldata

            const apiResponse = await getAlldata(
                search, // clientName search
                page,
                selectedLocation, // locationId (actually location name based on your setup)
                formattedDate, // createdAt date
                campaignNameSearch, // campaignName (content) search
                // Add filterStatus here if your API supports it directly
                // filterStatus
            );


            // The API should ideally handle all filtering.
            // If getAlldata doesn't handle all filters, client-side filtering is less efficient.
            let updatedData = (apiResponse.data || []).map((item) => ({
                ...item,
                status: item.status || "Pending"
            }));

            // Prefer server-side filtering. If unavoidable, then:
            if (filterStatus) { // Apply filterStatus if it's provided and API didn't handle it
                updatedData = updatedData.filter(item => item.status === filterStatus);
            }
            // Other client-side filters (less ideal if API can handle them):
            // if (formattedDate) { ... }
            // if (selectedLocation) { ... } // API should filter by location
            // if (search) { ... } // API should filter by client name
            // if (campaignNameSearch) { ... } // API should filter by campaign name


            // The expansion of campaigns by totalSlots seems incorrect for a campaign list.
            // A campaign is one item, not 'totalSlots' items.
            // If onDataLoaded expects this, it might need review.
            // For now, I'll comment out the expansion as it's usually not how campaign lists are displayed.
            /*
            const expandedCampaigns = [];
            updatedData.forEach((item) => {
                const slots = Number(item.totalSlots) || 1;
                for (let i = 0; i < slots; i++) {
                    expandedCampaigns.push({
                        ...item,
                        slotIndex: i + 1
                    });
                }
            });
            if (onDataLoaded) {
                onDataLoaded(expandedCampaigns);
            }
            */
            if (onDataLoaded) {
                onDataLoaded(updatedData); // Pass the original filtered data
            }

            setCampaigns(updatedData);
            setTotalPages(apiResponse.totalPages || 1);

        } catch (err) {
            console.error("Error fetching data:", err);
            setCampaigns([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (campaignBookingId) => {
        // Removed fallback parameters as API response is now more structured
        setLoading(true);
        setShowModal(true); // Show modal immediately with loading state
        setModalData([]); // Clear previous data
        setModalCampaignDetails(null);
        setModalClientDetails(null);
        try {
            const response = await getUserSlotDetails(campaignBookingId);
            if (response && response.success) {
                setModalData(response.slots || []);
                setModalCampaignDetails(response.campaignDetails || null);
                setModalClientDetails(response.clientDetails || null);
            } else {
                // Handle API error or !response.success properly
                console.error("Failed to fetch slot details:", response?.message);
                // Optionally set some error state for the modal
                setModalCampaignDetails({ name: "Error loading details" }); // Example
            }
        } catch (err) {
            console.error("Error fetching campaign slot details:", err);
            setModalCampaignDetails({ name: "Error loading details" }); // Example
        } finally {
            setLoading(false); // Loading for modal content, not main page
        }
    };


    useEffect(() => {
        fetchCampaigns();
    }, [search, campaignNameSearch, selectedLocation, selectedDate, /*selectedTime,*/ page, filterStatus]);
    // Removed selectedTime if getAlldata doesn't use it or if its client-side filtering is removed

    const handleStatusChange = async (id, newStatus) => {
        try {
            // const correctedStatus = newStatus === 'Approve' ? 'Approved' : newStatus; // 'Approve' is not a standard status
            await updateByIDAssignData(id, { status: newStatus }); // API should handle 'Approved', 'Pending', 'Rejected'
            await fetchCampaigns(); // Refetch to update list
        } catch (error) {
            console.error("Error updating status", error);
            alert("Error updating status. Please try again later.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this campaign booking?")) {
            try {
                await deleteAssignData(id);
                await fetchCampaigns(); // Refetch to update list
            } catch (err) {
                console.error("Error deleting campaign", err);
                alert("Failed to delete campaign.");
            }
        }
    };

    const ITEMS_PER_PAGE = 10; // Or use a state variable if fetched from API

    // Construct modal title dynamically
    const modalTitle = modalCampaignDetails && modalClientDetails
        ? `${modalClientDetails.fullName || 'User'} - ${modalCampaignDetails.campaignName || 'Campaign'} (Duration: ${modalCampaignDetails.duration || 'N/A'} days)`
        : modalCampaignDetails?.name === "Error loading details"
            ? "Error"
            : "Loading Details...";


    return (
        <div className="col-lg-12">
            <div className="card stretch stretch-full">
                <CardHeader title={`Campaign Tracker ${filterStatus ? `- ${filterStatus}` : ''}`} />

                <div className="card-body custom-card-action m-4 p-0">
                    {/* Filters */}
                    <div className="filters mb-4">
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="">All Locations</option>
                                    {/* Ensure locations state has objects with unique 'name' property for key and value */}
                                    {locations.map((location) => (
                                        <option key={location.name} value={location.name}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 mb-3">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText="Filter by Created Date"
                                    className="form-control"
                                    isClearable
                                />
                            </div>
                            {/* Time filter removed as it's often problematic with just date and usually not supported well by backend for 'createdAt' */}
                            {/* <div className="col-md-3 mb-3">
                                <input
                                    type="time"
                                    value={selectedTime || ''}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="form-control"
                                />
                            </div> */}
                            <div className="col-md-3 mb-3">
                                <input
                                    type="text"
                                    placeholder="Search by Client Name"
                                    value={search}
                                    onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <input
                                    type="text"
                                    placeholder="Search by Campaign Name"
                                    value={campaignNameSearch}
                                    onChange={(e) => { setPage(1); setCampaignNameSearch(e.target.value); }}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>

                    <div className='d-flex justify-content-end mb-3'>
                        <button className='btn btn-success' type='button' onClick={() => window.location.href = '/add-campaign'}>Add Campaign</button>
                    </div>

                    {/* Campaign Table */}
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 text-center" style={{ tableLayout: 'auto', minWidth: '1600px' }}>
                            <thead>
                                <tr>
                                    <th>SR No.</th>
                                    <th>Client Name</th>
                                    <th>Client Number</th>
                                    <th>Location</th>
                                    <th>Timeslot Name</th>
                                    <th>Amount</th>
                                    <th>Duration</th>
                                    <th>Total Slots</th>
                                    <th>Peak Slots</th>
                                    <th>Normal Slots</th>
                                    <th>Estimate Reach</th>
                                    <th>Total Budgets</th>
                                    <th>Status</th>
                                    <th>Campaign Name</th>
                                    <th>Media File</th>
                                    <th>Created At</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && campaigns.length === 0 ? (
                                    <tr><td colSpan="17" className="text-center">Loading campaigns...</td></tr>
                                ) : campaigns.length > 0 ? (
                                    campaigns.map((item, index) => (
                                        <tr key={item._id || index}>
                                            <td>{(page - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                            <td>{item.clientId?.fullName || item.fullName || '-'}</td>
                                            <td>{item.clientId?.phone || item.phone || '-'}</td>
                                            <td>{item.locationId?.location || '-'}</td> {/* Accessing nested property */}
                                            <td>{item.timeslot?.name || 'Autolocate'}</td> {/* Accessing nested property */}
                                            <td>{item.amount || item.timeslot?.amount || '-'}</td>
                                            <td>{item.duration || '-'}</td>
                                            <td>{item.totalSlots || '-'}</td>
                                            <td>{item.peakSlots || '-'}</td>
                                            <td>{item.normalSlots || '-'}</td>
                                            <td>{item.estimateReach || '-'}</td>
                                            <td>{item.totalBudgets || '-'}</td>
                                            <td>
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                                    className="form-select form-select-sm p-1 mx-4 border " // Added Bootstrap classes for better styling
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Approved">Approved</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td>{item.content || item.timeslot?.campaignName || '-'}</td>
                                            <td>
                                                {item.mediaFile ? (
                                                    <a
                                                        href={item.mediaFile}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            display: 'inline-block',
                                                            padding: '4px 6px',
                                                            backgroundColor: '#f0f0f0',
                                                            borderRadius: '4px',
                                                            color: '#0066cc',
                                                            textDecoration: 'none',
                                                            // border: '1px solid #ddd'
                                                        }}
                                                    >
                                                        {getFileType(item.mediaFile)}
                                                    </a>
                                                ) : 'N/A'}
                                            </td>
                                            <td>{moment(item.createdAt).format("DD-MM-YYYY hh:mm A")}</td>
                                            <td>
                                                <div className="hstack gap-2 justify-content-end">
                                                    <button
                                                        type="button" // Good practice for buttons
                                                        className="btn btn-sm btn-info"
                                                        onClick={() => handleViewDetails(item._id)} // Pass only campaignBookingId
                                                        disabled={loading} // Disable while modal content might be loading
                                                    >
                                                        <FiEye />
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="17" className="text-center">No campaigns found matching your criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card-footer d-flex justify-content-center">
                    {/* <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    /> */}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"> {/* modal-xl for wider, modal-dialog-scrollable */}
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{modalTitle}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {loading && !modalCampaignDetails ? ( // Show loading only if details are not yet fetched
                                    <p className="text-center">Loading slot details...</p>
                                ) : modalData.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-bordered text-center">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Slot Date</th>
                                                    <th>Slot Time</th>
                                                    <th>Type</th>
                                                    <th>Status</th>
                                                    <th>UID</th> {/* Added UID */}
                                                    {/* <th>Original Campaign Name</th> */}
                                                    <th>Location Name</th>
                                                    <th>Media</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {modalData.map((slot, index) => (
                                                    <tr key={slot.slotInstanceId || index}>
                                                        <td>{index + 1}</td>
                                                        <td>{moment(slot.slotDate).format('DD-MM-YYYY')}</td>
                                                        <td>{slot.slotStartTime}</td>
                                                        <td>{slot.slotType || '-'}</td>
                                                        <td>{slot.status || '-'}</td>
                                                        <td>{slot.uid || '-'}</td>
                                                        {/* <td>{slot.originalCampaignNameOnSlot || '-'}</td> */}
                                                        {/* FIXED: Access the 'name' property of the location object */}
                                                        <td>{slot.location?.name || '-'}</td>
                                                        <td>
                                                            {slot.mediaFile ? (
                                                                <a href={slot.mediaFile} target="_blank" rel="noopener noreferrer">
                                                                    View Media
                                                                </a>
                                                            ) : 'N/A'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : modalCampaignDetails?.name === "Error loading details" ? (
                                    <p className="text-center text-danger">Could not load slot details.</p>
                                ) : (
                                    <p className="text-center">No slot data available for this campaign or for the current filters.</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllCampaigns;