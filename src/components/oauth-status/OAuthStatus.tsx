/**
 * OAuth Status Component
 * Shows authentication status and account information
 */

import React from 'react';
import Button from '@/components/shared_ui/button';
import { useOAuth } from '@/hooks/useOAuth';
import { Localize } from '@deriv-com/translations';

export const OAuthStatus: React.FC = () => {
    const { isAuthenticated, accounts, isLoading, logout } = useOAuth();

    if (isLoading) {
        return (
            <div className='oauth-status oauth-status--loading'>
                <span>🔄 Checking authentication...</span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Show login button in header instead
    }

    return (
        <div className='oauth-status oauth-status--authenticated'>
            <div className='oauth-status__info'>
                <span className='oauth-status__indicator'>🟢</span>
                <span className='oauth-status__text'>
                    <Localize i18n_default_text='{{count}} account(s) connected' values={{ count: accounts.length }} />
                </span>
            </div>

            <div className='oauth-status__accounts'>
                {accounts.map(account => (
                    <div key={account.accountId} className='oauth-status__account'>
                        <span className='oauth-status__account-id'>{account.accountId}</span>
                        <span className='oauth-status__currency'>{account.currency}</span>
                        {account.isVirtual && <span className='oauth-status__virtual-badge'>DEMO</span>}
                    </div>
                ))}
            </div>

            <Button tertiary onClick={logout} className='oauth-status__logout'>
                <Localize i18n_default_text='Logout' />
            </Button>
        </div>
    );
};

export default OAuthStatus;
