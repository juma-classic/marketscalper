/**
 * Affiliate Tracking Utilities
 * Ensures proper commission tracking for Deriv affiliate program
 */

export interface AffiliateConfig {
    appId: string;
    brand: string;
    affiliateToken?: string;
    trackingId?: string;
}

export const AFFILIATE_CONFIG: AffiliateConfig = {
    appId: '116162',
    brand: 'autotrades',
    // Add your affiliate token if provided by Deriv
    affiliateToken: undefined, // Set this if you have one
    trackingId: 'autotrades-main', // Custom tracking identifier
};

/**
 * Generate affiliate-tracked OAuth URL
 */
export const generateAffiliateOAuthURL = (customParams?: Record<string, string>): string => {
    const baseParams = {
        app_id: AFFILIATE_CONFIG.appId,
        l: 'EN',
        brand: AFFILIATE_CONFIG.brand,
        redirect_uri: 'https://autotrades.site',
    };

    // Add affiliate token if available
    if (AFFILIATE_CONFIG.affiliateToken) {
        baseParams['affiliate_token'] = AFFILIATE_CONFIG.affiliateToken;
    }

    // Add custom tracking parameters
    if (customParams) {
        Object.assign(baseParams, customParams);
    }

    const params = new URLSearchParams(baseParams);
    return `https://oauth.deriv.com/oauth2/authorize?${params.toString()}`;
};

/**
 * Track user referral for analytics
 */
export const trackUserReferral = (userId: string, source?: string): void => {
    try {
        const referralData = {
            userId,
            affiliateId: AFFILIATE_CONFIG.appId,
            brand: AFFILIATE_CONFIG.brand,
            source: source || 'direct',
            timestamp: new Date().toISOString(),
            trackingId: AFFILIATE_CONFIG.trackingId,
        };

        // Store referral data for analytics
        const existingReferrals = JSON.parse(localStorage.getItem('affiliate_referrals') || '[]');
        existingReferrals.push(referralData);

        // Keep only last 100 referrals
        if (existingReferrals.length > 100) {
            existingReferrals.splice(0, existingReferrals.length - 100);
        }

        localStorage.setItem('affiliate_referrals', JSON.stringify(existingReferrals));

        console.log('📊 User referral tracked:', referralData);
    } catch (error) {
        console.error('❌ Error tracking referral:', error);
    }
};

/**
 * Get affiliate statistics
 */
export const getAffiliateStats = () => {
    try {
        const referrals = JSON.parse(localStorage.getItem('affiliate_referrals') || '[]');
        const today = new Date().toDateString();
        const thisMonth = new Date().getMonth();

        return {
            totalReferrals: referrals.length,
            todayReferrals: referrals.filter(r => new Date(r.timestamp).toDateString() === today).length,
            monthlyReferrals: referrals.filter(r => new Date(r.timestamp).getMonth() === thisMonth).length,
            affiliateId: AFFILIATE_CONFIG.appId,
            brand: AFFILIATE_CONFIG.brand,
        };
    } catch (error) {
        console.error('❌ Error getting affiliate stats:', error);
        return null;
    }
};

/**
 * Validate affiliate configuration
 */
export const validateAffiliateSetup = (): { isValid: boolean; issues: string[] } => {
    const issues: string[] = [];

    if (!AFFILIATE_CONFIG.appId) {
        issues.push('App ID not configured');
    }

    if (!AFFILIATE_CONFIG.brand) {
        issues.push('Brand not configured');
    }

    if (AFFILIATE_CONFIG.appId === '80058') {
        issues.push('Using default App ID - update to your affiliate App ID');
    }

    return {
        isValid: issues.length === 0,
        issues,
    };
};

/**
 * Log affiliate setup status
 */
export const logAffiliateStatus = (): void => {
    const validation = validateAffiliateSetup();
    const stats = getAffiliateStats();

    console.log('🏢 AFFILIATE CONFIGURATION:');
    console.log(`   App ID: ${AFFILIATE_CONFIG.appId}`);
    console.log(`   Brand: ${AFFILIATE_CONFIG.brand}`);
    console.log(`   Tracking ID: ${AFFILIATE_CONFIG.trackingId}`);
    console.log(`   Status: ${validation.isValid ? '✅ Valid' : '❌ Issues found'}`);

    if (!validation.isValid) {
        console.log('   Issues:', validation.issues);
    }

    if (stats) {
        console.log('📊 REFERRAL STATS:');
        console.log(`   Total Referrals: ${stats.totalReferrals}`);
        console.log(`   Today: ${stats.todayReferrals}`);
        console.log(`   This Month: ${stats.monthlyReferrals}`);
    }
};
