import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import AnalysisTool from '@/components/analysis-tool/AnalysisTool';
import ChunkLoader from '@/components/loader/chunk-loader';
import DesktopWrapper from '@/components/shared_ui/desktop-wrapper';
import Dialog from '@/components/shared_ui/dialog';
import MobileWrapper from '@/components/shared_ui/mobile-wrapper';
import Tabs from '@/components/shared_ui/tabs/tabs';
import SignalsCenter from '@/components/signals/SignalsCenter';
import { SpeedModeOverlay } from '@/components/speed-mode/SpeedModeOverlay';
import TradingViewModal from '@/components/trading-view-chart/trading-view-modal';
import { ZeusAnalysisTool } from '@/components/zeus-analysis/ZeusAnalysisTool';
import { DBOT_TABS } from '@/constants/bot-contents';
import { api_base, updateWorkspaceName } from '@/external/bot-skeleton';
import { CONNECTION_STATUS } from '@/external/bot-skeleton/services/api/observables/connection-status-stream';
import { useApiBase } from '@/hooks/useApiBase';
import { useStore } from '@/hooks/useStore';
import { Localize, localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import RunPanel from '../../components/run-panel';
import ChartModal from '../chart/chart-modal';
import Dashboard from '../dashboard';
import RunStrategy from '../dashboard/run-strategy';

const Chart = lazy(() => import('../chart'));
const Tutorial = lazy(() => import('../tutorials'));
const SpeedMode = lazy(() => import('../speed-mode'));
const FastLane = lazy(() => import('../fast-lane'));
const AdvancedAlgo = lazy(() => import('../advanced-algo'));

const DashboardIcon = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' fill='currentColor' />
        <path d='M4 4h6v8H4V4zm10 0h6v4h-6V4zM4 15h6v4H4v-4zm10-3h6v8h-6v-8z' fill='currentColor' opacity='0.6' />
        <circle cx='7' cy='8' r='1.5' fill='#ffd700' />
        <circle cx='17' cy='6' r='1.5' fill='#ffd700' />
        <circle cx='7' cy='17' r='1.5' fill='#ffd700' />
        <circle cx='17' cy='15' r='1.5' fill='#ffd700' />
    </svg>
);

const BotBuilderIcon = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='7' y='4' width='10' height='7' rx='1' stroke='currentColor' strokeWidth='2' fill='none' />
        <rect x='7' y='13' width='10' height='7' rx='1' stroke='currentColor' strokeWidth='2' fill='none' />
        <circle cx='12' cy='7.5' r='1.5' fill='#ffd700' />
        <circle cx='12' cy='16.5' r='1.5' fill='#ffd700' />
        <path d='M12 11V13' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
        <path d='M9 7.5H7M17 7.5H15M9 16.5H7M17 16.5H15' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
        <circle cx='5' cy='7.5' r='1' fill='#ffd700' />
        <circle cx='19' cy='7.5' r='1' fill='#ffd700' />
        <circle cx='5' cy='16.5' r='1' fill='#ffd700' />
        <circle cx='19' cy='16.5' r='1' fill='#ffd700' />
    </svg>
);

const ChartsIcon = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M3 3v18h18' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
        <path
            d='M7 14l3-3 3 3 5-7'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
        <circle cx='7' cy='14' r='1.5' fill='#ffd700' />
        <circle cx='10' cy='11' r='1.5' fill='#ffd700' />
        <circle cx='13' cy='14' r='1.5' fill='#ffd700' />
        <circle cx='18' cy='7' r='1.5' fill='#ffd700' />
        <path d='M18 7v3m0 0h-3m3 0l-5 7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' opacity='0.5' />
    </svg>
);

const TutorialsIcon = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='3' y='4' width='18' height='16' rx='2' stroke='currentColor' strokeWidth='2' fill='none' />
        <path d='M10 9l6 3-6 3V9z' fill='#ffd700' />
        <circle cx='10' cy='9' r='1' fill='currentColor' opacity='0.6' />
        <circle cx='16' cy='12' r='1' fill='currentColor' opacity='0.6' />
        <circle cx='10' cy='15' r='1' fill='currentColor' opacity='0.6' />
        <path d='M3 7h18M7 4v3M17 4v3' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' opacity='0.5' />
    </svg>
);

