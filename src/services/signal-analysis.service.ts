/**
 * Signal Analysis Service
 * Analyzes real tick data to generate trading signals
 */

interface TickData {
    quote: number;
    epoch: number;
}

interface DigitAnalysis {
    digit: number;
    frequency: number;
    lastSeen: number;
    streak: number;
}

interface SignalResult {
    type:
        | 'RISE'
        | 'FALL'
        | 'EVEN'
        | 'ODD'
        | 'OVER1'
        | 'OVER2'
        | 'OVER3'
        | 'OVER4'
        | 'OVER5'
        | 'UNDER1'
        | 'UNDER2'
        | 'UNDER3'
        | 'UNDER4'
        | 'UNDER5';
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    strategy: string;
    entryDigit?: number;
    digitPattern?: number[];
    reason: string;
}

export class SignalAnalysisService {
    private tickHistory: TickData[] = [];
    private readonly MAX_HISTORY = 100;

    /**
     * Add new tick to history
     */
    addTick(tick: TickData): void {
        this.tickHistory.push(tick);
        if (this.tickHistory.length > this.MAX_HISTORY) {
            this.tickHistory.shift();
        }
    }

    /**
     * Get last digit from price
     */
    private getLastDigit(price: number): number {
        return Math.floor(Math.abs(price * 100)) % 10;
    }

    /**
     * Analyze digit frequency
     */
    private analyzeDigitFrequency(count: number = 50): Map<number, DigitAnalysis> {
        const analysis = new Map<number, DigitAnalysis>();

        // Initialize
        for (let i = 0; i < 10; i++) {
            analysis.set(i, { digit: i, frequency: 0, lastSeen: -1, streak: 0 });
        }

        const recentTicks = this.tickHistory.slice(-count);
        let currentStreak = 0;
        let lastDigit = -1;

        recentTicks.forEach((tick, index) => {
            const digit = this.getLastDigit(tick.quote);
            const digitData = analysis.get(digit)!;

            digitData.frequency++;
            digitData.lastSeen = index;

            // Track streaks
            if (digit === lastDigit) {
                currentStreak++;
            } else {
                currentStreak = 1;
                lastDigit = digit;
            }
            digitData.streak = Math.max(digitData.streak, currentStreak);
        });

        // Normalize frequency
        analysis.forEach(data => {
            data.frequency = data.frequency / recentTicks.length;
        });

        return analysis;
    }

    /**
     * Detect hot digits (appearing frequently)
     */
    private getHotDigits(threshold: number = 0.15): number[] {
        const analysis = this.analyzeDigitFrequency();
        return Array.from(analysis.values())
            .filter(d => d.frequency > threshold)
            .sort((a, b) => b.frequency - a.frequency)
            .map(d => d.digit);
    }

    /**
     * Detect cold digits (appearing rarely)
     */
    private getColdDigits(threshold: number = 0.05): number[] {
        const analysis = this.analyzeDigitFrequency();
        return Array.from(analysis.values())
            .filter(d => d.frequency < threshold)
            .map(d => d.digit);
    }

