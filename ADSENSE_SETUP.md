# Google AdSense Integration Guide

## Setup Instructions

### 1. Get Your Google AdSense Publisher ID

1. Sign up for [Google AdSense](https://www.google.com/adsense/) if you haven't already
2. Once approved, go to your AdSense dashboard
3. Navigate to **Ads** → **Overview**
4. Copy your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)

### 2. Create an Ad Unit

1. In AdSense dashboard, go to **Ads** → **By ad unit**
2. Click **+ New ad unit** → **Display ads**
3. Configure your ad:
   - **Name**: "JSON Formatter Modal Ad"
   - **Ad size**: Responsive
   - **Ad type**: Display ads
4. Click **Create**
5. Copy the **Ad slot ID** (format: `XXXXXXXXXX`)

### 3. Update the Code

Replace the placeholder values in the following files:

#### **public/index.html** (Line 11)
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
        crossorigin="anonymous"></script>
```
Replace `YOUR_PUBLISHER_ID` with your actual Publisher ID.

#### **src/pages/Home/components/AdModal.tsx** (Lines 155-158)
```tsx
<ins
  className="adsbygoogle"
  style={{ display: "block", width: "100%", height: "250px" }}
  data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
  data-ad-slot="YOUR_AD_SLOT_ID"
  data-ad-format="auto"
  data-full-width-responsive="true"
></ins>
```
Replace:
- `YOUR_PUBLISHER_ID` with your Publisher ID
- `YOUR_AD_SLOT_ID` with your Ad slot ID

### 4. Testing

During development, ads may not show immediately:
- **Test ads**: Add `?google_debug=1` to your URL to enable test mode
- **Ad serving limits**: New AdSense accounts may have delayed ad serving
- **Domain verification**: Ensure your domain is verified in AdSense

### 5. AdSense Policies for Software Developer Content

To maximize ad relevance for your target audience (software developers who are goth enthusiasts):

1. **Content Categories** (in AdSense Settings):
   - Technology & Computing
   - Software Development
   - Arts & Entertainment
   - Fashion & Style

2. **Allow & Block Ads**:
   - Navigate to **Blocking controls** → **All my sites** → **General categories**
   - **Allow**: Developer tools, IDEs, Tech products, Music, Fashion
   - **Block**: Irrelevant categories that don't match your audience

3. **Sensitive Categories**:
   - Review and block any categories that don't align with your site's theme

## Features Implemented

### ✅ Ad Display
- Ads appear every **10 formatting button clicks**
- Works for both button clicks and keyboard shortcut (Alt+Enter)
- Click count persists across browser sessions

### ✅ User Experience
- **5-second countdown** before users can skip the ad
- Goth-themed modal design matching your site's aesthetic
- Keyboard support (ESC key to close after countdown)
- Click-outside-to-close functionality
- Non-intrusive and respects user flow

### ✅ Analytics Tracking
- **Ad impressions**: Tracked every time ad is shown
- **Ad close events**: Tracks how long users view the ad
- **Google Analytics 4** integration (if gtag is available)
- **Vercel Analytics** integration (if va is available)
- Statistics stored in localStorage for debugging

### ✅ Performance
- Ads don't block page rendering (async loading)
- Minimal impact on page performance
- Error handling for AdSense loading failures

## Tracking & Analytics

### View Ad Statistics

In browser console, run:
```javascript
JSON.parse(localStorage.getItem('adTrackingStats'))
```

This returns:
```json
{
  "impressions": 5,
  "clicks": 0,
  "lastShown": 1701964800000
}
```

### Google Analytics Events

The following events are tracked (if Google Analytics is configured):

1. **ad_impression**
   - Category: Advertisement
   - Label: Format Click Ad
   - Value: Total impression count

2. **ad_close**
   - Category: Advertisement
   - Label: Ad Skipped
   - Value: Time viewed in seconds

## Future Enhancements (Not Implemented)

These features can be added later:

1. **User Preference to Disable Ads**
   - Add toggle in GothControlPanel
   - Store preference in localStorage
   - Implement "Ad-Free Mode" (could be premium feature)

2. **Click Tracking on Actual Ad**
   - Requires AdSense Auto Ads integration
   - Track when users click through to advertiser site

3. **A/B Testing**
   - Test different countdown times (3s vs 5s vs 7s)
   - Test different ad frequencies (every 5 vs 10 vs 15 clicks)

4. **Revenue Optimization**
   - Experiment with ad sizes
   - Try different ad formats (text, display, native)
   - Implement header bidding for higher CPMs

## Troubleshooting

### Ads Not Showing?

1. **Check console for errors**: Look for AdSense-related errors
2. **Verify IDs**: Ensure Publisher ID and Ad Slot ID are correct
3. **Domain approval**: New domains take 1-2 days for approval
4. **Content policies**: Ensure site complies with AdSense policies
5. **Ad blockers**: Disable ad blockers during testing

### Tracking Not Working?

1. **Check localStorage**: Verify `formatClickCount` is incrementing
2. **Console logs**: Look for tracking messages in console
3. **Google Analytics**: Verify gtag is loaded (check Network tab)

## Support

For AdSense-specific issues:
- [AdSense Help Center](https://support.google.com/adsense/)
- [AdSense Community Forum](https://support.google.com/adsense/community)

For code-related issues:
- Check browser console for errors
- Review implementation against this guide
- Test in incognito mode to rule out extensions