const AnalysisToolIcon = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='5' y='7' width='4' height='10' rx='1' stroke='currentColor' strokeWidth='2' fill='none' />
        <rect x='11' y='4' width='4' height='13' rx='1' stroke='currentColor' strokeWidth='2' fill='none' />
        <rect x='17' y='9' width='4' height='8' rx='1' stroke='currentColor' strokeWidth='2' fill='none' />
        <path d='M7 3v4M13 2v2M19 7v2' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' opacity='0.5' />
        <path d='M7 17v2M13 17v2M19 17v2' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' opacity='0.5' />
        <circle cx='7' cy='12' r='1.5' fill='#ffd700' />
        <circle cx='13' cy='10' r='1.5' fill='#ffd700' />
        <circle cx='19' cy='13' r='1.5' fill='#ffd700' />
    </svg>
);

const ZeusAnalysisIcon = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
            d='M13 2L3 14h8l-2 8 10-12h-8l2-8z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinejoin='round'
            fill='none'
        />
        <path d='M13 2L3 14h8l-2 8 10-12h-8l2-8z' fill='#ffd700' opacity='0.3' />
        <circle cx='11' cy='10' r='1.5' fill='#ffd700' />
        <circle cx='13' cy='16' r='1.5' fill='#ffd700' />
    </svg>
);

const SignalsIcon = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M4 4l4 4-4 4' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        <path
            d='M4 16l4 4-4 4'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            opacity='0.5'
        />
        <rect x='10' y='5' width='10' height='3' rx='1' fill='#ffd700' />
        <rect x='10' y='11' width='7' height='3' rx='1' fill='currentColor' opacity='0.6' />
        <rect x='10' y='17' width='10' height='3' rx='1' fill='#ffd700' />
        <circle cx='20' cy='6.5' r='1.5' fill='currentColor' />
        <circle cx='20' cy='18.5' r='1.5' fill='currentColor' />
    </svg>
);

const AdvancedAlgoIcon = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        {/* Brain/AI symbol */}
        <path
            d='M12 2C8.5 2 6 4.5 6 8c0 1.5.5 3 1.5 4.5L12 22l4.5-9.5C17.5 11 18 9.5 18 8c0-3.5-2.5-6-6-6z'
            stroke='currentColor'
            strokeWidth='2'
            fill='none'
        />
        {/* Algorithm pattern */}
        <circle cx='12' cy='8' r='2' fill='#3b82f6' />
        <path d='M10 8h4M12 6v4' stroke='#fff' strokeWidth='1.5' strokeLinecap='round' />
        {/* Data points */}
        <circle cx='8' cy='6' r='1' fill='#10b981' />
        <circle cx='16' cy='6' r='1' fill='#10b981' />
        <circle cx='8' cy='10' r='1' fill='#f59e0b' />
        <circle cx='16' cy='10' r='1' fill='#f59e0b' />
        {/* Connection lines */}
        <path
            d='M9 6.5L11 7.5M15 7.5L17 6.5M9 9.5L11 8.5M15 8.5L17 9.5'
            stroke='currentColor'
            strokeWidth='1'
            opacity='0.6'
        />
        {/* AI badge */}
        <text x='12' y='16' textAnchor='middle' fontSize='6' fill='#3b82f6' fontWeight='bold'>
            AI
        </text>
    </svg>
);

const FreeBotsIcon = () => (
    <svg
        fill='var(--text-general)'
        width='20px'
        height='20px'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
        data-name='Layer 1'
    >
        <path d='M10,13H4a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V14A1,1,0,0,0,10,13ZM9,19H5V15H9ZM20,3H14a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V4A1,1,0,0,0,20,3ZM19,9H15V5h4Zm1,7H18V14a1,1,0,0,0-2,0v2H14a1,1,0,0,0,0,2h2v2a1,1,0,0,0,2,0V18h2a1,1,0,0,0,0-2ZM10,3H4A1,1,0,0,0,3,4v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V4A1,1,0,0,0,10,3ZM9,9H5V5H9Z' />
    </svg>
);

