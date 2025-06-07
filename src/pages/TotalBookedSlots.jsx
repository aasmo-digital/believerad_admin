import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getAllBookedSlots, getAllLocations } from '../services/api'; // Ensure this supports pagination

const LIMIT = 50;

const TotalBookedSlots = () => {
    const [allSlots, setAllSlots] = useState([]);
    const [filteredSlots, setFilteredSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1); // Start page at 1
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();
    // const loaderRef = useRef(null); // Not used, can be removed if not planned for future use

    // Filter states
    const [timeFilter, setTimeFilter] = useState('');
    const [slotTypeFilter, setSlotTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [clientNameFilter, setClientNameFilter] = useState('');
    const [campaignNameFilter, setCampaignNameFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [uidFilter, setUidFilter] = useState('');
    const [locations, setLocations] = useState([]);

    const fetchLocations = async () => {
        try {
            const locationData = await getAllLocations();
            const uniqueLocations = Array.from(
                new Set(locationData.map((loc) => loc.location))
            ).map((location) => {
                return locationData.find((loc) => loc.location === location);
            });
            setLocations(uniqueLocations || []);
        } catch (err) {
            console.error('Error fetching locations:', err);
            // setError('Error fetching locations.'); // Optionally set error state
        }
    };

    // Modified: fetchBookedSlots now takes the page to fetch as an argument
    // and does NOT call setPage itself.
    const fetchBookedSlots = useCallback(async (currentPage) => {
        // Guard clause moved to the useEffect that calls this
        // if (loading || !hasMore) return;
        try {
            setLoading(true);
            setError(null);

            console.log(`Fetching page: ${currentPage} for date: ${selectedDate}`);
            const data = await getAllBookedSlots(selectedDate, currentPage, LIMIT);
            const newSlots = (data.slots || []).map(slot => ({
                ...slot,
                time: slot.slotStartTime
            }));

            setAllSlots(prev => {
                // If it's the first page, replace; otherwise, append.
                // This is crucial if data is being reset.
                return currentPage === 1 ? newSlots : [...prev, ...newSlots];
            });
            setHasMore(newSlots.length === LIMIT);

        } catch (err) {
            console.error('Error fetching booked slots:', err);
            setError('An error occurred while fetching booked slots.');
            setHasMore(false); // Stop trying to fetch if there's an error
        } finally {
            setLoading(false);
        }
    }, [selectedDate]); // Add selectedDate as dependency for useCallback

    // Effect for initial mount: Fetch locations
    useEffect(() => {
        fetchLocations();
    }, []);

    // Effect for when selectedDate changes: Reset everything
    useEffect(() => {
        console.log("Date changed, resetting slots and page.");
        setAllSlots([]);
        setFilteredSlots([]); // Also reset filtered slots immediately
        setPage(1);           // Reset page to 1
        setHasMore(true);     // Assume there's more data for the new date
        setError(null);       // Clear previous errors
        // The actual fetch for page 1 will be triggered by the effect below
    }, [selectedDate]);


    // Effect for fetching data when page changes or selectedDate makes page 1 active
    useEffect(() => {
        if (hasMore && !loading) { // Only fetch if there's more and not already loading
            fetchBookedSlots(page);
        }
    }, [page, hasMore, fetchBookedSlots, loading]); // fetchBookedSlots is now a dependency due to useCallback


    // Lazy loading via IntersectionObserver
    const lastSlotRef = useCallback(node => {
        if (loading) return; // Don't do anything if already loading
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                console.log("Intersecting, loading next page");
                setPage(prevPage => prevPage + 1); // This will trigger the useEffect above
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]); // Dependencies for useCallback


    // Filter logic
    useEffect(() => {
        let filtered = allSlots;

        if (timeFilter) filtered = filtered.filter(slot => slot.time.includes(timeFilter));
        if (slotTypeFilter !== 'All') filtered = filtered.filter(slot => slot.slotType === slotTypeFilter);
        if (statusFilter !== 'All') filtered = filtered.filter(slot => slot.status === statusFilter);
        if (clientNameFilter) filtered = filtered.filter(slot => slot.fullName?.toLowerCase().includes(clientNameFilter.toLowerCase()));
        if (campaignNameFilter) filtered = filtered.filter(slot => slot.campaignName?.toLowerCase().includes(campaignNameFilter.toLowerCase()));
        if (locationFilter) filtered = filtered.filter(slot => slot.location?.toLowerCase().includes(locationFilter.toLowerCase()));
        if (uidFilter) filtered = filtered.filter(slot => slot.uid?.toString().includes(uidFilter));

        setFilteredSlots(filtered);
    }, [timeFilter, slotTypeFilter, statusFilter, clientNameFilter, campaignNameFilter, locationFilter, allSlots, uidFilter]);

    return (
        <div className="container mt-0">
            {/* Filters UI */}
            <div className="mb-4 p-4 border rounded shadow-sm bg-white" style={{ position: 'sticky', top: "11%", zIndex: 100 }}>
                <h5>Filters</h5>
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Select Date:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Time:</label>
                        <input
                            type="time"
                            step="1"
                            className="form-control"
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            placeholder="Filter by time"
                        />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Slot Type:</label>
                        <select className="form-select" value={slotTypeFilter} onChange={(e) => setSlotTypeFilter(e.target.value)}>
                            <option value="All">All Slot Types</option>
                            <option value="Normal">Normal</option>
                            <option value="Peak">Peak</option>
                        </select>
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Status:</label>
                        <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="Booked">Booked</option>
                            <option value="Available">Available</option>
                        </select>
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Client Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={clientNameFilter}
                            onChange={(e) => setClientNameFilter(e.target.value)}
                            placeholder="Filter by client"
                        />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Campaign Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={campaignNameFilter}
                            onChange={(e) => setCampaignNameFilter(e.target.value)}
                            placeholder="Filter by campaign"
                        />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Location:</label>
                        <select
                            className="form-select"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        >
                            <option value="">Select Location</option>
                            {locations.map((location, index) => (
                                <option key={index} value={location.location}>
                                    {location.location}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">UID:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={uidFilter}
                            onChange={(e) => setUidFilter(e.target.value)}
                            placeholder="Filter by UID"
                        />
                    </div>
                </div>
            </div>

            <h4 className="mt-5">Total Slots for {selectedDate} ({filteredSlots.length}  displayed)</h4>

            {error && <p className="text-danger">{error}</p>}

            <table className="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Time</th>
                        <th>Hour Id</th>
                        <th>Min Id</th>
                        <th>Slot Id</th>
                        <th>UId</th>
                        <th>Client Name</th>
                        <th>Campaign Name</th>
                        <th>Location</th>
                        <th>Slot No</th>
                        <th>Created At</th>
                        <th>Slot Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSlots.map((item, index) => {
                        // Attach ref to the last item for infinite scrolling
                        const isLastItemInView = index === filteredSlots.length - 1;
                        return (
                            <tr key={`${item.slotId}-${item.uid}-${index}`} ref={isLastItemInView ? lastSlotRef : null}> {/* Improved key */}
                                <td>{index + 1}</td>
                                <td>{item.time}</td>
                                <td>{item.hourId}</td>
                                <td>{item.minId}</td>
                                <td>{item.slotId}</td>
                                <td>{item.uid}</td>
                                <td>{item.fullName}</td>
                                <td>{item.campaignName}</td>
                                <td>{item.location}</td>
                                <td>Slot {item.slotIndexNumber}</td>
                                <td>{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                                <td>{item.slotType}</td>
                                <td className={item.status === 'Booked' ? 'text-danger' : 'text-success'}>
                                    {item.status}
                                </td>
                            </tr>
                        );
                    })}
                    {loading && (
                        <tr>
                            <td colSpan="13" className="text-center">Loading more slots...</td> {/* Increased colSpan */}
                        </tr>
                    )}
                    {!loading && !hasMore && filteredSlots.length > 0 && (
                         <tr>
                            <td colSpan="13" className="text-center">No more slots to load.</td>
                        </tr>
                    )}
                     {!loading && allSlots.length === 0 && !error && (
                        <tr>
                           <td colSpan="13" className="text-center">No slots found for the selected date.</td>
                       </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TotalBookedSlots;