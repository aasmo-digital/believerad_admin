import React, { useEffect, useState } from 'react';
import { getAllBookedSlots, getAllLocations } from '../../services/api';
import ReactApexChart from 'react-apexcharts';
import {
    FaCalendarAlt, FaMapMarkerAlt, FaCheck, FaTimes, FaClock, FaList
} from 'react-icons/fa';

const LIMIT = 1000;

const TasksOverviewChart = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [locationFilter, setLocationFilter] = useState('');
    const [locations, setLocations] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const chartOptionsOverview = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            sparkline: { enabled: true }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        fill: { opacity: 0.2 },
        tooltip: { enabled: false },
        xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { show: false },
        grid: { show: false }
    };

    const getIcon = (label) => {
        const iconMap = {
            'Total Slots': <FaList />,
            'Booked Slots': <FaCheck />,
            'Available Slots': <FaTimes />,
            'Peak Slots': <FaClock />,
            'Normal Slots': <FaCalendarAlt />,
            'Peak Booked': <FaMapMarkerAlt />,
            'Normal Booked': <FaMapMarkerAlt />,
            'Peak Available': <FaMapMarkerAlt />,
            'Normal Available': <FaMapMarkerAlt />
        };
        return iconMap[label] || <FaList />;
    };

    const chartColorMap = {
        'Total Slots': '#6c757d',
        'Booked Slots': '#198754',
        'Available Slots': '#ffc107',
        'Peak Slots': '#0dcaf0',
        'Normal Slots': '#0d6efd',
        'Peak Booked': '#343a40',
        'Normal Booked': '#dc3545',
        'Peak Available': '#0dcaf0',
        'Normal Available': '#0d6efd'
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        fetchSlots();
    }, [selectedDate]);

    const fetchLocations = async () => {
        try {
            const data = await getAllLocations();
            const uniqueLocations = Array.from(new Set(data.map(loc => loc.location)))
                .map(location => data.find(loc => loc.location === location));
            setLocations(uniqueLocations || []);
        } catch (err) {
            console.error('Error fetching locations:', err);
        }
    };

    const fetchSlots = async () => {
        setLoading(true);
        setError(null);
        try {
            let page = 1;
            let allFetched = [];
            let hasMore = true;

            while (hasMore) {
                const res = await getAllBookedSlots(selectedDate, page, LIMIT);
                const newSlots = res.slots || [];
                allFetched = [...allFetched, ...newSlots];
                hasMore = newSlots.length === LIMIT;
                page += 1;
            }

            setSlots(allFetched);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch slot data.');
        } finally {
            setLoading(false);
        }
    };

    const filteredSlots = slots.filter(slot =>
        locationFilter
            ? slot.location?.toLowerCase() === locationFilter.toLowerCase()
            : true
    );

    const total = filteredSlots.length;
    const booked = filteredSlots.filter(s => s.status === 'Booked').length;
    const available = filteredSlots.filter(s => s.status === 'Available').length;
    const peak = filteredSlots.filter(s => s.slotType === 'Peak').length;
    const normal = filteredSlots.filter(s => s.slotType === 'Normal').length;
    const peakBooked = filteredSlots.filter(s => s.slotType === 'Peak' && s.status === 'Booked').length;
    const normalBooked = filteredSlots.filter(s => s.slotType === 'Normal' && s.status === 'Booked').length;
    const peakAvailable = filteredSlots.filter(s => s.slotType === 'Peak' && s.status === 'Available').length;
    const normalAvailable = filteredSlots.filter(s => s.slotType === 'Normal' && s.status === 'Available').length;

    const cardData = [
        { title: 'Total Slots', value: total, color: 'secondary' },
        { title: 'Booked Slots', value: booked, color: 'success' },
        { title: 'Available Slots', value: available, color: 'warning' },
        { title: 'Peak Slots', value: peak, color: 'info' },
        { title: 'Normal Slots', value: normal, color: 'primary' },
        { title: 'Peak Booked', value: peakBooked, color: 'dark' },
        { title: 'Normal Booked', value: normalBooked, color: 'danger' },
        { title: 'Peak Available', value: peakAvailable, color: 'info' },
        { title: 'Normal Available', value: normalAvailable, color: 'primary' }
    ];

    const generateChartData = (value, base) => {
        const ratio = base > 0 ? value / base : 0;
        return Array.from({ length: 8 }, (_, i) => Math.round(value * (i / 8 * ratio))).concat(value);
    };

    return (
        <div className="container">
            <div className="card p-3 mb-4 shadow-lg">
                <h5>Filters</h5>
                <div className="row">
                    <div className="col-md-4 mb-3 ">
                        <label className="form-label">Select Date:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Select Location:</label>
                        <select
                            className="form-select"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        >
                            <option value="">All Locations</option>
                            {locations.map((loc, idx) => (
                                <option key={idx} value={loc.location}>
                                    {loc.location}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-2">Loading slot data...</p>
                </div>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : (
                <div className="row">
                    {cardData.map((card, index) => (
                        <div className="col-md-4 mb-4 shadow-sm" key={index}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-header d-flex align-items-center justify-content-between">
                                    <div className="d-flex gap-3 align-items-center">
                                        <div className="fs-4 text-muted">
                                            {getIcon(card.title)}
                                        </div>
                                        <div>
                                            <div className="fw-semibold">{card.title}</div>
                                            <div className="fs-12 text-muted">{card.value} total</div>
                                        </div>
                                    </div>
                                    <div className="fs-4 fw-bold text-dark">{card.value}</div>
                                </div>
                                <div className="card-body d-flex align-items-center justify-content-between gap-4">
                                    <ReactApexChart
                                        options={{
                                            ...chartOptionsOverview,
                                            colors: [chartColorMap[card.title]]
                                        }}
                                        series={[{
                                            name: card.title,
                                            data: generateChartData(card.value, total)
                                        }]}
                                        type='area'
                                        height={100}
                                    />
                                    <div className="fs-12 text-muted text-nowrap">
                                        {(() => {
                                            let base = total;

                                            if (card.title === 'Normal Booked' || card.title === 'Normal Available') {
                                                base = normal;
                                            } else if (card.title === 'Peak Booked' || card.title === 'Peak Available') {
                                                base = peak;
                                            }

                                            const percentage = base > 0 ? Math.round((card.value / base) * 100) : 0;

                                            return (
                                                <>
                                                    {/* <span className={`fw-semibold text-${card.color}`}>
                                                        {percentage}%
                                                    </span><br />
                                                    <span>
                                                        of {card.title.includes('Normal') ? 'normal slots'
                                                            : card.title.includes('Peak') ? 'peak slots'
                                                                : 'total slots'}
                                                    </span> */}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TasksOverviewChart;
