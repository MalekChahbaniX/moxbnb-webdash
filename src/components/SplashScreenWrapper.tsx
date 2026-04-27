'use client';

import React, { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';

export default function SplashScreenWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if user has already seen the splash screen in this session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem('hasSeenSplash', 'true');
    }
  }, []);

  return (
    <>
      {showSplash && <SplashScreen duration={2500} />}
      {children}
    </>
  );
}
