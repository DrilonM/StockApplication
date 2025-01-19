
export function makeObject(metric, data, result) {
    let nonMetrics = { "end_date": true, "issuer": true, "period": true, "start_date": true };

    if (metric in nonMetrics) {
        return;
    }

    let value = parseFloat(data[metric]);

    if (isNaN(value)) {
        return
    }

    data[metric] = {
        value: value.toFixed(2),
        "result": result
    }
}

export let thresholds = {
    rsi: {overbought: 70, oversold: 30},
    macd: {aboveSignal: true, belowSignal: false},
    stoch: {overbought: 80, oversold: 20},
    ao: {positive: true, negative: false},
    williams: {overbought: -20, oversold: -80},
    cci: {overbought: 100, oversold: -100},
    sma_ema: {bullish: 'sma < ema', bearish: 'sma > ema'},
    ema_sma: {bullish: 'ema < sma', bearish: 'ema > sma'},
    wma_ema: {bullish: 'wma < ema', bearish: 'wma > ema'},
    hma_ema: {bullish: 'hma < ema', bearish: 'hma > ema'},
    ibl: {
        overbought: 28000,
        oversold: 25000,
    },
};

export function getCounts(metrics) {
    let count = {
        'Buy': 0,
        'Sell': 0,
        'Hold': 0,
        'NA': 0
    }

    Object.keys(metrics).forEach(key => {
        let result = metrics[key]?.result;
        if (result === 'Buy') {
            count.Buy++;
        } else if (result === "Sell") {
            count.Sell++;
        } else if (result === "Hold") {
            count.Hold++;
        } else {
            count.NA++;
        }
    });

    count.NA = count.NA - 4

    return count
}

export const analyzeIndicators = (data) => {
    const isValid = (value) => value !== null && value !== undefined;

    if (isValid(data.rsi)) {
        if (data.rsi >= thresholds.rsi.overbought) {
            makeObject('rsi', data, 'Buy');

        } else if (data.rsi < thresholds.rsi.oversold) {
            makeObject('rsi', data, 'Sell');
        } else {
            makeObject('rsi', data, 'Hold');
        }
    }

    if (isValid(data.macd)) {
        if (data.macd <= 0) {
            makeObject('macd', data, 'Buy');
        } else if (data.macd > 0) {
            makeObject('macd', data, 'Sell');
        } else {
            makeObject('macd', data, 'Hold');
        }
    }

    if (isValid(data.stoch)) {
        if (data.stoch >= thresholds.stoch.overbought) {
            makeObject('stoch', data, 'Buy');
        } else if (data.stoch < thresholds.stoch.oversold) {
            makeObject('stoch', data, 'Sell');
        } else {
            makeObject('stoch', data, 'Hold');
        }
    }

    if (isValid(data.ao)) {
        if (data.ao >= 0) {
            makeObject('ao', data, 'Buy');
        } else if (data.ao < 0) {
            makeObject('ao', data, 'Sell');
        } else {
            makeObject('ao', data, 'Hold');
        }
    }

    if (isValid(data.williams)) {
        if (data.williams >= thresholds.williams.overbought) {
            makeObject('williams', data, 'Sell');
        } else if (data.williams < thresholds.williams.oversold) {
            makeObject('williams', data, 'Buy');
        } else {
            makeObject('williams', data, 'Hold');
        }
    }

    if (isValid(data.cci)) {
        if (data.cci >= thresholds.cci.overbought) {
            makeObject('cci', data, 'Sell');
        } else if (data.cci < thresholds.cci.oversold) {
            makeObject('cci', data, 'Buy');
        } else {
            makeObject('cci', data, 'Hold');
        }
    }

    if (data.sma > data.ema) {
        makeObject('sma', data, 'Sell');
    } else if (data.sma < data.ema) {
        makeObject('sma', data, 'Buy');
    } else {
        makeObject('sma', data, 'Hold');
    }

    if (isValid(data.sma) && isValid(data.ema)) {
        if (data.ema > data.sma) {
            makeObject('ema', data, 'Sell');
        } else if (data.ema < data.sma) {
            makeObject('ema', data, 'Buy');
        } else {
            makeObject('ema', data, 'Hold');
        }
    } else {
        makeObject('ema', data, 'Hold');
    }


    if (isValid(data.wma) && isValid(data.ema.value)) {
        if (data.wma > data.ema.value) {
            makeObject('wma', data, 'Sell');
        } else if (data.wma < data.ema.value) {
            makeObject('wma', data, 'Buy');
        } else {
            makeObject('wma', data, 'Hold');
        }
    }

    if (isValid(data.hma) && isValid(data.ema)) {
        if (data.hma > data.ema.value) {
            makeObject('hma', data, 'Sell');
        } else if (data.hma < data.ema.value) {
            makeObject('hma', data, 'Buy');
        } else {
            makeObject('hma', data, 'Hold');
        }
    }

    if (isValid(data.ibl)) {
        if (data.ibl >= thresholds.ibl.overbought) {
            makeObject('ibl', data, 'Buy');
        } else if (data.ibl < thresholds.ibl.oversold) {
            makeObject('ibl', data, 'Sell');
        } else {
            makeObject('ibl', data, 'Hold');
        }
    }

    let buy = getCounts(data).Buy
    let sell = getCounts(data).Sell
    let hold = getCounts(data).Hold

    let total = buy + sell + hold;

    if (buy / total > 0.7) return 'Strong Buy';
    if (buy / total > 0.5) return 'Buy';
    if (buy / total > 0.3) return 'Hold';
    if (sell / total > 0.5) return 'Sell';
    if (sell / total > 0.7) return 'Strong Sell';
    return "Hold"
}