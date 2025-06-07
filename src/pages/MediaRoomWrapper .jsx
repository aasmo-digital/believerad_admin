// MediaRoomWrapper.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import MediaRoomPlayer from './MediaRoomPlayer'; // Correct path if MediaRoomPlayer is in the same directory
// import MediaRoomPlayer from '../pages/MediaRoomPlayer'; // Or this path if it's in pages
import { getSlotsByLocation } from '../services/api';

const MediaRoomWrapper = () => {
  const { locationId } = useParams();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentDate = moment().format('YYYY-MM-DD');

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true); // Ensure loading is true at the start of fetch
      try {
        const res = await getSlotsByLocation(locationId, currentDate);
        setSlots(res.slots || []);
      } catch (error) {
        console.error('Error fetching slots:', error);
        setSlots([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [locationId, currentDate]); // Added currentDate as dependency

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000', color: 'white', fontSize: '18px' }}>Loading Media...</div>;
  
  // MediaRoomPlayer will use its default isContained=false, rendering fullscreen.
  return <MediaRoomPlayer slots={slots} />; 
};

export default MediaRoomWrapper;