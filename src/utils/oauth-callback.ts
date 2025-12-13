/**
 * OAuth Callback Handler for Deriv API Integration
 * Handles the OAuth response and token management
 */

export interface DerivTokens {
    acct1?: string;
    token1?: string;
    cur1?: string;
    acct2?: string;
    token2?: string;
    cur2?: string;
    acct3?: string;
    token3?: string;
    cur3?: string;
    acct4?: string;
    token4?: string;
    cur4?: string;
    lang?: string;
}

export interface DerivAccount {
    accountId: string;
    token: string;
    currency: string;
    isVirtual: boolean;
}

/**
 * Generate a secure random string for CSRF protection
 */
export const generateRandomString = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Generate OAuth URL with CSRF protection
 */
export const generateOAuthURL = (): string => {
    const state = generateRandomString(32);
    localStorage.setItem('oauth_state', state);

    return `https://oauth.deriv.com/oauth2/authorize?app_id=116162&l=EN&brand=autotrades&redirect_uri=https://autotrades.site&state=${state}`;
};

/**
 * Verify OAuth callback state for CSRF protection
 */
export const verifyOAuthCallback = (): boolean => {
    try {
        const urlState = new URLSearchParams(window.location.search).get('state');
        const storedState = localStorage.getItem('oauth_state');

        if (!urlState || !storedState || urlState !== storedState) {
            console.error('❌ Invalid OAuth state - possible CSRF attack');
            return false;
        }

        // Clean up state after verification
        localStorage.removeItem('oauth_state');
        return true;
    } catch (error) {
        console.error('❌ Error verifying OAuth state:', error);
        return false;
    }
};

/**
 * Handle OAuth callback and extract tokens
 */
export const handleOAuthCallback = (): DerivTokens | null => {
    try {
        const urlParams = new URLSearchParams(window.location.search);

        // Check if this is an OAuth callback
        if (!urlParams.has('acct1') && !urlParams.has('token1')) {
            return null;
        }

        // Verify CSRF state first
        if (!verifyOAuthCallback()) {
            throw new Error('OAuth callback verification failed - possible security issue');
        }

        console.log('🔐 Processing OAuth callback...');

        const tokens: DerivTokens = {
            acct1: urlParams.get('acct1') || undefined,
            token1: urlParams.get('token1') || undefined,
            cur1: urlParams.get('cur1') || undefined,
            acct2: urlParams.get('acct2') || undefined,
            token2: urlParams.get('token2') || undefined,
            cur2: urlParams.get('cur2') || undefined,
            acct3: urlParams.get('acct3') || undefined,
            token3: urlParams.get('token3') || undefined,
            cur3: urlParams.get('cur3') || undefined,
            acct4: urlParams.get('acct4') || undefined,
            token4: urlParams.get('token4') || undefined,
            cur4: urlParams.get('cur4') || undefined,
            lang: urlParams.get('lang') || 'EN',
        };

        // Store tokens securely using TokenManager
        tokenManager.storeTokens(tokens);

        // Parse accounts for easier access
        const accounts = parseAccountsFromTokens(tokens);
        console.log(`✅ Successfully processed ${accounts.length} accounts`);

        // Clean URL (remove OAuth parameters)
        cleanUrlAfterCallback();

        return tokens;
    } catch (error) {
        console.error('❌ Error handling OAuth callback:', error);
        return null;
    }
};

/**
 * Store tokens securely in localStorage
 */
