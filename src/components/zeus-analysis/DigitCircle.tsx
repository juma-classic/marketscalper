/**
 * DigitCircle Component
 * Displays a single digit with its statistics in a circular format
 */

import React from 'react';

interface DigitCircleProps {
    digit: number;
    count: number;
    percentage: number;
    ringClass: string;
    isCurrent: boolean;
    ariaLabel?: string;
}

export const DigitCircle: React.FC<DigitCircleProps> = React.memo(({ 
    digit, 
    count, 
    percentage, 
    ringClass, 
    isCurrent,
    ariaLabel 
}) => {
    return (
        <div 
            className={`digit-circle ${ringClass} ${isCurrent ? 'current' : ''}`}
            role="listitem"
            aria-label={ariaLabel || `Digit ${digit}: ${percentage.toFixed(1)}% occurrence, ${count} times${isCurrent ? '. Current digit' : ''}`}
            tabIndex={0}
        >
            {isCurrent && (
                <div className='tick-pointer' aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15 8L12 14L9 8L12 2Z" fill="#ef4444" stroke="#dc2626" strokeWidth="1.5"/>
                        <circle cx="12" cy="12" r="3" fill="#ef4444"/>
                    </svg>
                </div>
            )}
            <div className='circle-content'>
                <div className='digit-number' aria-hidden="true">{digit}</div>
                <div className='digit-percentage' aria-hidden="true">{percentage.toFixed(1)}%</div>
            </div>
        </div>
    );
});

DigitCircle.displayName = 'DigitCircle';
