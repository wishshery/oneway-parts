/**
 * Feature Flags — toggle features on/off from environment or admin panel
 */

export const featureFlags = {
  payments: () => process.env.ENABLE_PAYMENTS === 'true',
  reviews: () => process.env.ENABLE_REVIEWS !== 'false',
  wishlist: () => process.env.ENABLE_WISHLIST !== 'false',
  aiRecommendations: () => process.env.ENABLE_AI_RECOMMENDATIONS === 'true',
};

export type FeatureFlag = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag]();
}