    /**
     * Analyze price trend
     */
    private analyzeTrend(count: number = 20): 'UP' | 'DOWN' | 'SIDEWAYS' {
        if (this.tickHistory.length < count) return 'SIDEWAYS';

        const recentTicks = this.tickHistory.slice(-count);
        const prices = recentTicks.map(t => t.quote);

        let upMoves = 0;
        let downMoves = 0;

        for (let i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i - 1]) upMoves++;
            else if (prices[i] < prices[i - 1]) downMoves++;
        }

        const totalMoves = upMoves + downMoves;
        const upRatio = totalMoves > 0 ? upMoves / totalMoves : 0.5;

        if (upRatio > 0.6) return 'UP';
        if (upRatio < 0.4) return 'DOWN';
        return 'SIDEWAYS';
    }

    /**
     * Detect digit patterns
     */
    private detectPattern(length: number = 5): number[] {
        if (this.tickHistory.length < length) return [];

        const recentDigits = this.tickHistory.slice(-length).map(t => this.getLastDigit(t.quote));

        return recentDigits;
    }

    /**
     * Analyze even/odd distribution
     */
    private analyzeEvenOdd(count: number = 30): { even: number; odd: number } {
        const recentTicks = this.tickHistory.slice(-count);
        let even = 0;
        let odd = 0;

        recentTicks.forEach(tick => {
            const digit = this.getLastDigit(tick.quote);
            if (digit % 2 === 0) even++;
            else odd++;
        });

        return {
            even: even / recentTicks.length,
            odd: odd / recentTicks.length,
        };
    }

    /**
     * Analyze over/under distribution
     */
    private analyzeOverUnder(threshold: number, count: number = 30): { over: number; under: number } {
        const recentTicks = this.tickHistory.slice(-count);
        let over = 0;
        let under = 0;

        recentTicks.forEach(tick => {
            const digit = this.getLastDigit(tick.quote);
            if (digit > threshold) over++;
            else if (digit < threshold) under++;
        });

        return {
            over: over / recentTicks.length,
            under: under / recentTicks.length,
        };
    }

    /**
     * Generate RISE/FALL signal
     */
    private generateTrendSignal(): SignalResult | null {
        const trend = this.analyzeTrend(20);
        const recentTrend = this.analyzeTrend(10);

        if (trend === 'UP' && recentTrend === 'UP') {
            return {
                type: 'RISE',
                confidence: 'HIGH',
                strategy: 'Trend Following',
                reason: 'Strong upward trend detected',
            };
        }

        if (trend === 'DOWN' && recentTrend === 'DOWN') {
            return {
                type: 'FALL',
                confidence: 'HIGH',
                strategy: 'Trend Following',
                reason: 'Strong downward trend detected',
            };
        }

        if (trend === 'UP' && recentTrend === 'SIDEWAYS') {
            return {
                type: 'RISE',
                confidence: 'MEDIUM',
                strategy: 'Trend Following',
                reason: 'Upward trend with consolidation',
            };
        }

        if (trend === 'DOWN' && recentTrend === 'SIDEWAYS') {
            return {
                type: 'FALL',
                confidence: 'MEDIUM',
                strategy: 'Trend Following',
                reason: 'Downward trend with consolidation',
            };
        }

        return null;
    }

    /**
     * Generate EVEN/ODD signal
     */
    private generateEvenOddSignal(): SignalResult | null {
        const distribution = this.analyzeEvenOdd(30);
        const recentDistribution = this.analyzeEvenOdd(10);
        const pattern = this.detectPattern(5);

        // Strong even bias
        if (distribution.even > 0.65 && recentDistribution.even > 0.7) {
            return {
                type: 'EVEN',
                confidence: 'HIGH',
                strategy: 'Pattern Recognition',
                digitPattern: pattern,
                reason: `Even digits appearing ${(distribution.even * 100).toFixed(0)}% of the time`,
            };
        }

        // Strong odd bias
        if (distribution.odd > 0.65 && recentDistribution.odd > 0.7) {
            return {
                type: 'ODD',
                confidence: 'HIGH',
                strategy: 'Pattern Recognition',
                digitPattern: pattern,
                reason: `Odd digits appearing ${(distribution.odd * 100).toFixed(0)}% of the time`,
            };
        }

        // Medium even bias
        if (distribution.even > 0.6) {
            return {
                type: 'EVEN',
                confidence: 'MEDIUM',
                strategy: 'Pattern Recognition',
                digitPattern: pattern,
                reason: `Even digits showing ${(distribution.even * 100).toFixed(0)}% frequency`,
            };
        }

        // Medium odd bias
        if (distribution.odd > 0.6) {
            return {
                type: 'ODD',
                confidence: 'MEDIUM',
                strategy: 'Pattern Recognition',
                digitPattern: pattern,
                reason: `Odd digits showing ${(distribution.odd * 100).toFixed(0)}% frequency`,
            };
        }

        return null;
    }

    /**
     * Generate OVER/UNDER signal
     */
    private generateOverUnderSignal(): SignalResult | null {
        const hotDigits = this.getHotDigits(0.15);
        const pattern = this.detectPattern(5);

        // Analyze for OVER5 (digits 6-9)
        const over5Analysis = this.analyzeOverUnder(5, 30);
        if (over5Analysis.over > 0.6) {
            const highDigits = hotDigits.filter(d => d > 5);
            return {
                type: 'OVER5',
                confidence: over5Analysis.over > 0.7 ? 'HIGH' : 'MEDIUM',
                strategy: 'Hot Digits',
                entryDigit: highDigits[0],
                digitPattern: pattern,
                reason: `Digits 6-9 appearing ${(over5Analysis.over * 100).toFixed(0)}% of the time`,
            };
        }

        // Analyze for UNDER5 (digits 0-4)
        if (over5Analysis.under > 0.6) {
            const lowDigits = hotDigits.filter(d => d < 5);
            return {
                type: 'UNDER5',
                confidence: over5Analysis.under > 0.7 ? 'HIGH' : 'MEDIUM',
                strategy: 'Hot Digits',
                entryDigit: lowDigits[0],
                digitPattern: pattern,
                reason: `Digits 0-4 appearing ${(over5Analysis.under * 100).toFixed(0)}% of the time`,
            };
        }

        // Analyze for OVER3 (digits 4-9)
        const over3Analysis = this.analyzeOverUnder(3, 30);
        if (over3Analysis.over > 0.65) {
            const highDigits = hotDigits.filter(d => d > 3);
            return {
                type: 'OVER3',
                confidence: over3Analysis.over > 0.75 ? 'HIGH' : 'MEDIUM',
                strategy: 'Hot Digits',
                entryDigit: highDigits[0],
                digitPattern: pattern,
                reason: `Digits 4-9 appearing ${(over3Analysis.over * 100).toFixed(0)}% of the time`,
            };
        }

        // Analyze for UNDER3 (digits 0-2)
        if (over3Analysis.under > 0.4) {
            const lowDigits = hotDigits.filter(d => d < 3);
            return {
                type: 'UNDER3',
                confidence: over3Analysis.under > 0.5 ? 'HIGH' : 'MEDIUM',
                strategy: 'Hot Digits',
                entryDigit: lowDigits[0],
                digitPattern: pattern,
                reason: `Digits 0-2 appearing ${(over3Analysis.under * 100).toFixed(0)}% of the time`,
            };
        }

        return null;
    }

    /**
     * Generate signal based on analysis
     */
    generateSignal(): SignalResult | null {
        if (this.tickHistory.length < 30) {
            return null; // Not enough data
        }

        // Try different signal types
        const signals: (SignalResult | null)[] = [
            this.generateTrendSignal(),
            this.generateEvenOddSignal(),
            this.generateOverUnderSignal(),
        ];

        // Filter out null signals and prioritize HIGH confidence
        const validSignals = signals.filter(s => s !== null) as SignalResult[];

        if (validSignals.length === 0) return null;

        // Prioritize HIGH confidence signals
        const highConfidence = validSignals.filter(s => s.confidence === 'HIGH');
        if (highConfidence.length > 0) {
            return highConfidence[Math.floor(Math.random() * highConfidence.length)];
        }

        // Return any valid signal
        return validSignals[Math.floor(Math.random() * validSignals.length)];
    }

    /**
     * Get recent ticks for analysis
     */
    getRecentTicks(count: number = 100): TickData[] {
        return this.tickHistory.slice(-count);
    }

    /**
     * Get current tick statistics
     */
    getStatistics() {
        const hotDigits = this.getHotDigits();
        const coldDigits = this.getColdDigits();
        const trend = this.analyzeTrend();
        const evenOdd = this.analyzeEvenOdd();
        const pattern = this.detectPattern();

        return {
            hotDigits,
            coldDigits,
            trend,
            evenOdd,
            pattern,
            tickCount: this.tickHistory.length,
        };
    }

    /**
     * Clear history
     */
    clearHistory(): void {
        this.tickHistory = [];
    }
}

export const signalAnalysisService = new SignalAnalysisService();
