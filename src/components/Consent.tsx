'use client'

import { useState, useEffect } from 'react';
import CookieConsent, { Cookies } from "react-cookie-consent";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Function to update Google's consent state
const updateConsent = (consent: 'granted' | 'denied') => {
  if (typeof window.gtag === 'function') {
    window.gtag("consent", "update", {
      ad_storage: consent,
      analytics_storage: consent,
      ad_user_data: consent,
      ad_personalization: consent,
    });
    // Store a single cookie for the user's overall choice
    Cookies.set("user_consent_choice", consent, { expires: 150 });
  }
};

const ConsentComponent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Only show the banner if a choice has not already been made
    if (!Cookies.get("user_consent_choice")) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    updateConsent('granted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    updateConsent('denied');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <CookieConsent
      location="bottom"
      visible={showBanner ? 'visible' : 'hidden'}
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      style={{ background: "#2B373B", zIndex: 9999 }}
      buttonStyle={{ background: "#4e503b", color: "white", fontSize: "14px", borderRadius: "5px" }}
      declineButtonStyle={{ background: "#7a7a7a", color: "white", fontSize: "14px", borderRadius: "5px" }}
      expires={150}
    >
      This website uses cookies to enhance the user experience, analyze our traffic, and for advertising purposes.
    </CookieConsent>
  );
};

export default ConsentComponent;
