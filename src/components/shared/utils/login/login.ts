import { generateOAuthURL } from '@/utils/oauth-callback';

export const redirectToLogin = () => {
    // Use secure OAuth URL generation with CSRF protection
    const secureOAuthURL = generateOAuthURL();
    window.location.href = secureOAuthURL;
};
