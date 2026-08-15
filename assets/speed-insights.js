// Vercel Speed Insights initialization
import { injectSpeedInsights } from './speed-insights.mjs';

// Initialize Speed Insights
injectSpeedInsights({
  debug: false, // Set to true to see events in console during development
  sampleRate: 1, // Track 100% of page loads (adjust if needed to reduce costs)
});
