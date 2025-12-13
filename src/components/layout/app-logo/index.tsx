import { useDevice } from '@deriv-com/ui';
import './app-logo.scss';

export const AppLogo = () => {
    const { isDesktop } = useDevice();

    if (!isDesktop) return null;
    return (
        <a
            href='https://autotrades.site'
            target='_blank'
            rel='noopener noreferrer'
            className='app-header__logo traders-den-logo'
        >
            <span className='traders-den-text'>TRADERS DEN</span>
        </a>
    );
};
