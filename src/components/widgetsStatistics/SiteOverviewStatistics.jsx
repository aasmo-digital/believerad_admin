import React, { useEffect, useState, useMemo } from 'react';
import { getAllBookedSlots, getAllLocations } from '../../services/api';
import ReactApexChart from 'react-apexcharts';

// MUI Components
import { Card, Grid, Typography, Box, Stack, Skeleton } from '@mui/material';

const LIMIT = 1000;

// Reusable Doughnut Card Component (DEFINITIVE FIX APPLIED)
const DoughnutCard = ({ card }) => {
    // This helper function is unchanged
    const getDoughnutChartData = (card) => {
        const secondaryColor = '#E9ECEF';
        const { total, booked, available, peakBooked, peakAvailable, normalBooked, normalAvailable } = card.context || {};
        
        switch (card.title) {
            case 'Total Slots': return { series: [booked, available], labels: ['Booked', 'Available'], colors: ['#00E396', '#FEB019'] };
            case 'Booked Slots': return { series: [card.value, (total || 0) - card.value], labels: ['Booked', 'Rest'], colors: [card.color, secondaryColor] };
            case 'Peak Booked': return { series: [peakBooked, peakAvailable], labels: ['Booked', 'Available'], colors: [card.color, secondaryColor] };
            case 'Normal Booked': return { series: [normalBooked, normalAvailable], labels: ['Booked', 'Available'], colors: [card.color, secondaryColor] };
            case 'Available Slots': return { series: [card.value, (total || 0) - card.value], labels: ['Available', 'Rest'], colors: [card.color, secondaryColor] };
            case 'Peak Available': return { series: [peakAvailable, peakBooked], labels: ['Available', 'Booked'], colors: [card.color, secondaryColor] };
            case 'Normal Available': return { series: [normalAvailable, normalBooked], labels: ['Available', 'Booked'], colors: [card.color, secondaryColor] };
            default: return { series: [card.value, (total || 0) - card.value], labels: [card.title, 'Rest'], colors: [card.color, secondaryColor] };
        }
    };

    const chartData = getDoughnutChartData(card);

    const options = {
        chart: { type: 'donut', sparkline: { enabled: true } },
        stroke: { width: 0 },
        plotOptions: { pie: { donut: { size: '65%' } } },
        tooltip: {
            fixed: { enabled: false },
            y: { formatter: (val) => `${val} Slots` }
        },
        labels: chartData.labels,
        colors: chartData.colors,
        series: chartData.series,
    };

    return (
        <Card sx={{ height: '100%', boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', p: 2 }}>
            {/* --- THIS IS THE GUARANTEED FIX --- */}
            <Box sx={{ width: 120, flexShrink: 0 }}>
                <ReactApexChart options={options} series={options.series} type="donut" height={140} />
            </Box>
            <Box sx={{ flex: 1, textAlign: 'left', ml: 2, overflow: 'hidden' }}>
                <Typography noWrap variant="body1" component="div" sx={{ fontWeight: '600' }}>{card.title}</Typography>
                <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>{card.value}</Typography>
            </Box>
        </Card>
    );
};

// --- Skeleton Component for a better loading experience ---
const DashboardSkeleton = () => (
    <Box>
        {/* Skeleton for Top Cards */}
        <Grid container spacing={3}>
            {[...Array(4)].map((_, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                    <Skeleton variant="rectangular" height={110} sx={{ borderRadius: '12px' }} />
                </Grid>
            ))}
        </Grid>
        {/* Skeleton for Main Content */}
        <Grid container spacing={3} sx={{ mt: { xs: 2, md: 1 } }}>
            <Grid item xs={12} lg={7}>
                <Skeleton variant="rectangular" height={480} sx={{ borderRadius: '12px' }}/>
            </Grid>
            <Grid item xs={12} lg={5}>
                <Stack spacing={3}>
                    <Skeleton variant="rectangular" height={110} sx={{ borderRadius: '12px' }}/>
                    <Skeleton variant="rectangular" height={110} sx={{ borderRadius: '12px' }}/>
                    <Skeleton variant="rectangular" height={110} sx={{ borderRadius: '12px' }}/>
                </Stack>
            </Grid>
        </Grid>
    </Box>
);


const TasksOverviewChart = () => {
    // --- STATE AND DATA FETCHING LOGIC IS 100% UNCHANGED ---
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [locationFilter, setLocationFilter] = useState('');
    const [locations, setLocations] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllLocations()
            .then(data => {
                const uniqueLocations = Array.from(new Set(data.map(loc => loc.location)))
                                           .map(location => data.find(loc => loc.location === location));
                setLocations(uniqueLocations || []);
            })
            .catch(err => console.error("Failed to fetch locations:", err));
    }, []);

    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true);
            setError(null);
            try {
                let page = 1; let allFetched = []; let hasMore = true;
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
        fetchSlots();
    }, [selectedDate]);

    // --- Using useMemo for performance optimization ---
    const analyticsData = useMemo(() => {
        const filteredSlots = slots.filter(slot =>
            locationFilter ? slot.location?.toLowerCase() === locationFilter.toLowerCase() : true
        );
        const total = filteredSlots.length;
        const booked = filteredSlots.filter(s => s.status === 'Booked').length;
        const peak = filteredSlots.filter(s => s.slotType === 'Peak').length;
        const normal = filteredSlots.filter(s => s.slotType === 'Normal').length;
        const peakBooked = filteredSlots.filter(s => s.slotType === 'Peak' && s.status === 'Booked').length;
        const normalBooked = filteredSlots.filter(s => s.slotType === 'Normal' && s.status === 'Booked').length;
        return { total, booked, available: total - booked, peak, normal, peakBooked, peakAvailable: peak - peakBooked, normalBooked, normalAvailable: normal - normalBooked };
    }, [slots, locationFilter]);

    const allCardsData = useMemo(() => [
        { title: 'Total Slots', value: analyticsData.total, color: '#008FFB' },
        { title: 'Booked Slots', value: analyticsData.booked, color: '#00E396' },
        { title: 'Available Slots', value: analyticsData.available, color: '#FEB019' },
        { title: 'Peak Slots', value: analyticsData.peak, color: '#FF4560' },
        { title: 'Normal Slots', value: analyticsData.normal, color: '#775DD0' },
        { title: 'Peak Booked', value: analyticsData.peakBooked, color: '#f2a654' },
        { title: 'Peak Available', value: analyticsData.peakAvailable, color: '#D10CE8' },
        { title: 'Normal Booked', value: analyticsData.normalBooked, color: '#26a69a' },
        { title: 'Normal Available', value: analyticsData.normalAvailable, color: '#546E7A' },
    ].map(card => ({ ...card, context: analyticsData })), [analyticsData]);

    const topRowCards = allCardsData.slice(0, 4);
    const rightSideCards = allCardsData.slice(4, 7);
    const bottomRowCards = allCardsData.slice(7, 9);
    
    // --- Bar chart options ---
    const mainChartOptions = useMemo(() => {
        const allValues = allCardsData.map(c => c.value);
        const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
        const yAxisStepSize = 200;
        const yAxisMax = Math.ceil(maxValue / yAxisStepSize) * yAxisStepSize;
        const yAxisTickAmount = yAxisMax > 0 ? yAxisMax / yAxisStepSize : 5;
        
        return {
            chart: { type: 'bar', toolbar: { show: true } },
            plotOptions: { bar: { distributed: true, horizontal: false, columnWidth: '40%' } },
            dataLabels: { enabled: false },
            xaxis: {
                categories: allCardsData.map(c => c.title),
                labels: { style: { fontSize: '12px' }, rotate: -45, rotateAlways: true, trim: true, hideOverlappingLabels: true }
            },
            yaxis: { title: { text: 'Number of Slots' }, tickAmount: yAxisTickAmount, max: yAxisMax || yAxisStepSize, min: 0 },
            tooltip: { y: { formatter: (val) => `${val} slots` } },
            legend: { show: false },
            colors: allCardsData.map(c => c.color),
        };
    }, [allCardsData]);

    const mainChartSeries = useMemo(() => [{ name: 'Count', data: allCardsData.map(c => c.value) }], [allCardsData]);

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* FILTER CARD */}
            <Card sx={{ p: 2, mb: 4, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', borderRadius: '12px' }}>
                <Typography variant="h5" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>Filters</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <label className="form-label">Select Date:</label>
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="form-control" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <label className="form-label">Select Location:</label>
                        <select className="form-select px-4" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                            <option value="">All Locations</option>
                            {locations.map((loc, idx) => (<option key={idx} value={loc.location}>{loc.location}</option>))}
                        </select>
                    </Grid>
                </Grid>
            </Card>

            {loading ? (
                <DashboardSkeleton />
            ) : error ? (
                <Typography color="error" align="center" variant="h6">{error}</Typography>
            ) : (
                <>
                    {/* TOP ROW */}
                    <Grid container spacing={3}>
                        {topRowCards.map((card) => (
                            <Grid item xs={12} sm={6} lg={3} key={card.title}>
                                <DoughnutCard card={card} />
                            </Grid>
                        ))}
                    </Grid>

                    {/* MAIN CONTENT ROW */}
                    <Grid container spacing={3} sx={{ mt: { xs: 2, md: 1 } }}>
                        <Grid item xs={12} lg={7}>
                            <Card sx={{ boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', borderRadius: '12px', p: 2, height: '100%', width: '60vw' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Slot Data Comparison</Typography>
                                <ReactApexChart options={mainChartOptions} series={mainChartSeries} type="bar" height={450} />
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} lg={5}>
                            <Stack spacing={3}>
                                {rightSideCards.map((card) => (
                                    <DoughnutCard key={card.title} card={card} />
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* BOTTOM ROW */}
                    <Box sx={{ mt: 4 }}>
                        <Grid container spacing={3} justifyContent="center">
                            {bottomRowCards.map((card) => (
                                <Grid item xs={12} sm={6} md={5} key={card.title}>
                                    <DoughnutCard card={card} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default TasksOverviewChart;