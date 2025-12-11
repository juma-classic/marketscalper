import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { AuthWrapper } from './app/AuthWrapper';
import { TradersDenLoader } from './components/loader/TradersDenLoader';
import { AnalyticsInitializer } from './utils/analytics';
import './styles/index.scss';

// Load SpeedBot API script
const loadSpeedBotAPI = () => {
    const script = document.createElement('script');
    script.src = '/signals/speedbot-api.js';
    script.async = true;
    document.body.appendChild(script);
    console.log('SpeedBot API script loaded');
};

// Load the SpeedBot API when the app starts
window.addEventListener('DOMContentLoaded', loadSpeedBotAPI);

AnalyticsInitializer();

function AppWrapper() {
    const [isLoading, setIsLoading] = useState(true);

    if (isLoading) {
        return <TradersDenLoader onLoadComplete={() => setIsLoading(false)} duration={5000} />;
    }

    return <AuthWrapper />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<AppWrapper />);
