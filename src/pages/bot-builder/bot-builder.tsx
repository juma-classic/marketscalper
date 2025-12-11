import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { LiveAnalysisOverlay } from '@/components/bot-builder/LiveAnalysisOverlay';
import './bot-builder-live-analysis.scss';
import { botNotification } from '@/components/bot-notification/bot-notification';
import { notification_message } from '@/components/bot-notification/bot-notification-utils';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { TBlocklyEvents } from 'Types';
import LoadModal from '../../components/load-modal';
import SaveModal from '../dashboard/bot-list/save-modal';
import BotBuilderTourHandler from '../tutorials/dbot-tours/bot-builder-tour';
import QuickStrategy1 from './quick-strategy';
import WorkspaceWrapper from './workspace-wrapper';

const BotBuilder = observer(() => {
    const { dashboard, app, run_panel, toolbar, quick_strategy, blockly_store } = useStore();
    const { active_tab, active_tour, is_preview_on_popup } = dashboard;
    const { is_open } = quick_strategy;
    const { is_running } = run_panel;
    const { is_loading } = blockly_store;
    const is_blockly_listener_registered = React.useRef(false);
    const is_blockly_delete_listener_registered = React.useRef(false);
    const { isDesktop } = useDevice();
    const { onMount, onUnmount } = app;
    const el_ref = React.useRef<HTMLInputElement | null>(null);

    // Live Analysis Overlay State
    const [showLiveAnalysis, setShowLiveAnalysis] = React.useState(false);
    const [isAnalysisMinimized, setIsAnalysisMinimized] = React.useState(false);
    const [overlayMarket, setOverlayMarket] = React.useState('R_50');
    const [overlayTradeType, setOverlayTradeType] = React.useState<'evenodd' | 'risefall' | 'overunder'>('evenodd');

    // TODO: fix
    // const isMounted = useIsMounted();
    // const { data: remote_config_data } = useRemoteConfig(isMounted());
    let deleted_block_id: null | string = null;

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, [onMount, onUnmount]);

    React.useEffect(() => {
        const workspace = window.Blockly?.derivWorkspace;
        if (workspace && is_running && !is_blockly_listener_registered.current) {
            is_blockly_listener_registered.current = true;
            workspace.addChangeListener(handleBlockChangeOnBotRun);
        } else {
            removeBlockChangeListener();
        }

        return () => {
            if (workspace && is_blockly_listener_registered.current) {
                removeBlockChangeListener();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_running]);

    const handleBlockChangeOnBotRun = (e: Event) => {
        const { is_reset_button_clicked } = toolbar;
        if (e.type !== 'selected' && !is_reset_button_clicked) {
            botNotification(notification_message().workspace_change);
            removeBlockChangeListener();
        } else if (is_reset_button_clicked) {
            removeBlockChangeListener();
        }
    };

    const removeBlockChangeListener = () => {
        is_blockly_listener_registered.current = false;
        window.Blockly?.derivWorkspace?.removeChangeListener(handleBlockChangeOnBotRun);
    };

    React.useEffect(() => {
        const workspace = window.Blockly?.derivWorkspace;
        if (workspace && !is_blockly_delete_listener_registered.current) {
            is_blockly_delete_listener_registered.current = true;
            workspace.addChangeListener(handleBlockDelete);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_loading]);

    const handleBlockDelete = (e: TBlocklyEvents) => {
        const { is_reset_button_clicked, setResetButtonState } = toolbar;
        if (e.type === 'delete' && !is_reset_button_clicked) {
            deleted_block_id = e.blockId;
        }
        if (e.type === 'selected' && deleted_block_id === e.oldElementId) {
            handleBlockDeleteNotification();
        }
        if (
            e.type === 'change' &&
            e.name === 'AMOUNT_LIMITS' &&
            e.newValue === '(min: 0.35 - max: 50000)' &&
            is_reset_button_clicked
        ) {
            setResetButtonState(false);
        }
    };

    const handleBlockDeleteNotification = () => {
        botNotification(notification_message().block_delete, {
            label: localize('Undo'),
            onClick: closeToast => {
                window.Blockly.derivWorkspace.undo();
                closeToast?.();
            },
        });
    };

    return (
        <>
            <div
                className={classNames('bot-builder', {
                    'bot-builder--active': active_tab === 1 && !is_preview_on_popup,
                    'bot-builder--inactive': is_preview_on_popup,
                    'bot-builder--tour-active': active_tour,
                })}
            >
                <div id='scratch_div' ref={el_ref}>
                    <WorkspaceWrapper />
                </div>

                {/* Live Analysis Toggle Button */}
                {active_tab === 1 && !is_preview_on_popup && (
                    <div className='live-analysis-controls'>
                        <button
                            className={`live-analysis-trigger ${showLiveAnalysis ? 'active' : ''}`}
                            onClick={() => setShowLiveAnalysis(!showLiveAnalysis)}
                            title='Toggle Live Analysis'
                        >
                            📊 Live Analysis
                        </button>
                        {showLiveAnalysis && (
                            <div className='analysis-quick-controls'>
                                <select
                                    value={overlayMarket}
                                    onChange={(e) => setOverlayMarket(e.target.value)}
                                    className='market-selector'
                                    title='Select Market'
                                >
                                    <optgroup label='Standard Indices'>
                                        <option value='R_10'>Volatility 10</option>
                                        <option value='R_25'>Volatility 25</option>
                                        <option value='R_50'>Volatility 50</option>
                                        <option value='R_75'>Volatility 75</option>
                                        <option value='R_100'>Volatility 100</option>
                                    </optgroup>
                                    <optgroup label='1-Second Indices'>
                                        <option value='1HZ10V'>Volatility 10 (1s)</option>
                                        <option value='1HZ25V'>Volatility 25 (1s)</option>
                                        <option value='1HZ50V'>Volatility 50 (1s)</option>
                                        <option value='1HZ75V'>Volatility 75 (1s)</option>
                                        <option value='1HZ100V'>Volatility 100 (1s)</option>
                                    </optgroup>
                                </select>
                                <select
                                    value={overlayTradeType}
                                    onChange={(e) => setOverlayTradeType(e.target.value as 'evenodd' | 'risefall' | 'overunder')}
                                    className='type-selector'
                                    title='Select Trade Type'
                                >
                                    <option value='evenodd'>Even/Odd</option>
                                    <option value='risefall'>Rise/Fall</option>
                                    <option value='overunder'>Over/Under</option>
                                </select>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {active_tab === 1 && <BotBuilderTourHandler is_mobile={!isDesktop} />}
            {/* removed this outside from toolbar becuase it needs to loaded seperately without dependency */}
            <LoadModal />
            <SaveModal />
            {is_open && <QuickStrategy1 />}

            {/* Live Analysis Overlay */}
            <LiveAnalysisOverlay
                market={overlayMarket}
                tradeType={overlayTradeType}
                isVisible={showLiveAnalysis && active_tab === 1}
                onClose={() => setShowLiveAnalysis(false)}
                onMinimize={() => setIsAnalysisMinimized(!isAnalysisMinimized)}
                isMinimized={isAnalysisMinimized}
            />
        </>
    );
});

export default BotBuilder;
