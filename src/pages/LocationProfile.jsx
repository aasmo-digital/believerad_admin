// src/components/LocationProfile.js
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getAlldata /*, getSlotsByLocation */ } from '../services/api'; // getSlotsByLocation ab hook se aayega
// import moment from 'moment'; // Hook mein use ho raha hai
import CardHeader from '@/components/shared/CardHeader'; // Path check karein
import MediaRoomPlayer from './MediaRoomPlayer';
import useLocationSlots from '../hooks/useLocationSlots'; // Naya hook import karein

const LocationProfile = () => {
  const { locationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true); // Loading state for campaigns

  // Hook se slots aur unki loading state lein
  const { slots, loading: slotsLoading, error: slotsError } = useLocationSlots(locationId);

  const queryParams = new URLSearchParams(location.search);
  const isMediaViewInternal = queryParams.get('view') === 'media'; // Isko internal view ke liye rakhein

  // currentDate hook mein manage ho raha hai
  // const currentDate = moment().format('YYYY-MM-DD');

  useEffect(() => {
    const fetchData = async () => {
      if (!locationId) {
        setCampaignsLoading(false);
        return;
      }
      setCampaignsLoading(true);
      try {
        // Sirf campaigns fetch karein
        const campaignRes = await getAlldata('', 1, locationId);

        const filteredCampaigns = Array.isArray(campaignRes.data)
          ? campaignRes.data.filter(
              (item) =>
                item.locationId?._id === locationId &&
                item.status === 'Approved'
            )
          : [];
        setCampaigns(filteredCampaigns);
      } catch (error) {
        console.error('Error loading campaign data:', error);
      } finally {
        setCampaignsLoading(false);
      }
    };

    fetchData();
  }, [locationId]);

  const handleOpenStandalonePlayer = () => {
    // Naye tab mein standalone player kholein
    if (locationId) {
      window.open(`/embed/player/${locationId}`, '_blank');
    }
  };

  const handleCampaignView = () => {
    navigate(`/location/${locationId}`);
  };

  // Combined loading state
  if (campaignsLoading || slotsLoading) return <div>Loading...</div>;
  if (slotsError) return <div>Error loading slot data. Please try again.</div>; // slotsError ko handle karein

  return (
    <div className="container mt-4">
      <h3>
        {isMediaViewInternal ? '🎬 Media Player (Internal)' : '📋 Approved Campaigns & Slots'}
      </h3>

      <div className="mb-3">
        {/* Button hamesha standalone player ko kholega */}
        <button className="btn btn-primary" onClick={handleOpenStandalonePlayer}>
          🔗 View All Media in Standalone Player →
        </button>
        {isMediaViewInternal && (
             <button className="btn btn-secondary ms-2" onClick={handleCampaignView}>
               ← Back to Campaigns
             </button>
        )}
      </div>

      {/* 📋 Campaign + Slot Table View */}
      {!isMediaViewInternal && (
        <>
          <h4 className="mt-4">🕒 Slot Allocation (Today)</h4> {/* currentDate hook se aa raha hai, yahan display kar sakte hain agar chahiye */}
          <div className="card stretch stretch-full">
            <CardHeader title="Slot Details" />
            <div className="card-body custom-card-action p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  {/* Table structure waisa hi rahega, slots data hook se aa raha hai */}
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Start Time</th>
                      <th>Slot Date</th>
                      {/* ... baaki headers ... */}
                      <th>Media</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.length === 0 ? (
                      <tr>
                        <td colSpan="13" className="text-center py-4">
                          No slots found for today at this location.
                        </td>
                      </tr>
                    ) : (
                      slots.map((slot, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{slot.fullName}</td>
                          <td>{slot.email}</td>
                          <td>{slot.slotStartTime}</td>
                          <td>{slot.slotDate}</td>
                          {/* ... baaki data cells ... */}
                          <td>
                            {slot.mediaFile ? (
                              <a
                                href={slot.mediaFile}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Media
                              </a>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td>{slot.location}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 🎬 Internal Media View Section (agar aap ise rakhna chahte hain) */}
      {isMediaViewInternal && (
        <>
            <h4 className="mt-4">Internal Media Player</h4>
            <MediaRoomPlayer slots={slots} />
        </>
      )}
    </div>
  );
};

export default LocationProfile;