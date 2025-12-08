// Ad tracking utilities for Google Analytics integration

// Extend Window interface for analytics
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    va?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  }
}

export interface AdTrackingEvent {
  impressions: number;
  clicks: number;
  lastShown: number;
}

/**
 * Track ad impression event
 */
export const trackAdImpression = (impressionCount: number): void => {
  console.log(`[Ad Tracking] Impression #${impressionCount}`);
  
  // Google Analytics 4 tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ad_impression', {
      event_category: 'Advertisement',
      event_label: 'Format Click Ad',
      value: impressionCount,
      non_interaction: true
    });
  }

  // Vercel Analytics tracking (if available)
  if (window.va) {
    window.va('track', 'Ad Impression', {
      impressionCount: impressionCount
    });
  }
};

/**
 * Track ad click event
 */
export const trackAdClick = (adContent: string): void => {
  console.log(`[Ad Tracking] Ad clicked: ${adContent}`);
  
  // Google Analytics 4 tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ad_click', {
      event_category: 'Advertisement',
      event_label: adContent,
      value: 1
    });
  }

  // Vercel Analytics tracking (if available)
  if (window.va) {
    window.va('track', 'Ad Click', {
      adContent: adContent
    });
  }
};

/**
 * Track ad close/skip event
 */
export const trackAdClose = (timeToClose: number): void => {
  console.log(`[Ad Tracking] Ad closed after ${timeToClose}ms`);
  
  // Google Analytics 4 tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ad_close', {
      event_category: 'Advertisement',
      event_label: 'Ad Skipped',
      value: Math.round(timeToClose / 1000) // Convert to seconds
    });
  }
};

/**
 * Get ad tracking statistics from localStorage
 */
export const getAdStats = (): AdTrackingEvent => {
  try {
    const stats = localStorage.getItem('adTrackingStats');
    if (stats) {
      return JSON.parse(stats);
    }
  } catch (e) {
    console.error('Error reading ad stats:', e);
  }
  
  return {
    impressions: 0,
    clicks: 0,
    lastShown: 0
  };
};

/**
 * Save ad tracking statistics to localStorage
 */
export const saveAdStats = (stats: AdTrackingEvent): void => {
  try {
    localStorage.setItem('adTrackingStats', JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving ad stats:', e);
  }
};

/**
 * Increment impression count
 */
export const incrementImpressionCount = (): number => {
  const stats = getAdStats();
  stats.impressions += 1;
  stats.lastShown = Date.now();
  saveAdStats(stats);
  return stats.impressions;
};

/**
 * Increment click count
 */
export const incrementClickCount = (): number => {
  const stats = getAdStats();
  stats.clicks += 1;
  saveAdStats(stats);
  return stats.clicks;
};
