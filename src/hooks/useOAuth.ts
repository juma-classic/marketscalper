/**
 * Custom hook for OAuth management
 */

import { useEffect, useState } from 'react';
import {
    DerivAccount,
    DerivTokens,
    handleOAuthCallback,
    parseAccountsFromTokens,
    tokenManager,
} from '@/utils/oauth-callback';

export interface UseOAuthReturn {
    isAuthenticated: boolean;
    tokens: DerivTokens | null;
    accounts: DerivAccount[];
    isLoading: boolean;
    error: string | null;
    logout: () => void;
    refreshTokens: () => void;
}

export const useOAuth = (): UseOAuthReturn => {
    const [tokens, setTokens] = useState<DerivTokens | null>(null);
    const [accounts, setAccounts] = useState<DerivAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [authenticated, setAuthenticated] = useState(false);

    // Initialize OAuth state
    useEffect(() => {
        const initializeOAuth = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Check for OAuth callback first
                const callbackTokens = handleOAuthCallback();
                if (callbackTokens) {
                    setTokens(callbackTokens);
                    setAccounts(parseAccountsFromTokens(callbackTokens));
                    setAuthenticated(true);
                    return;
                }

                // Check for stored tokens using TokenManager
                const storedTokens = tokenManager.getStoredTokens();
                if (storedTokens) {
                    setTokens(storedTokens);
                    setAccounts(parseAccountsFromTokens(storedTokens));
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'OAuth initialization failed');
                setAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializeOAuth();
    }, []);

    // Logout function
    const logout = () => {
        tokenManager.clearTokens();
        setTokens(null);
        setAccounts([]);
        setAuthenticated(false);
        setError(null);
        console.log('👋 User logged out');
    };

    // Refresh tokens function
    const refreshTokens = () => {
        const storedTokens = tokenManager.getStoredTokens();
        if (storedTokens) {
            setTokens(storedTokens);
            setAccounts(parseAccountsFromTokens(storedTokens));
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    };

    return {
        isAuthenticated: authenticated,
        tokens,
        accounts,
        isLoading,
        error,
        logout,
        refreshTokens,
    };
};

export default useOAuth;