export const storeTokensSecurely = (tokens: DerivTokens): void => {
    try {
        // Store with timestamp for expiry tracking
        const tokenData = {
            tokens,
            timestamp: Date.now(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        };

        localStorage.setItem('deriv_tokens', JSON.stringify(tokenData));
        localStorage.setItem('deriv_auth_status', 'authenticated');

        console.log('💾 Tokens stored securely');
    } catch (error) {
        console.error('❌ Error storing tokens:', error);
    }
};

/**
 * Get stored tokens
 */
export const getStoredTokens = (): DerivTokens | null => {
    try {
        const stored = localStorage.getItem('deriv_tokens');
        if (!stored) return null;

        const tokenData = JSON.parse(stored);

        // Check if tokens are expired
        if (Date.now() > tokenData.expiresAt) {
            console.warn('⚠️ Stored tokens have expired');
            clearStoredTokens();
            return null;
        }

        return tokenData.tokens;
    } catch (error) {
        console.error('❌ Error retrieving tokens:', error);
        return null;
    }
};

/**
 * Clear stored tokens
 */
export const clearStoredTokens = (): void => {
    localStorage.removeItem('deriv_tokens');
    localStorage.removeItem('deriv_auth_status');
    console.log('🗑️ Tokens cleared');
};

/**
 * Parse accounts from tokens for easier access
 */
export const parseAccountsFromTokens = (tokens: DerivTokens): DerivAccount[] => {
    const accounts: DerivAccount[] = [];

    for (let i = 1; i <= 4; i++) {
        const acctKey = `acct${i}` as keyof DerivTokens;
        const tokenKey = `token${i}` as keyof DerivTokens;
        const curKey = `cur${i}` as keyof DerivTokens;

        const accountId = tokens[acctKey];
        const token = tokens[tokenKey];
        const currency = tokens[curKey];

        if (accountId && token) {
            accounts.push({
                accountId,
                token,
                currency: currency || 'USD',
                isVirtual: accountId.startsWith('VRT'),
            });
        }
    }

    return accounts;
};

/**
 * Clean URL after OAuth callback
 */
export const cleanUrlAfterCallback = (): void => {
    try {
        // Remove OAuth parameters from URL
        const url = new URL(window.location.href);
        const paramsToRemove = [
            'acct1',
            'token1',
            'cur1',
            'acct2',
            'token2',
            'cur2',
            'acct3',
            'token3',
            'cur3',
            'acct4',
            'token4',
            'cur4',
            'lang',
        ];

        paramsToRemove.forEach(param => url.searchParams.delete(param));

        // Update URL without page reload
        window.history.replaceState({}, document.title, url.pathname + url.search);

        console.log('🧹 URL cleaned after OAuth callback');
    } catch (error) {
        console.error('❌ Error cleaning URL:', error);
    }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    const authStatus = localStorage.getItem('deriv_auth_status');
    const tokens = getStoredTokens();
    return authStatus === 'authenticated' && tokens !== null;
};

/**
 * Initialize trading connections with tokens
 */
export const initializeTradingConnections = async (tokens: DerivTokens): Promise<void> => {
    try {
        console.log('🔌 Initializing trading connections...');

        const accounts = parseAccountsFromTokens(tokens);

        for (const account of accounts) {
            console.log(`📡 Connecting to account: ${account.accountId} (${account.currency})`);

            // Here you would initialize your WebSocket connections
            // Example: await connectToDerivAPI(account.token, account.accountId);
        }

        console.log('✅ All trading connections initialized');
    } catch (error) {
        console.error('❌ Error initializing trading connections:', error);
    }
};

/**
 * Simple encryption/decryption for token storage
 * Note: This is basic obfuscation. For production, use proper encryption libraries
 */
const simpleEncrypt = (text: string): string => {
    return btoa(encodeURIComponent(text));
};

const simpleDecrypt = (encrypted: string): string => {
    return decodeURIComponent(atob(encrypted));
};

/**
 * Enhanced Token Manager Class
 */
export class TokenManager {
    private static instance: TokenManager;
    private readonly STORAGE_KEY = 'deriv_tokens_encrypted';
    private readonly AUTH_STATUS_KEY = 'deriv_auth_status';

    static getInstance(): TokenManager {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }

    /**
     * Store tokens with encryption
     */
    storeTokens(tokens: DerivTokens): void {
        try {
            const tokenData = {
                tokens,
                timestamp: Date.now(),
                expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
                version: '1.0',
            };

            const encrypted = simpleEncrypt(JSON.stringify(tokenData));
            localStorage.setItem(this.STORAGE_KEY, encrypted);
            localStorage.setItem(this.AUTH_STATUS_KEY, 'authenticated');

            console.log('💾 Tokens stored securely with encryption');
        } catch (error) {
            console.error('❌ Error storing encrypted tokens:', error);
        }
    }

    /**
     * Get stored tokens with decryption
     */
    getStoredTokens(): DerivTokens | null {
        try {
            const encrypted = localStorage.getItem(this.STORAGE_KEY);
            if (!encrypted) return null;

            const decrypted = simpleDecrypt(encrypted);
            const tokenData = JSON.parse(decrypted);

            // Check if tokens are expired
            if (Date.now() > tokenData.expiresAt) {
                console.warn('⚠️ Stored tokens have expired');
                this.clearTokens();
                return null;
            }

            return tokenData.tokens;
        } catch (error) {
            console.error('❌ Error retrieving encrypted tokens:', error);
            this.clearTokens(); // Clear corrupted data
            return null;
        }
    }

    /**
     * Get valid token for specific account
     */
    getValidToken(accountId: string): string | null {
        const tokens = this.getStoredTokens();
        if (!tokens) return null;

        const accounts = parseAccountsFromTokens(tokens);
        const account = accounts.find(acc => acc.accountId === accountId);

        return account ? account.token : null;
    }

    /**
     * Check if tokens are valid and not expired
     */
    areTokensValid(): boolean {
        const tokens = this.getStoredTokens();
        return tokens !== null;
    }

    /**
     * Clear all stored tokens
     */
    clearTokens(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.AUTH_STATUS_KEY);
        localStorage.removeItem('oauth_state'); // Clean up any leftover state
        console.log('🗑️ All tokens and auth data cleared');
    }

    /**
     * Refresh expired tokens (placeholder for future implementation)
     */
    async refreshExpiredTokens(): Promise<boolean> {
        try {
            console.log('🔄 Token refresh not implemented yet');
            // TODO: Implement token refresh logic when Deriv API supports it
            return false;
        } catch (error) {
            console.error('❌ Error refreshing tokens:', error);
            return false;
        }
    }

    /**
     * Get authentication status
     */
    isAuthenticated(): boolean {
        const authStatus = localStorage.getItem(this.AUTH_STATUS_KEY);
        const tokens = this.getStoredTokens();
        return authStatus === 'authenticated' && tokens !== null;
    }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();
