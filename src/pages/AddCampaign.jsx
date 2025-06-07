import React, { useState, useEffect } from 'react';
import { addCampaign, getAllUsers, getAllLocations } from '../services/api';

const AddCampaign = () => {
    const [formData, setFormData] = useState({
        clientId: '',
        fullName: '',
        email: '',
        phone: '',
        businessName: '',
        amount: '',
        duration: '',
        totalSlots: '',
        peakSlots: '',
        normalSlots: '',
        estimateReach: '',
        totalBudgets: '',
        locationId: '',
        locationSelect: null,
        content: '',
        mediaFile: null,
        url: '',
        timeslot: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [locations, setLocations] = useState([]);
    const [clients, setClients] = useState([]);

    // Computed values
    const budget = parseFloat(formData.amount || 0);
    const days = parseInt(formData.duration || 0);
    const costPerImpression = formData?.locationSelect?.costPerImpression || 0.09;
    const peakHoursAmount = formData?.locationSelect?.peakHoursAmount || 2;
    const normalHoursAmount = formData?.locationSelect?.normalHoursAmount || 1;

    const estimatedReach = Math.floor((budget / costPerImpression) * days);
    const peakCost = Math.floor(budget * 0.25);
    const peakSlots = Math.floor(peakCost / peakHoursAmount);
    const normalCost = budget - peakCost;
    const normalSlots = Math.floor(normalCost / normalHoursAmount);
    const totalSlots = peakSlots + normalSlots;
    const totalBudgets = budget * days;

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const locationsData = await getAllLocations();
                const uniqueLocations = locationsData.reduce((acc, current) => {
                    const exists = acc.some(item => item.location === current.location);
                    if (!exists) acc.push(current);
                    return acc;
                }, []);
                setLocations(uniqueLocations);
            } catch (error) {
                console.error('Error fetching locations:', error);
                setError('Failed to load locations.');
            }
        };

        fetchLocations();
    }, []);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const { users } = await getAllUsers();
                setClients(users);
            } catch (error) {
                console.error('Error fetching clients:', error);
                setError('Failed to load clients.');
            }
        };

        fetchClients();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'clientId') {
            const selectedClient = clients.find(client => client._id === value);
            if (selectedClient) {
                setFormData(prev => ({
                    ...prev,
                    clientId: selectedClient._id,
                    clientName: selectedClient.fullName || '', // <--- add this line
                    fullName: selectedClient.fullName || '',
                    email: selectedClient.email || '',
                    phone: selectedClient.phone || '',
                    businessName: selectedClient.businessName || ''
                }));
            }
        }
        else if (name === 'locationId') {
            const selectedLocation = locations.find(location => location._id === value);
            setFormData(prev => ({
                ...prev,
                locationId: value,
                locationSelect: selectedLocation
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            mediaFile: file
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const updatedFormData = {
            clientId: formData.clientId,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            businessName: formData.businessName,
            amount: formData.amount,
            duration: formData.duration,
            locationId: formData.locationId,
            content: formData.content,
            mediaFile: formData.mediaFile,
            url: formData.url,
            timeslot: formData.timeslot,
            peakSlots,
            normalSlots,
            totalSlots,
            estimateReach: estimatedReach,
            totalBudgets,
        };

        const form = new FormData();
        Object.keys(updatedFormData).forEach((key) => {
            if (updatedFormData[key] !== null && updatedFormData[key] !== '') {
                form.append(key, updatedFormData[key]);
            }
        });

        try {
            const response = await addCampaign(form);
            setSuccess('Campaign added successfully!');
            console.log(response);
        } catch (err) {
            setError('Failed to add campaign. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container mt-4">
            <h2>Add Campaign</h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="row">
                    <div className="col-md-6 form-group">
                        <label>Client Name</label>
                        <select name="clientId" className="form-control" value={formData.clientId} onChange={handleChange} required>
                            <option value="">Select Client</option>
                            {clients.map(client => (
                                <option key={client._id} value={client._id}>{client.fullName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6 form-group">
                        <label>Location</label>
                        <select name="locationId" className="form-control" value={formData.locationId} onChange={handleChange} required>
                            <option value="">Select Location</option>
                            {locations.map(location => (
                                <option key={location._id} value={location._id}>{location.location}</option>
                            ))}
                        </select>



                    </div>
                </div>

                {/* <div className="col-md-6 form-group">
                        <label>phone</label>
                        <input type="number" className="form-control" name="duration" value={formData.phone} onChange={handleChange} required />
                    </div> */}

                <div className="row">
                    <div className="col-md-6 form-group">
                        <label>Amount</label>
                        <input type="number" className="form-control" name="amount" value={formData.amount} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Duration</label>
                        <input type="number" className="form-control" name="duration" value={formData.duration} onChange={handleChange} required />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 form-group">
                        <label>Peak Slots</label>
                        <input type="number" className="form-control" value={peakSlots} disabled />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Normal Slots</label>
                        <input type="number" className="form-control" value={normalSlots} disabled />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 form-group">
                        <label>Total Slots</label>
                        <input type="number" className="form-control" value={totalSlots} disabled />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Total Budget</label>
                        <input type="number" className="form-control" value={totalBudgets} disabled />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 form-group">
                        <label>Estimate Reach</label>
                        <input type="number" className="form-control" value={estimatedReach} disabled />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Content</label>
                        <input type="text" className="form-control" name="content" value={formData.content} onChange={handleChange} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 form-group">
                        <label>URL</label>
                        <input
                            type="text"
                            className="form-control"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            disabled={formData.mediaFile !== null}
                        />
                    </div>

                    <div className="col-md-6 form-group">
                        <label>Upload Media File</label>
                        <input
                            type="file"
                            className="form-control"
                            name="mediaFile"
                            onChange={handleFileChange}
                            disabled={formData.url !== ''}
                        />
                    </div>

                </div>


                <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default AddCampaign;
