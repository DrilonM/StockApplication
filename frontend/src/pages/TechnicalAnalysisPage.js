// src/components/TechnicalAnalysis/TechnicalAnalysis.js
import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Autocomplete,
    TextField,
    CircularProgress,
    Alert,
} from '@mui/material';
import { fetchPrecomputedMetrics, fetchAllIssuers } from '../services/api';
import ShowMetric from "../components/ShowMetric";
import { getCounts, analyzeIndicators } from "../Utils/technicalAnalysisUtils";
import {useLocation} from "react-router-dom";
const TechnicalAnalysis = () => {
    const [allSymbols, setAllSymbols] = useState([]);
    const [selectedSymbol, setSelectedSymbol] = useState("ALK");
    const [selectedPeriod, setSelectedPeriod] = useState('1d');
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recommendation, setRecommendation] = useState('');

    const location = useLocation()
    const symbolFromState = location.state?.symbol;
    const periodFromState = location.state?.period;

    useEffect(() => {
        const fetchSymbols = async () => {
            try {
                const issuers = await fetchAllIssuers();
                setAllSymbols(issuers);
            } catch (err) {
                console.error('Failed to fetch symbols:', err);
                setError('Failed to load symbols.');
            }
        };
        fetchSymbols();

        if (symbolFromState) {
            setSelectedSymbol(symbolFromState);
        }
        if (periodFromState) {
            setSelectedPeriod(periodFromState)
        }
    }, [symbolFromState]);

    useEffect(() => {
        if (selectedSymbol) {
            handleAnalyze();
        }

    }, [selectedSymbol]);

    const handleAnalyze = async () => {
        if (!selectedSymbol || !selectedPeriod) {
            setError('Please select both symbol and period.');
            return;
        }
        setError('');
        setLoading(true);
        setMetrics(null);
        setRecommendation('');

        try {
            const data = await fetchPrecomputedMetrics(selectedSymbol, selectedPeriod);
            console.log("DATA", data)
            const rec = analyzeIndicators(data)
            if (data) {
                setMetrics(data);
                setRecommendation(rec);
            } else {
                setError('No metrics found for the selected symbol and period.');
            }
        } catch (err) {
            console.error('Error fetching metrics:', err);
            setError('Failed to fetch metrics.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{minHeight: "120vh"}}>
            <Box sx={{p: 4, backgroundColor: '#f5f5f5', borderRadius: 2, maxWidth: 800, margin: '10px auto', height: '100%', minHeight: "100vh"}}>
            <Typography variant="h5" gutterBottom>
                Technical Analysis
            </Typography>

            <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2}}>
                <Autocomplete
                    options={allSymbols}
                    value={selectedSymbol}
                    onChange={(event, newValue) => {
                        setSelectedSymbol(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Symbol" variant="outlined"/>
                    )}
                    sx={{flex: 1, minWidth: 200}}
                />

                <Autocomplete
                    options={['1d', '1w', '1m']}
                    value={selectedPeriod}
                    onChange={(event, newValue) => {
                        setSelectedPeriod(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Period" variant="outlined"/>
                    )}
                    sx={{flex: 1, minWidth: 200}}
                    disableClearable
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAnalyze}
                    disabled={loading}
                    sx={{flex: '0 0 150px', minWidth: 150, height: 56}}
                >
                    {loading ? <CircularProgress size={24} color="inherit"/> : 'Analyze'}
                </Button>
            </Box>

            {error && (
                <Box sx={{mt: 2}}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            {metrics && (
                <Box sx={{border: '2px solid lightgray', borderRadius: '10px', padding: 3}}>
                    <Typography variant="h6" gutterBottom>
                        Indicators:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <ShowMetric title={"RSI:"} value={metrics?.rsi?.value} result={metrics?.rsi?.result} />
                        <ShowMetric title={"MACD:"} value={metrics?.macd?.value} result={metrics?.macd?.result} />
                        <ShowMetric title={"Stochastic Oscillator:"} value={metrics?.stoch?.value} result={metrics?.stoch?.result} />
                        <ShowMetric title={"Awesome Oscillator (AO):"} value={metrics?.ao?.value} result={metrics?.ao?.result} />
                        <ShowMetric title={"Williams %R:"} value={metrics?.williams?.value} result={metrics?.williams?.result} />
                        <ShowMetric title={"CCI:"} value={metrics?.cci?.value} result={metrics?.cci?.result} />
                        <ShowMetric title={"SMA:"} value={metrics?.sma?.value} result={metrics?.sma?.result} />
                        <ShowMetric title={"EMA:"} value={metrics?.ema?.value} result={metrics?.ema?.result} />
                        <ShowMetric title={"WMA:"} value={metrics?.wma?.value} result={metrics?.wma?.result} />
                        <ShowMetric title={"HMA:"} value={metrics?.hma?.value} result={metrics?.hma?.result} />
                        <ShowMetric title={"IBL:"} value={metrics?.ibl?.value} result={metrics?.ibl?.result} />
                    </Box>

                    <Box sx={{border: '2px solid lightgray', borderRadius: '10px', marginTop: 2, padding: 2, width: 350, justifySelf: "center"}}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5, justifyContent: 'center', marginTop: 2}}>
                            <Box>
                                <Typography variant="h6" color={'#1976D2'} fontWeight={"bold"}> Buy </Typography>
                                <Typography textAlign={"center"} variant="h6"> { getCounts(metrics).Buy } </Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" color={'orange'} fontWeight={"bold"}> Sell </Typography>
                                <Typography textAlign={"center"} variant="h6"> { getCounts(metrics).Sell } </Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" color={'gray'} fontWeight={"bold"}> Hold </Typography>
                                <Typography textAlign={"center"} variant="h6"> { getCounts(metrics).Hold } </Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" color={'red'} fontWeight={"bold"}> N/A </Typography>
                                <Typography textAlign={"center"} variant="h6"> { getCounts(metrics).NA } </Typography>
                            </Box>
                        </Box>

                        <Box sx={{mt: 2, textAlign: 'center'}}>
                            <Typography variant="h6">Recommendation:</Typography>
                            <Typography
                                variant="h4"
                                sx={{
                                    color:
                                        recommendation === 'Strong Buy'
                                            ? '#1976D2'
                                            : recommendation === 'Buy'
                                                ? '#488DCE'
                                                : recommendation === 'Hold'
                                                    ? 'grey'
                                                    : recommendation === 'Sell'
                                                        ? 'orange'
                                                        : 'red',
                                    fontWeight: 'bold',
                                    mt: 1,
                                }}
                            >
                                {recommendation}
                            </Typography>
                        </Box>
                    </Box>



                </Box>
            )}
            </Box>
        </Box>
    );
};
export default TechnicalAnalysis;
