import React, { useState } from 'react';
import './TokenAuth.scss';

interface TokenAuthProps {
    onSuccess: (token: string, appId?: string) => void;
    onError?: (error: string) => void;
}

export const TokenAuth: React.FC<TokenAuthProps> = ({ onSuccess, onError }) => {
    const [token, setToken] = useState('');
    const [appId, setAppId] = useState('1089');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateToken = (token: string): boolean => {
        // Basic validation: token should be alphanumeric and at least 15 characters
        return token.length >= 15 && /^[a-zA-Z0-9]+$/.test(token);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateToken(token)) {
            const errorMsg = 'Invalid token format. Token must be at least 15 characters and alphanumeric.';
            setError(errorMsg);
            onError?.(errorMsg);
            return;
        }

        setLoading(true);

        try {
            // Save to localStorage
            localStorage.setItem('fast_lane_token', token);
            if (appId) {
                localStorage.setItem('fast_lane_app_id', appId);
            }

            // Call success callback
            onSuccess(token, appId);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to save token';
            setError(errorMsg);
            onError?.(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='token-auth'>
            <div className='token-auth__header'>
                <h2 className='token-auth__title'>Connect Your Account</h2>
                <p className='token-auth__description'>Enter your Deriv API token to start trading</p>
            </div>

            <form className='token-auth__form' onSubmit={handleSubmit}>
                <div className='token-auth__field'>
                    <label htmlFor='token' className='token-auth__label'>
                        API Token <span className='token-auth__required'>*</span>
                    </label>
                    <input
                        id='token'
                        type='text'
                        className='token-auth__input'
                        value={token}
                        onChange={e => setToken(e.target.value)}
                        placeholder='Enter your API token'
                        disabled={loading}
                        required
                    />
                    <p className='token-auth__help'>
                        Don&apos;t have a token?{' '}
                        <a
                            href='https://app.deriv.com/account/api-token'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='token-auth__link'
                        >
                            Get one here
                        </a>
                    </p>
                </div>

                <div className='token-auth__field'>
                    <label htmlFor='appId' className='token-auth__label'>
                        App ID <span className='token-auth__optional'>(optional)</span>
                    </label>
                    <input
                        id='appId'
                        type='text'
                        className='token-auth__input'
                        value={appId}
                        onChange={e => setAppId(e.target.value)}
                        placeholder='1089'
                        disabled={loading}
                    />
                    <p className='token-auth__help'>Leave as default unless you have a custom App ID</p>
                </div>

                {error && (
                    <div className='token-auth__error'>
                        <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                            <circle cx='8' cy='8' r='7' stroke='currentColor' strokeWidth='2' />
                            <path d='M8 4v5M8 11v1' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
                        </svg>
                        {error}
                    </div>
                )}

                <button type='submit' className='token-auth__button' disabled={loading || !token}>
                    {loading ? (
                        <>
                            <span className='token-auth__spinner' />
                            Connecting...
                        </>
                    ) : (
                        'Connect'
                    )}
                </button>
            </form>
        </div>
    );
};

export default TokenAuth;
