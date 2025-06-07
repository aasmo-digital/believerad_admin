// src/hooks/useLocationSlots.js
import { useState, useEffect } from 'react';
import moment from 'moment';
import { getSlotsByLocation } from '../services/api';

const useLocationSlots = (locationId) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentDate = moment().format('YYYY-MM-DD');

  useEffect(() => {
    if (!locationId) {
      setSlots([]); // Agar locationId nahi hai to slots ko empty set karein
      setLoading(false);
      return;
    }

    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        // Yahan getSlotsByLocation ko await karein
        const slotRes = await getSlotsByLocation(locationId, currentDate);
        setSlots(slotRes.slots || []);
      } catch (err) {
        console.error('Error loading slots in hook:', err);
        setError(err);
        setSlots([]); // Error hone par bhi slots ko empty set karein
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [locationId, currentDate]); // currentDate ko dependency array mein rakhein

  return { slots, loading, error };
};

export default useLocationSlots;