import axios from 'axios';

const getBackendUrl = (service) => {
    const baseUrls = {
        'data-access-api': "http://localhost:8081",
        'metrics-access-api': "http://localhost:8082",
        'prediction-access-api': "http://localhost:8084",
        'sentimet-access-api': "http://localhost:8083",
    };

    return baseUrls[service];
};

export const fetchMarketData = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { symbol: 'AAPL', ltp: 150.32, change: 0.0145, quantity: 45332, last7Days: [148,149,150,151,150,151,150], sector: 'Technology' },
                { symbol: 'GOOGL', ltp: 2820.5, change: -0.0512, quantity: 34823, last7Days: [2850,2840,2830,2820,2810,2800,2790], sector: 'Technology' },
                { symbol: 'TSLA', ltp: 1082.70, change: -0.0375, quantity: 34823, last7Days: [1100,1095,1090,1080,1085,1082,1081], sector: 'Automotive' },
                { symbol: 'META', ltp: 315.70, change: 0.0145, quantity: 5219, last7Days: [310,312,313,314,315,316,315], sector: 'Technology' },
                { symbol: 'AMZN', ltp: 3400.0, change: 0.025, quantity: 40000, last7Days: [3300,3320,3350,3360,3380,3390,3400], sector: 'Technology' },
                { symbol: 'NFLX', ltp: 500.0, change: -0.01, quantity: 20000, last7Days: [510,509,508,507,506,505,500], sector: 'Entertainment' },
                { symbol: 'MSFT', ltp: 300.0, change: 0.03, quantity: 10000, last7Days: [290,292,295,298,300,302,300], sector: 'Technology' },
                { symbol: 'IBM', ltp: 145.0, change: -0.02, quantity: 15000, last7Days: [150,149,148,147,146,145,144], sector: 'Technology' },
            ]);
        }, 500);
    });
};

export const fetchChartData = async (symbol, fromDate, toDate) => {
    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    const fromTime = new Date(fromDate).getTime();
    const toTime = new Date(toDate).getTime();

    let data = [];
    const start = new Date();
    start.setFullYear(start.getFullYear() - 10);

    for (let d = new Date(start); d <= new Date(); d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().slice(0, 10);
        const basePrice = getRandomFloat(100, 3000);
        const max = basePrice + getRandomFloat(0, 50);
        const min = basePrice - getRandomFloat(0, 50);
        const last_trade_price = (max + min) / 2;
        const percent_change = ((Math.random() - 0.5) / 10).toString();
        const volume = Math.floor(getRandomFloat(1000, 50000));
        const total_turnover = volume * last_trade_price;
        const turnover_best = total_turnover / 2;
        const avg_price = (max + min) / 2;

        data.push({
            issuer: symbol,
            date: dateStr,
            last_trade_price,
            max,
            min,
            avg_price,
            percent_change,
            volume,
            turnover_best,
            total_turnover
        });
    }

    data = data.filter(d => d.issuer === symbol
        && new Date(d.date).getTime() >= fromTime
        && new Date(d.date).getTime() <= toTime);

    return data;
};

const getApiUrl = (service, endpoint) => {
    const baseUrl = getBackendUrl(service);
    return `${baseUrl}${endpoint}`;
};

export const fetchAllData = async () => {
    try {
        const response = await axios.get(getApiUrl('data-access-api', '/api/all'));
        return response.data;
    } catch (error) {
        console.error('Error fetching all data:', error);
        throw error;
    }
};

export const fetchLastSevenDaysPerIssuer = async () => {
    try {
        const response = await axios.get(getApiUrl('data-access-api', '/api/last-seven-days'));
        return response.data;
    } catch (error) {
        console.error('Error fetching last seven days data:', error);
        throw error;
    }
};

export const fetchIssuerData = async (issuer, startDate, endDate) => {
    try {
        const response = await axios.get(getApiUrl('data-access-api', '/api/issuer-data'), {
            params: { issuer, startDate, endDate }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data for issuer ${issuer}:`, error);
        throw error;
    }
};

export const fetchAllIssuers = async () => {
    try {
        const response = await axios.get(getApiUrl('data-access-api', '/api/issuers'));
        return response.data;
    } catch (error) {
        console.error('Error fetching issuers:', error);
        throw error;
    }
};

export const fetchPrecomputedMetrics = async (issuer, period) => {
    try {
        const response = await axios.get(getApiUrl('metrics-access-api', '/api/precomputed-metrics'), {
            params: { issuer, period },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching precomputed metrics for ${issuer} - ${period}:`, error);
        throw error;
    }
};

export const fetchPerformanceMetrics = async (issuer) => {
    try {
        const response = await axios.get(getApiUrl('metrics-access-api', '/api/performance-metrics'), { params: { issuer } });
        return response.data;
    } catch (error) {
        console.error(`Error fetching performance metrics for ${issuer}`, error);
        throw error;
    }
};

export const fetchNewsSentiments = async (issuer) => {
    try {
        const response = await axios.get(getApiUrl('sentimet-access-api', '/api/news-sentiments'), { params: { issuer } });
        return response.data;
    } catch (error) {
        console.error(`Error fetching news-sentiments for ${issuer}`, error);
        throw error;
    }
};

export const fetchLSTMPredictions = async (issuer) => {
    try {
        const response = await axios.get(getApiUrl('prediction-access-api', `/api/lstm-predictions`), {params: {issuer}});
        return response.data;
    } catch (error) {
        console.error(`Error fetching LSTM Predictions for ${issuer}`, error);
        throw error;
    }
};

export const fetchAllLSTMIssuers = async () => {
    try {
        const response = await axios.get(getApiUrl('prediction-access-api', '/api/lstm-issuers'));
        return response.data;
    } catch (error) {
        console.error('Error fetching issuers:', error);
        throw error;
    }
};

export const fetchLSTMSummary = async () => {
    try {
        const response = await axios.get(getApiUrl('prediction-access-api', '/api/lstm/summary'));
        return response.data;
    } catch (error) {
        console.error('Error fetching LSTM summary:', error);
        throw error;
    }
};