const SpeedModeIcon = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
            d='M13 2L3 14h8l-2 8 10-12h-8l2-8z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinejoin='round'
            fill='none'
        />
        <path d='M13 2L3 14h8l-2 8 10-12h-8l2-8z' fill='#ffd700' opacity='0.4' />
        <circle cx='11' cy='10' r='1.5' fill='#ffd700' />
        <circle cx='13' cy='16' r='1.5' fill='#ffd700' />
        <path d='M18 6l2 2-2 2' stroke='#ffd700' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
);

const FastLaneIcon = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        {/* Lightning bolt */}
        <path
            d='M13 2L3 14h8l-2 8 10-12h-8l2-8z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinejoin='round'
            fill='none'
        />
        <path d='M13 2L3 14h8l-2 8 10-12h-8l2-8z' fill='#ffd700' opacity='0.5' />
        {/* Speed lines */}
        <path d='M16 4h6M17 7h5M18 10h4' stroke='#ffd700' strokeWidth='2' strokeLinecap='round' opacity='0.8' />
        {/* Accent dots */}
        <circle cx='11' cy='10' r='1.5' fill='#ffd700' />
        <circle cx='13' cy='16' r='1.5' fill='#ffd700' />
    </svg>
);

const AppWrapper = observer(() => {
    const { connectionStatus } = useApiBase();
    const { dashboard, load_modal, run_panel, summary_card } = useStore();
    const { active_tab, is_chart_modal_visible, setActiveTab } = dashboard;
    const { onEntered } = load_modal;
    const {
        is_dialog_open,
        dialog_options,
        onCancelButtonClick,
        onCloseDialog,
        onOkButtonClick,
        stopBot,
        is_drawer_open,
    } = run_panel;
    const { cancel_button_text, ok_button_text, title, message } = dialog_options as { [key: string]: string };
    const { clear } = summary_card;
    const { isDesktop } = useDevice();

    type BotType = {
        title: string;
        image: string;
        filePath: string;
        xmlContent: string;
    };
    const [bots, setBots] = useState<BotType[]>([]);
    const [analysisToolUrl, setAnalysisToolUrl] = useState('ai');

    useEffect(() => {
        if (connectionStatus !== CONNECTION_STATUS.OPENED) {
            const is_bot_running = document.getElementById('db-animation__stop-button') !== null;
            if (is_bot_running) {
                clear();
                stopBot();
                api_base.setIsRunning(false);
            }
        }
    }, [clear, connectionStatus, stopBot]);

    useEffect(() => {
        const fetchBots = async () => {
            const botFiles = [
                'CFX-025-Base.xml',
                'CFX-025-Step1.xml',
                'CFX-025-Step2.xml',
                'CFX-025-Step3.xml',
                'CFX-025-Step4.xml',
                'CFX-025-Enhanced.xml',
                'Digit-Hunter-Pro.xml',
                'MatchesMaster.xml',
                'MarketMakerPro-Enhanced.xml',
                'MarketMakerPro.xml',
                'CFX-EvenOdd.xml',
                'CFX-RiseFall.xml',
                'Deriv Killer - Elvis Trades.xml',
                'Odins_ghost.xml',
                'M27 Auto Switch bot 2024 (1).xml',
                'Even Odd Ghost V1 by Dexter.xml',

                'Over 3 Delirium by Elvis Trades.xml',
                'GreenLight Pro - 2026 Over .xml',

                'EVENODD Double loss Bot .xml',
                'Over2 Master.xml',
                'CFX - 025.xml',
                'noloss bot.xml',
                'Elvis SpeedBot(With Entry).xml',
                'AUTO C4 VOLT 🇬🇧 2 🇬🇧 AI PREMIUM ROBOT  (2) (1).xml',
                '$Dollar printer .xml',

                'Over_Under Ghost - by ElvisTrades.xml',
                'Over_Under Ghost v2 - by Elvis Trades.xml',
                'Flipping-Tool-2026 - Elvis Trades (1).xml',
            ];
            const botPromises = botFiles.map(async file => {
                try {
                    const response = await fetch(file);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
                    }
                    const text = await response.text();
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(text, 'application/xml');
                    return {
                        title: file.split('/').pop(),
                        image: xml.getElementsByTagName('image')[0]?.textContent || 'default_image_path',
                        filePath: file,
                        xmlContent: text,
                    };
                } catch (error) {
                    console.error(error);
                    return null;
                }
            });
            const bots = (await Promise.all(botPromises)).filter(Boolean);
            setBots(bots);
        };
        fetchBots();
    }, []);

    const handleBotClick = useCallback(
        async bot => {
            setActiveTab(DBOT_TABS.BOT_BUILDER);
            try {
                if (typeof load_modal.loadStrategyToBuilder === 'function') {
                    await load_modal.loadStrategyToBuilder({
                        id: bot.filePath, // Use filePath as id (or generate a unique id if needed)
                        name: bot.title,
                        xml: bot.xmlContent,
                        save_type: 'LOCAL', // or another type if needed
                    });
                } else {
                    console.error('loadStrategyToBuilder is not defined on load_modal');
                }
                updateWorkspaceName();
            } catch (error) {
                console.error('Error loading bot file:', error);
            }
        },
        [setActiveTab, load_modal]
    );

    const handleOpen = useCallback(async () => {
        await load_modal.loadFileFromRecent();
        setActiveTab(DBOT_TABS.BOT_BUILDER);
    }, [load_modal, setActiveTab]);

    // Listen for CFX bot load events from signals
    useEffect(() => {
        const handleCFXBotLoad = async (event: Event) => {
            const customEvent = event as CustomEvent;
            const { botFile, signalType, market, prediction } = customEvent.detail;
            console.log('📥 Received CFX bot load request:', { botFile, signalType, market, prediction });

            // Find the bot in the bots array
            const bot = bots.find(b => b.filePath === botFile);
            if (bot) {
                console.log('✅ Found bot, configuring with signal parameters...');

                // Parse and configure the XML with signal parameters
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(bot.xmlContent, 'text/xml');

                // Update market (SYMBOL_LIST)
                const symbolFields = xmlDoc.querySelectorAll('field[name="SYMBOL_LIST"]');
                symbolFields.forEach(field => {
                    field.textContent = market;
                    console.log(`📊 Market set to: ${market}`);
                });

                // Update contract type based on signal type
                let contractType = '';
                if (signalType === 'EVEN') {
                    contractType = 'DIGITEVEN';
                } else if (signalType === 'ODD') {
                    contractType = 'DIGITODD';
                } else if (signalType === 'RISE') {
                    contractType = 'CALL';
                } else if (signalType === 'FALL') {
                    contractType = 'PUT';
                }

                const typeFields = xmlDoc.querySelectorAll('field[name="TYPE_LIST"]');
                typeFields.forEach(field => {
                    field.textContent = contractType;
                    console.log(`📝 Contract type set to: ${contractType}`);
                });

                // Also update PURCHASE_LIST fields (in purchase blocks)
                const purchaseFields = xmlDoc.querySelectorAll('field[name="PURCHASE_LIST"]');
                purchaseFields.forEach(field => {
                    field.textContent = contractType;
                    console.log(`💰 Purchase type set to: ${contractType}`);
                });

                // Update prediction digit for OVER/UNDER signals
                if (prediction !== undefined) {
                    const predictionFields = xmlDoc.querySelectorAll('field[name="NUM"]');
                    // Find the prediction field (it's in a math_number_positive block)
                    predictionFields.forEach(field => {
                        const parent = field.parentElement;
                        if (parent && parent.getAttribute('type') === 'math_number_positive') {
                            field.textContent = prediction.toString();
                            console.log(`🎯 Prediction digit set to: ${prediction}`);
                        }
                    });
                }

                // Serialize back to XML
                const serializer = new XMLSerializer();
                const configuredXml = serializer.serializeToString(xmlDoc);

                // Create a configured bot object
                const configuredBot = {
                    ...bot,
                    xmlContent: configuredXml,
                };

                console.log('✅ Bot configured, loading into workspace...');
                await handleBotClick(configuredBot);
            } else {
                console.error('❌ Bot not found:', botFile);
            }
        };

        window.addEventListener('load.cfx.bot', handleCFXBotLoad);
        return () => {
            window.removeEventListener('load.cfx.bot', handleCFXBotLoad);
        };
    }, [bots, handleBotClick]);

    // Listen for MatchesMaster bot auto-open events from Zeus Analysis
    useEffect(() => {
        const handleMatchesMasterOpen = async (event: Event) => {
            const customEvent = event as CustomEvent;
            const { predictedDigit, market } = customEvent.detail;
            console.log('📥 Received MatchesMaster auto-open request:', { predictedDigit, market });

            // Find the MatchesMaster bot in the bots array
            const matchesMasterBot = bots.find(b => b.filePath === 'MatchesMaster.xml');
            if (matchesMasterBot) {
                console.log('✅ Found MatchesMaster bot, configuring with Zeus prediction...');

                // Parse and configure the XML with Zeus parameters
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(matchesMasterBot.xmlContent, 'text/xml');

                // Update market (SYMBOL_LIST)
                const symbolFields = xmlDoc.querySelectorAll('field[name="SYMBOL_LIST"]');
                symbolFields.forEach(field => {
                    field.textContent = market;
                    console.log(`📊 Market set to: ${market}`);
                });

                // Update target digit in the Target Digit variable initialization
                const targetDigitFields = xmlDoc.querySelectorAll('block[type="variables_set"] field[name="VAR"]');
                targetDigitFields.forEach(field => {
                    if (field.textContent === 'Target Digit') {
                        // Find the NUM field in the same block
                        const block = field.closest('block[type="variables_set"]');
                        if (block) {
                            const numField = block.querySelector('block[type="math_number"] field[name="NUM"]');
                            if (numField) {
                                numField.textContent = predictedDigit.toString();
                                console.log(`🎯 Target digit set to: ${predictedDigit}`);
                            }
                        }
                    }
                });

                // Serialize back to XML
                const serializer = new XMLSerializer();
                const configuredXml = serializer.serializeToString(xmlDoc);

                // Create a configured bot object
                const configuredBot = {
                    ...matchesMasterBot,
                    xmlContent: configuredXml,
                    title: `MatchesMaster - Digit ${predictedDigit}`,
                };

                console.log('✅ MatchesMaster configured, loading into workspace...');
                await handleBotClick(configuredBot);
            } else {
                console.error('❌ MatchesMaster bot not found');
            }
        };

        window.addEventListener('open.matchesmaster.bot', handleMatchesMasterOpen);
        return () => {
            window.removeEventListener('open.matchesmaster.bot', handleMatchesMasterOpen);
        };
    }, [bots, handleBotClick]);

    const toggleAnalysisTool = (url: string) => setAnalysisToolUrl(url);

    const showRunPanel = [DBOT_TABS.BOT_BUILDER, DBOT_TABS.CHART, DBOT_TABS.ANALYSIS_TOOL, DBOT_TABS.SIGNALS].includes(
        active_tab
    );

    return (
        <>
            <div className={classNames('main', { 'main--fast-lane': active_tab === DBOT_TABS.FAST_LANE })}>
                <div className='main__container'>
                    <Tabs
                        active_index={active_tab}
                        className='main__tabs dc-tabs--enhanced'
                        onTabItemChange={onEntered}
                        onTabItemClick={setActiveTab}
                        top
                    >
                        {/* DASHBOARD TAB */}
                        <div
                            label={
                                <>
                                    <DashboardIcon />
                                    <Localize i18n_default_text='Dashboard' />
                                </>
                            }
                            id='id-dbot-dashboard'
                        >
                            <Dashboard handleTabChange={setActiveTab} />
                            <button onClick={handleOpen}>Load Bot</button>
                        </div>
                        {/* BOT BUILDER TAB */}
                        <div
                            label={
                                <>
                                    <BotBuilderIcon />
                                    <Localize i18n_default_text='Bot Builder' />
                                </>
                            }
                            id='id-bot-builder'
                        />
                        {/* CHARTS TAB */}
                        <div
                            label={
                                <>
                                    <ChartsIcon />
                                    <Localize i18n_default_text='Charts' />
                                </>
                            }
                            id='id-charts'
                        >
                            <Suspense fallback={<ChunkLoader message={localize('Please wait, loading chart...')} />}>
                                <Chart show_digits_stats={false} />
                            </Suspense>
                        </div>
                        {/* TUTORIALS TAB */}
                        <div
                            label={
                                <>
                                    <TutorialsIcon />
                                    <Localize i18n_default_text='Tutorials' />
                                </>
                            }
                            id='id-tutorials'
                        >
                            <Suspense
                                fallback={<ChunkLoader message={localize('Please wait, loading tutorials...')} />}
                            >
                                <Tutorial handleTabChange={setActiveTab} />
                            </Suspense>
                        </div>
                        {/* ANALYSIS TOOL TAB */}
                        <div
                            label={
                                <>
                                    <AnalysisToolIcon />
                                    <Localize i18n_default_text='Analysis Tool' />
                                </>
                            }
                            id='id-analysis-tool'
                        >
                            <div
                                className={classNames('dashboard__chart-wrapper', {
                                    'dashboard__chart-wrapper--expanded': is_drawer_open && isDesktop,
                                    'dashboard__chart-wrapper--modal': is_chart_modal_visible && isDesktop,
                                })}
                                style={{
                                    height: '100vh',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        padding: '16px',
                                        background: 'linear-gradient(135deg, #7d1f3d 0%, #9f2a4f 100%)',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        flexShrink: 0,
                                    }}
                                >
                                    <button
                                        onClick={() => toggleAnalysisTool('internal')}
                                        style={{
                                            flex: 1,
                                            backgroundColor:
                                                analysisToolUrl === 'internal' ? '#0d9488' : 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            padding: '12px 20px',
                                            border:
                                                analysisToolUrl === 'internal'
                                                    ? '2px solid #ffd700'
                                                    : '2px solid rgba(255,255,255,0.2)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            transition: 'all 0.3s ease',
                                            boxShadow:
                                                analysisToolUrl === 'internal'
                                                    ? '0 4px 12px rgba(13,148,136,0.3)'
                                                    : 'none',
                                        }}
                                        onMouseEnter={e => {
                                            if (analysisToolUrl !== 'internal') {
                                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (analysisToolUrl !== 'internal') {
                                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }
                                        }}
                                    >
                                        📊 Advanced Analysis
                                    </button>
                                    <button
                                        onClick={() => toggleAnalysisTool('ai')}
                                        style={{
                                            flex: 1,
                                            backgroundColor:
                                                analysisToolUrl === 'ai' ? '#0d9488' : 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            padding: '12px 20px',
                                            border:
                                                analysisToolUrl === 'ai'
                                                    ? '2px solid #ffd700'
                                                    : '2px solid rgba(255,255,255,0.2)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            transition: 'all 0.3s ease',
                                            boxShadow:
                                                analysisToolUrl === 'ai' ? '0 4px 12px rgba(13,148,136,0.3)' : 'none',
                                        }}
                                        onMouseEnter={e => {
                                            if (analysisToolUrl !== 'ai') {
                                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (analysisToolUrl !== 'ai') {
                                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }
                                        }}
                                    >
                                        🤖 Zeus AI Tool
                                    </button>
                                    <button
                                        onClick={() => toggleAnalysisTool('ldpanalyzer')}
                                        style={{
                                            flex: 1,
                                            backgroundColor:
                                                analysisToolUrl === 'ldpanalyzer' ? '#0d9488' : 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            padding: '12px 20px',
                                            border:
                                                analysisToolUrl === 'ldpanalyzer'
                                                    ? '2px solid #ffd700'
                                                    : '2px solid rgba(255,255,255,0.2)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            transition: 'all 0.3s ease',
                                            boxShadow:
                                                analysisToolUrl === 'ldpanalyzer'
                                                    ? '0 4px 12px rgba(13,148,136,0.3)'
                                                    : 'none',
                                        }}
                                        onMouseEnter={e => {
                                            if (analysisToolUrl !== 'ldpanalyzer') {
                                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (analysisToolUrl !== 'ldpanalyzer') {
                                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }
                                        }}
                                    >
                                        📈 LDP Analyzer
                                    </button>
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                                    {analysisToolUrl === 'internal' ? (
                                        <AnalysisTool />
                                    ) : (
                                        <iframe
                                            src={analysisToolUrl}
                                            width='100%'
                                            style={{
                                                border: 'none',
                                                display: 'block',
                                                height: '100%',
                                                background: '#f8fafc',
                                            }}
                                            scrolling='yes'
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* ZEUS ANALYSIS TAB */}
                        <div
                            label={
                                <>
                                    <ZeusAnalysisIcon />
                                    <Localize i18n_default_text='Zeus Analysis' />
                                </>
                            }
                            id='id-zeus-analysis'
                        >
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '1rem',
                                    background: 'var(--general-main-1)',
                                }}
                            >
                                <ZeusAnalysisTool onNavigateToFreeBots={() => setActiveTab(10)} />
                            </div>
                        </div>
                        {/* SIGNALS TAB */}
                        <div
                            label={
                                <>
                                    <SignalsIcon />
                                    <Localize i18n_default_text='Signals' />
                                    <span className='tab-badge'>10</span>
                                </>
                            }
                            id='id-signals'
                        >
                            <SignalsCenter />
                        </div>
                        {/* ADVANCED ALGO TAB */}
                        <div
                            label={
                                <>
                                    <AdvancedAlgoIcon />
                                    <Localize i18n_default_text='Advanced Algo' />
                                    <span className='tab-badge ai-badge'>AI</span>
                                </>
                            }
                            id='id-advanced-algo'
                        >
                            <Suspense fallback={<ChunkLoader message={localize('Loading Advanced Algo...')} />}>
                                <AdvancedAlgo />
                            </Suspense>
                        </div>

                        {/* SPEED MODE TAB */}
                        <div
                            label={
                                <>
                                    <SpeedModeIcon />
                                    <Localize i18n_default_text='Speed Mode' />
                                    <span className='tab-badge beta-badge'>BETA</span>
                                </>
                            }
                            id='id-speed-mode'
                        >
                            <Suspense fallback={<ChunkLoader message={localize('Loading Speed Mode...')} />}>
                                <SpeedMode />
                            </Suspense>
                        </div>

                        {/* FREE BOTS TAB */}
                        <div
                            label={
                                <>
                                    <FreeBotsIcon />
                                    <Localize i18n_default_text='Free Bots' />
                                </>
                            }
                            id='id-free-bots'
                        >
                            <div
                                className='free-bots'
                                style={{
                                    background: '#ffffff',
                                    position: 'fixed',
                                    top: '120px',
                                    left: 0,
                                    right: 0,
                                    bottom: '100px',
                                    width: '100%',
                                    padding: '2rem',
                                    margin: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.05)',
                                }}
                            >
                                <h2
                                    style={{
                                        color: '#1a1a2e',
                                        fontSize: '2rem',
                                        fontWeight: '700',
                                        marginBottom: '1.5rem',
                                        textAlign: 'center',
                                        borderBottom: '3px solid #0d9488',
                                        paddingBottom: '1rem',
                                        flexShrink: 0,
                                    }}
                                >
                                    🤖 Free Trading Bots
                                </h2>
                                <ul
                                    className='free-bots__list'
                                    style={{
                                        listStyle: 'none',
                                        padding: 0,
                                        margin: 0,
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                                        gap: '1.5rem',
                                        width: '100%',
                                        gridAutoRows: 'min-content',
                                        flex: 1,
                                        overflowY: 'auto',
                                        paddingBottom: '8rem',
                                    }}
                                >
                                    {bots.length === 0 ? (
                                        <li
                                            style={{
                                                textAlign: 'center',
                                                padding: '3rem',
                                                color: '#6c757d',
                                                fontSize: '1.1rem',
                                                gridColumn: '1 / -1',
                                            }}
                                        >
                                            <Localize i18n_default_text='No free bots available.' />
                                        </li>
                                    ) : (
                                        bots.map((bot, index) => (
                                            <li
                                                key={index}
                                                className='free-bot-item'
                                                style={{
                                                    background: '#f8f9fa',
                                                    borderRadius: '16px',
                                                    padding: '1.5rem',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '1rem',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                                    transition: 'all 0.3s ease',
                                                    cursor: 'pointer',
                                                    border: '2px solid #e0e0e0',
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                                    e.currentTarget.style.boxShadow =
                                                        '0 12px 24px rgba(13, 148, 136, 0.2)';
                                                    e.currentTarget.style.borderColor = '#0d9488';
                                                    e.currentTarget.style.background = '#ffffff';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                                                    e.currentTarget.style.borderColor = '#e0e0e0';
                                                    e.currentTarget.style.background = '#f8f9fa';
                                                }}
                                                onClick={() => handleBotClick(bot)}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '1rem',
                                                        width: '100%',
                                                        pointerEvents: 'none',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '8px',
                                                            background:
                                                                'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '1.5rem',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        🤖
                                                    </div>
                                                    <h3
                                                        style={{
                                                            margin: 0,
                                                            color: '#1a1a2e',
                                                            fontSize: '1.1rem',
                                                            fontWeight: '600',
                                                            flex: 1,
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        {bot.title || 'Untitled Bot'}
                                                    </h3>
                                                </div>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        color: '#6c757d',
                                                        fontSize: '0.9rem',
                                                        lineHeight: '1.5',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        pointerEvents: 'none',
                                                    }}
                                                >
                                                    Click to load this bot into your workspace
                                                </p>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginTop: 'auto',
                                                        paddingTop: '0.5rem',
                                                        borderTop: '1px solid #e0e0e0',
                                                        pointerEvents: 'none',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: '0.75rem',
                                                            color: '#0d9488',
                                                            fontWeight: '600',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px',
                                                        }}
                                                    >
                                                        Free
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: '0.85rem',
                                                            color: '#0d9488',
                                                            fontWeight: '500',
                                                        }}
                                                    >
                                                        Load →
                                                    </span>
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                                <style>
                                    {`
                                        /* Responsive adjustments */
                                        @media (max-width: 768px) {
                                            .free-bots__list {
                                                grid-template-columns: 1fr !important;
                                                padding: 1rem !important;
                                            }
                                            .free-bot-item h3 {
                                                font-size: 0.95rem !important;
                                                white-space: normal !important;
                                            }
                                            .free-bot-item p {
                                                font-size: 0.8rem !important;
                                            }
                                        }

                                        /* Extra small screens */
                                        @media (max-width: 480px) {
                                            .free-bots__list {
                                                padding: 0.75rem !important;
                                                gap: 0.5rem !important;
                                            }
                                            .free-bot-item {
                                                padding: 0.75rem !important;
                                            }
                                        }
                                    `}
                                </style>
                            </div>
                        </div>
                        {/* FAST LANE TAB */}
                        <div
                            label={
                                <>
                                    <FastLaneIcon />
                                    <Localize i18n_default_text='Fast Lane' />
                                    <span className='tab-badge beta-badge'>BETA</span>
                                </>
                            }
                            id='id-fast-lane'
                            className='fast-lane-tab-content'
                        >
                            <Suspense fallback={<ChunkLoader message={localize('Loading Fast Lane...')} />}>
                                <FastLane />
                            </Suspense>
                        </div>
                    </Tabs>
                </div>
            </div>
            <DesktopWrapper>
                <div className='main__run-strategy-wrapper'>
                    <RunStrategy />
                    {showRunPanel && <RunPanel />}
                </div>
                <ChartModal />
                <TradingViewModal />
            </DesktopWrapper>
            <MobileWrapper>
                <RunPanel />
            </MobileWrapper>
            <Dialog
                cancel_button_text={cancel_button_text || localize('Cancel')}
                confirm_button_text={ok_button_text || localize('Ok')}
                has_close_icon
                is_visible={is_dialog_open}
                onCancel={onCancelButtonClick}
                onClose={onCloseDialog}
                onConfirm={onOkButtonClick || onCloseDialog}
                title={title}
            >
                {message}
            </Dialog>
            <SpeedModeOverlay />
        </>
    );
});

export default AppWrapper;
