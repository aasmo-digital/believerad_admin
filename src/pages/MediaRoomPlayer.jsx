import React, { useEffect, useState, useRef, useMemo } from 'react';

const getPlaylistCycleStartTime = () => {
  const now = new Date();
  const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0, 0);
  return startTime;
};

const MediaRoomPlayer = ({ slots, isContained = false }) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [initialSeekTime, setInitialSeekTime] = useState(0);
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const hasInitialized = useRef(false);

  const processedMediaSlots = useMemo(() => {
    // console.log("[PLAYER_PROCESS_SLOTS] Starting. Received slots:", slots); // Keep this if helpful
    if (!slots || slots.length === 0) return [];
    const todayBaseDate = new Date();
    todayBaseDate.setHours(0, 0, 0, 0);

    const parsedSlots = slots
      .filter(slot => slot.mediaFile && slot.mediaFile.trim() !== '' && slot.slotStartTime)
      .map((slot, idx) => {
        let startTimeDate;
        if (slot.slotStartTime instanceof Date && !isNaN(slot.slotStartTime)) {
          startTimeDate = slot.slotStartTime;
          // console.log(`[PROCESS ${idx}] SlotStartTime is Date: ${startTimeDate.toLocaleString()}`);
        } else if (typeof slot.slotStartTime === 'string') {
          let hours = 0, minutes = 0, seconds = 0;
          let parsedSuccessfully = false;
          const amPmMatch = slot.slotStartTime.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
          if (amPmMatch) {
            hours = parseInt(amPmMatch[1], 10); minutes = parseInt(amPmMatch[2], 10); seconds = amPmMatch[3] ? parseInt(amPmMatch[3], 10) : 0;
            const ampm = amPmMatch[4].toUpperCase();
            if (ampm === 'PM' && hours >= 1 && hours <= 11) hours += 12; else if (ampm === 'AM' && hours === 12) hours = 0;
            if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59) {
              startTimeDate = new Date(todayBaseDate.getFullYear(), todayBaseDate.getMonth(), todayBaseDate.getDate(), hours, minutes, seconds);
              parsedSuccessfully = true;
              // console.log(`[PROCESS ${idx}] Parsed AM/PM "${slot.slotStartTime}" to ${startTimeDate.toLocaleString()}`);
            }
          } else {
            const isoParsedDate = new Date(slot.slotStartTime);
            if (!isNaN(isoParsedDate.getTime()) && slot.slotStartTime.includes('T')) {
              startTimeDate = new Date(todayBaseDate.getFullYear(), todayBaseDate.getMonth(), todayBaseDate.getDate(), isoParsedDate.getHours(), isoParsedDate.getMinutes(), isoParsedDate.getSeconds());
              parsedSuccessfully = true;
            } else {
              const timeParts = slot.slotStartTime.split(':').map(Number);
              if (timeParts.length >= 2 && timeParts.length <= 3 && timeParts.every(p => !isNaN(p))) {
                hours = timeParts[0]; minutes = timeParts[1]; seconds = timeParts[2] || 0;
                if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59) {
                  startTimeDate = new Date(todayBaseDate.getFullYear(), todayBaseDate.getMonth(), todayBaseDate.getDate(), hours, minutes, seconds);
                  parsedSuccessfully = true;
                }
              }
            }
          }
          if (!parsedSuccessfully) { console.error(`[PROCESS ${idx}] FAILED to parse slotStartTime "${slot.slotStartTime}"`); return null; }
        } else { console.error(`[PROCESS ${idx}] Invalid slotStartTime type`); return null; }
        return { ...slot, startTimeDate };
      })
      .filter(Boolean).sort((a, b) => a.startTimeDate - b.startTimeDate);

    if (parsedSlots.length === 0) return [];
    // console.log("[PLAYER_PROCESS_SLOTS] Parsed and sorted slots:", parsedSlots.map(s => ({ file: s.mediaFile, start: s.startTimeDate.toLocaleString() })));

    return parsedSlots.map((slot, index, arr) => {
      let endTimeDate;
      if (index < arr.length - 1) {
        endTimeDate = arr[index + 1].startTimeDate;
      } else {
        const cycleEnd = getPlaylistCycleStartTime();
        let endCandidate = new Date(slot.startTimeDate);
        endCandidate.setHours(cycleEnd.getHours(), cycleEnd.getMinutes(), cycleEnd.getSeconds(), cycleEnd.getMilliseconds());
        if (endCandidate <= slot.startTimeDate) { endCandidate.setDate(endCandidate.getDate() + 1); }
        endTimeDate = endCandidate;
      }
      let durationMs = endTimeDate.getTime() - slot.startTimeDate.getTime();
      if (durationMs <= 0) {
        // console.warn(`[PROCESS DURATION] Slot "${slot.mediaFile}" (Start: ${slot.startTimeDate.toLocaleTimeString()}) has invalid duration. Defaulting to 15s.`);
        durationMs = 15000; endTimeDate = new Date(slot.startTimeDate.getTime() + durationMs);
      }
      // console.log(`[PROCESS DURATION] Slot "${slot.mediaFile}" Start: ${slot.startTimeDate.toLocaleTimeString()}, End: ${endTimeDate.toLocaleTimeString()}, Duration: ${durationMs / 1000}s`);
      return { ...slot, endTimeDate, durationMs };
    });
  }, [slots]);

  const getMediaType = (url) => { /* ... Same as before ... */
    if (!url || typeof url !== 'string' || url.trim() === '') return null;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('/embed/player/')) return 'embed';
    const extensionMatch = lowerUrl.match(/\.([a-z0-9]+)(?:[?#]|$)/);
    const ext = extensionMatch ? extensionMatch[1] : null;
    if (ext) {
      if (['mp4', 'webm', 'ogg', 'mov', 'm4v'].includes(ext)) return 'video';
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) return 'image';
    }
    if (lowerUrl.includes('youtube.com/embed/') || lowerUrl.includes('youtu.be/')) return 'embed';
    if ((lowerUrl.startsWith('http://') || lowerUrl.startsWith('https://')) && !ext) return 'video';
    return 'unknown';
  };

  useEffect(() => { // Initialization Effect
    if (processedMediaSlots.length === 0 || hasInitialized.current) {
      if (processedMediaSlots.length === 0 && !hasInitialized.current) hasInitialized.current = true;
      return;
    }
    // console.log("[INIT EFFECT] Running. Processed Slots:", processedMediaSlots.length);
    const now = new Date();
    let activeIndex = -1, calculatedSeekTimeSeconds = 0;
    for (let i = 0; i < processedMediaSlots.length; i++) {
      const slot = processedMediaSlots[i];
      if (now >= slot.startTimeDate && now < slot.endTimeDate) {
        activeIndex = i; calculatedSeekTimeSeconds = (now.getTime() - slot.startTimeDate.getTime()) / 1000;
        // console.log(`[INIT EFFECT] Active slot: ${activeIndex}, Seek: ${calculatedSeekTimeSeconds.toFixed(2)}s`);
        break;
      }
    }
    if (activeIndex !== -1) {
      setCurrentIndex(activeIndex);
      const currentSlot = processedMediaSlots[activeIndex];
      if (getMediaType(currentSlot.mediaFile) === 'video') {
        const maxSeek = (currentSlot.durationMs / 1000) - 0.1;
        setInitialSeekTime(Math.max(0, Math.min(calculatedSeekTimeSeconds, maxSeek)));
      } else { setInitialSeekTime(0); }
    } else {
      let nextSlotIndex = -1;
      for (let i = 0; i < processedMediaSlots.length; i++) {
        if (processedMediaSlots[i].startTimeDate > now) { nextSlotIndex = i; break; }
      }
      if (nextSlotIndex !== -1) { setCurrentIndex(nextSlotIndex); }
      else if (processedMediaSlots.length > 0) { setCurrentIndex(0); }
      else { setCurrentIndex(-1); }
      setInitialSeekTime(0);
    }
    hasInitialized.current = true;
  }, [processedMediaSlots]);

  useEffect(() => { // Playback Effect
    if (processedMediaSlots.length === 0 || !hasInitialized.current || currentIndex < 0) return;

    const currentSlotData = processedMediaSlots[currentIndex];
    if (!currentSlotData || !currentSlotData.mediaFile) {
      // console.warn(`[PLAYBACK EFFECT] Invalid media at ${currentIndex}. Scheduling next.`);
      const timerId = setTimeout(() => { setCurrentIndex(prev => (prev + 1) % processedMediaSlots.length); setInitialSeekTime(0); }, 1000);
      return () => clearTimeout(timerId);
    }

    const mediaType = getMediaType(currentSlotData.mediaFile);
    const nowForPlaybackSetup = new Date(); // Capture 'now' at the start of this effect run for this slot
    let timeToStartPlayingMs = 0;

    if (nowForPlaybackSetup < currentSlotData.startTimeDate) {
      timeToStartPlayingMs = currentSlotData.startTimeDate.getTime() - nowForPlaybackSetup.getTime();
      console.log(`%c[PLAYBACK EFFECT] SLOT ${currentIndex} (${String(currentSlotData.mediaFile).substring(0, 20)}...): Starts in FUTURE at ${currentSlotData.startTimeDate.toLocaleTimeString()}. WAITING ${timeToStartPlayingMs / 1000}s. (Setup time: ${nowForPlaybackSetup.toLocaleTimeString()})`, "color: orange");
    } else {
      // console.log(`[PLAYBACK EFFECT] Slot ${currentIndex} (${String(currentSlotData.mediaFile).substring(0,20)}...): Active. Start ${currentSlotData.startTimeDate.toLocaleTimeString()}, End ${currentSlotData.endTimeDate.toLocaleTimeString()}. (Setup time: ${nowForPlaybackSetup.toLocaleTimeString()})`);
    }

    const startPlaybackTimeoutId = setTimeout(() => {
      const actualStartTime = new Date();
      console.log(`%c[PLAYBACK EFFECT - GO] SLOT ${currentIndex} (${String(currentSlotData.mediaFile).substring(0, 20)}...): STARTING MEDIA. Actual time: ${actualStartTime.toLocaleTimeString()}`, "color: green; font-weight: bold;");

      const videoElement = videoRef.current;
      if (mediaType === 'video' && videoElement) {
        videoElement.src = currentSlotData.mediaFile; videoElement.load();
        const onCanPlayThrough = () => {
          if (actualStartTime >= currentSlotData.startTimeDate && initialSeekTime > 0 && videoElement.duration > 0 && initialSeekTime < videoElement.duration) {
            // console.log(`[VIDEO] Seeking to: ${initialSeekTime.toFixed(2)}s`);
            videoElement.currentTime = initialSeekTime;
          }
          videoElement.play().catch(e => console.error("[VIDEO] Autoplay Error:", e));
          if (initialSeekTime > 0) setInitialSeekTime(0);
        };
        videoElement.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
        const onCanPlay = () => { if (!videoElement.hasAttribute('data-cpt-fired')) { onCanPlayThrough(); videoElement.setAttribute('data-cpt-fired', 'true'); } };
        videoElement.addEventListener('canplay', onCanPlay, { once: true });
        videoElement.removeAttribute('data-cpt-fired');
      } else if (mediaType === 'embed' && iframeRef.current) {
        if (iframeRef.current.src !== currentSlotData.mediaFile) iframeRef.current.src = currentSlotData.mediaFile;
        if (initialSeekTime > 0) setInitialSeekTime(0);
      } else { if (initialSeekTime > 0) setInitialSeekTime(0); }

      const transitionTimePoint = new Date(); // Time when we are calculating remaining duration
      const timeRemainingInSlotMs = Math.max(500, currentSlotData.endTimeDate.getTime() - transitionTimePoint.getTime());

      const scheduledTransitionFireTime = new Date(transitionTimePoint.getTime() + timeRemainingInSlotMs);

      console.log(
        `%c[PLAYBACK EFFECT - TIMER SET] SLOT ${currentIndex}: ` +
        `Media started playing around: ${actualStartTime.toLocaleTimeString()}. ` +
        `Timer calc time: ${transitionTimePoint.toLocaleTimeString()}. ` +
        `Slot EndDate: ${currentSlotData.endTimeDate.toLocaleTimeString()} (${currentSlotData.endTimeDate.getTime()}). ` +
        `Calc Remaining: ${timeRemainingInSlotMs / 1000}s. ` +
        `Timer scheduled to fire around: ${scheduledTransitionFireTime.toLocaleTimeString()}`,
        "color: blue; font-size: 11px;"
      );

      const advanceSlotTimerId = setTimeout(() => {
        const actualFireTime = new Date();
        const driftMs = actualFireTime.getTime() - scheduledTransitionFireTime.getTime();
        console.log(
          `%c[PLAYBACK EFFECT - ADVANCE FIRED] SLOT ${currentIndex} (File: ${String(currentSlotData.mediaFile).substring(0, 20)}...): ` +
          `Timer FIRED at ${actualFireTime.toLocaleTimeString()}. ` +
          `Was scheduled for ~${scheduledTransitionFireTime.toLocaleTimeString()}. ` +
          `Drift: ${driftMs}ms. ` +
          `Expected slot end was ${currentSlotData.endTimeDate.toLocaleTimeString()}.`,
          "color: red; font-weight: bold;"
        );
        setCurrentIndex(prev => (prev + 1) % processedMediaSlots.length);
      }, timeRemainingInSlotMs);
      cleanupFunctions.push(() => clearTimeout(advanceSlotTimerId));
    }, timeToStartPlayingMs);

    const cleanupFunctions = [() => clearTimeout(startPlaybackTimeoutId)];
    return () => {
      // console.log(`[PLAYBACK EFFECT - CLEANUP] Cleaning up for slot ${currentIndex}`);
      cleanupFunctions.forEach(fn => fn());
      if (videoRef.current && mediaType === 'video' && videoRef.current.src) {
        videoRef.current.pause(); videoRef.current.removeAttribute('src'); videoRef.current.load();
      }
    };
  }, [currentIndex, processedMediaSlots, hasInitialized.current, initialSeekTime]);

  // --- STYLES (condensed) ---
  const commonMessageStyleBase = { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', color: '#ccc', textAlign: 'center', padding: '20px', width: '100%', height: '100%' };
  const commonMessageStyle = isContained ? commonMessageStyleBase : { ...commonMessageStyleBase, position: 'fixed', top: 0, left: 0, zIndex: 9999 };
  const playerContainerBaseStyle = { width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', overflow: 'hidden', position: 'relative' };
  const playerContainerStyle = isContained ? playerContainerBaseStyle : { ...playerContainerStyleBase, position: 'fixed', top: 0, left: 0, zIndex: 9999 };
  const mediaElementStyle = { width: '100%', height: '100%', objectFit: 'cover', border: 'none' };
  const infoOverlayStyle = { position: 'absolute', bottom: '20px', left: '20px', backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px 15px', borderRadius: '5px', color: '#fff', fontSize: '14px', maxWidth: 'calc(100% - 40px)', zIndex: 1 };
  const mediaCountStyle = { position: 'absolute', top: '20px', right: '20px', backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '5px 10px', borderRadius: '5px', color: '#fff', fontSize: '12px', zIndex: 1 };

  const DebugInfo = () => { /* ... Same as before ... */
    const [now, setNow] = useState(new Date());
    useEffect(() => { const timer = setInterval(() => setNow(new Date()), 250); return () => clearInterval(timer); }, []);
    let slotInfo = "N/A";
    if (currentIndex >= 0 && processedMediaSlots[currentIndex]) {
      const cs = processedMediaSlots[currentIndex];
      slotInfo = `Idx: ${currentIndex}, File: ${String(cs.mediaFile).substring(0, 20)}..., Start: ${cs.startTimeDate.toLocaleTimeString()}, End: ${cs.endTimeDate.toLocaleTimeString()}, Duration: ${(cs.durationMs / 1000).toFixed(1)}s`;
    }
    return (
      <div style={{ position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.85)', color: 'lime', padding: '8px', fontSize: '11px', zIndex: 10000, fontFamily: 'monospace', lineHeight: '1.4', borderRadius: '4px', border: '1px solid lime' }}>
        <p style={{ margin: 0 }}><strong>DEBUGGER:</strong></p>
        <p style={{ margin: 0 }}>Sys Time: {now.toLocaleTimeString()}.{String(now.getMilliseconds()).padStart(3, '0')}</p>
        <p style={{ margin: 0 }}>Player Init: {hasInitialized.current.toString()}</p>
        <p style={{ margin: 0 }}>Slot Info: {slotInfo}</p>
        <p style={{ margin: 0 }}>InitialSeek: {initialSeekTime.toFixed(2)}s</p>
        <p style={{ margin: 0 }}>Total Slots: {processedMediaSlots.length}</p>
      </div>
    );
  };

  // --- RENDER ---
  if (!hasInitialized.current && processedMediaSlots.length > 0) return <div style={commonMessageStyle}><p>Initializing...</p></div>;
  if (processedMediaSlots.length === 0) return <div style={commonMessageStyle}><p>No media scheduled.</p></div>;
  if (currentIndex < 0) {
    const now = new Date(); const firstSlot = processedMediaSlots[0];
    if (firstSlot && now < firstSlot.startTimeDate) return (<div style={commonMessageStyle}><DebugInfo /><p>Waiting for first media: {firstSlot.startTimeDate.toLocaleTimeString()}...</p></div>);
    return <div style={commonMessageStyle}><DebugInfo /><p>No active media slot.</p></div>;
  }
  const currentMedia = processedMediaSlots[currentIndex];
  if (!currentMedia || !currentMedia.mediaFile) return <div style={commonMessageStyle}><p>Error: Invalid media data for slot {currentIndex}.</p></div>;
  const mediaType = getMediaType(currentMedia.mediaFile);

  return (
    <div style={playerContainerStyle}>
      {/* <DebugInfo /> Ensure this is active */}
      <div style={mediaCountStyle}>{currentIndex + 1} / {processedMediaSlots.length}</div>
      {(new Date() < currentMedia.startTimeDate && mediaType !== 'video' && mediaType !== 'embed') ?
        (<div style={{ ...mediaElementStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}><p>Waiting: {currentMedia.campaignName || 'Next Media'} ({currentMedia.startTimeDate.toLocaleTimeString()})</p></div>) :
        mediaType === 'video' ? (<video key={currentMedia.mediaFile + "-" + currentIndex + "-" + currentMedia.startTimeDate.getTime()} ref={videoRef} style={mediaElementStyle} autoPlay muted playsInline onError={(e) => console.error("[VIDEO RENDER] Error:", e.target.error?.message, currentMedia.mediaFile)} />) :
          mediaType === 'image' ? (<img key={currentMedia.mediaFile + "-" + currentIndex} src={currentMedia.mediaFile} alt={currentMedia.campaignName || 'Media'} style={mediaElementStyle} onError={() => console.error("[IMAGE RENDER] Error:", currentMedia.mediaFile)} />) :
            mediaType === 'embed' ? (<iframe key={currentMedia.mediaFile + "-" + currentIndex + "-" + currentMedia.startTimeDate.getTime()} ref={iframeRef} src={currentMedia.mediaFile} style={mediaElementStyle} frameBorder="0" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen title={currentMedia.campaignName || 'Embed'} onLoad={() => console.log(`[IFRAME] Loaded: ${String(currentMedia.mediaFile).substring(0, 50)}`)} onError={() => console.error(`[IFRAME] Error loading: ${String(currentMedia.mediaFile).substring(0, 50)}`)} />) :
              (<div style={{ ...commonMessageStyleBase, height: '100%' }}><p>Unsupported/Error: {String(currentMedia.mediaFile).substring(0, 100)}...</p><p>(Type: {mediaType}, Parsed Start: {currentMedia.startTimeDate.toLocaleTimeString()})</p></div>)
      }
      <div style={infoOverlayStyle}><p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{currentMedia.campaignName || 'Unnamed Media'} ({mediaType})</p><p style={{ margin: 0, fontSize: '0.9em' }}></p></div>
    </div>
  );
};
export default MediaRoomPlayer;