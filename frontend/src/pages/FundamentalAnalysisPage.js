import {fetchPerformanceMetrics, fetchAllIssuers, fetchNewsSentiments} from '../services/api'
import {
    Alert,
    Autocomplete,
    Box,
    Card,
    CardContent,
    styled,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import ShowPerformanceMetric from "../components/ShowPerformanceMetric";
import {useLocation, useSearchParams} from "react-router-dom";
import {formatNumberToMacedonian, formatDateToMacedonianVersion2} from "../Utils/Helpres"
const FundamentalAnalysis = () => {
    const [allSymbols, setAllSymbols] = useState([]);
    const [selectedSymbol, setSelectedSymbol] = useState("ALK");
    const [error, setError] = useState('');
    const [performanceMetrics, setPerformanceMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newsSentiments, setNewsSentiments] = useState(null);

    const location = useLocation()
    const symbolFromState = location.state?.symbol;
    const [searchParams] = useSearchParams(); // Hook to access query params

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

    }, [symbolFromState]);

    useEffect(() => {
        const issuerFromParams = searchParams.get('issuer');
        if (issuerFromParams) {
            setSelectedSymbol(issuerFromParams);
        }
    }, [searchParams]);

    useEffect(() => {
        if (selectedSymbol) {
            handleAnalyze()
        }
    }, [selectedSymbol]);

    const handleAnalyze = async () => {
        if (!selectedSymbol) {
            setError('Please select a symbol.')
            return;
        }

        setError('');
        setPerformanceMetrics(null);
        setLoading(true);

        try {
            const data = await fetchPerformanceMetrics(selectedSymbol)
            const news = await fetchNewsSentiments(selectedSymbol)
            console.log("DATA", data)
            console.log("NEWS", news)
            if (data) {
                setPerformanceMetrics(data)
            } else {
                setError('No performance metrics were found.')
            }

            if (news) {
                setNewsSentiments(news)
            } else {
                setError('No news was found.')
            }
        } catch (err) {
            console.error('Error fetching metrics:', err);
            setError('Failed to fetch metrics.');
        } finally {
            setLoading(false);
        }
    }

    function evaluate(metric, value) {
        const performanceThresholds = {
            revenue: [
                { threshold: 10, rating: "Good" }
            ],
            operating_margin: [
                { threshold: 12, rating: "Good" },
                { threshold: 8, rating: "Neutral" }
            ],
            net_margin: [
                { threshold: 10, rating: "Good" },
                { threshold: 5, rating: "Neutral" }
            ],
            roe: [
                { threshold: 15, rating: "Good" },
                { threshold: 10, rating: "Neutral" }
            ],
            debt_equity: [
                { threshold: 0, rating: "Good" },
                { threshold: 0.5, rating: "Neutral" },
                { threshold: 1, rating: "Poor" }
            ],
            pe_ratio: [
                { threshold: 20, rating: "Good" },
                { threshold: 15, rating: "Neutral" }
            ]
        };

        const thresholds = performanceThresholds[metric];

        for (let i = 0; i < thresholds.length; i++) {
            if (value >= thresholds[i].threshold) {
                return thresholds[i].rating;
            }
        }

        return "Poor";
    }

    const Maybe = styled(Typography)({
        color: "var(--color)",
        fontWeight: "bold",
        fontSize: 21,
        display: "inline"
    })

    function getSentimentColor(sentiment) {
        console.log(sentiment)
        switch (sentiment) {
            case "Positive news":
                return "#1976D2";
                case "Neutral news":
                    return "gray";
                    case "Negative news":
                        return "orange";
        }
    }

    function getSentiment() {
        let positive = 0;
        let negative = 0;
        let neutral = 0;

        newsSentiments.forEach((news) => {
            if (news.sentiment === "Positive news") {
                positive++;
            } else if (news.sentiment === "Negative news") {
                negative++;
            } else {
                neutral++;
            }
        });

        if (neutral > positive && neutral > negative) {
            return 0;
        } else if (positive > negative && neutral) {
            return 1;
        } else {
            return 0;
        }
    }

    return (
        <Box sx={{minHeight: "100vh"}}>
        <Box sx={{display:"flex", justifyContent:"center", alignItems:"center"}} >
        <Box sx={{p: 4, backgroundColor: '#f5f5f5', borderRadius: 2, maxWidth: 800, margin: '20px auto'}}>
            <Typography variant="h5" gutterBottom>
                Fundamental Analysis
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
            </Box>

            {error && (
                <Box sx={{mt: 2}}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            {performanceMetrics && (

                <Box sx={{border: '2px solid lightgray', borderRadius: '10px', padding: 2}}>
                    <Typography variant="h6" gutterBottom>
                        Performance Metrics:
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                        <Box>
                            <Typography sx={{textAlign: "center", border: "2px solid lightgray", borderRadius: '10px', padding: 2}}> 2023 </Typography>
                            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: "center", border: "2px solid lightgray", borderRadius: '10px', mt: 1.5, padding: 1}}>
                                <ShowPerformanceMetric
                                    title={"Growth 2023 vs. 2022:"}
                                    value={formatNumberToMacedonian(performanceMetrics?.growth23v22.toFixed(2)) + "%"}
                                    performance={evaluate("revenue", performanceMetrics?.growth23v22)}
                                />
                                <ShowPerformanceMetric
                                    title={"Operating Margin:"}
                                    value={formatNumberToMacedonian(performanceMetrics?.operating_margin23.toFixed(2)) + "%"}
                                    performance={evaluate("operating_margin", performanceMetrics?.operating_margin23)}
                                />
                                <ShowPerformanceMetric
                                    title={"Net Margin:"}
                                    value={formatNumberToMacedonian(performanceMetrics?.net_margin23.toFixed(2)) + "%"}
                                    performance={evaluate("net_margin", performanceMetrics?.net_margin23)}
                                />
                                <ShowPerformanceMetric
                                    title={"Roe:"}
                                    value={formatNumberToMacedonian(performanceMetrics?.roe23.toFixed(2)) + "%"}
                                    performance={evaluate("roe", performanceMetrics?.roe23)}
                                />
                                <ShowPerformanceMetric
                                    title={"Debt/Equity:"}
                                    value={formatNumberToMacedonian(performanceMetrics?.debt_equity23.toFixed(2))}
                                    performance={evaluate("debt_equity", performanceMetrics?.debt_equity23)}
                                />
                                <ShowPerformanceMetric
                                    title={"PE Ratio:"}
                                    value={formatNumberToMacedonian(performanceMetrics?.pe_ratio23.toFixed(2))}
                                    performance={evaluate("pe_ratio", performanceMetrics?.pe_ratio23)}
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Typography sx={{textAlign: "center", border: "2px solid lightgray", borderRadius: '10px', padding: 2, mt: 5}}> 2022 </Typography>
                            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: "center", border: "2px solid lightgray", borderRadius: '10px', mt: 1.5, padding: 1}}>
                                <ShowPerformanceMetric
                                    title={"Growth 2022 vs. 2021:"}
                                    value={formatNumberToMacedonian(performanceMetrics?.growth22v21.toFixed(2)) + "%"}
                                    performance={evaluate("revenue", performanceMetrics?.growth22v21)}
                                />
                                <ShowPerformanceMetric
                                    title={"Operating:"}
                                    value={formatNumberToMacedonian(performanceMetrics?.operating_margin22.toFixed(2)) + "%"}
                                    performance={evaluate("operating_margin", performanceMetrics?.operating_margin22)}
                                />
                                <ShowPerformanceMetric
                                    title={"Net Margin:"}
                                    value={formatNumberToMacedonian(performanceMetrics?.net_margin22.toFixed(2)) + "%"}
                                    performance={evaluate("net_margin", performanceMetrics?.net_margin22)}
                                />
                                <ShowPerformanceMetric
                                    title={"Roe:"}
                                    value={formatNumberToMacedonian(performanceMetrics?.roe22.toFixed(2)) + "%"}
                                    performance={evaluate("roe", performanceMetrics?.roe22)}
                                />
                                <ShowPerformanceMetric
                                    title={"Debt/Equity:"}
                                    value={formatNumberToMacedonian(performanceMetrics?.debt_equity22.toFixed(2))}
                                    performance={evaluate("debt_equity", performanceMetrics?.debt_equity22)}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4}}>
                            <Typography variant="h6">
                                Overall Performance: <Maybe sx={{
                                '--color': performanceMetrics?.performance === 'Good' ||  performanceMetrics?.performance === 'Excellent' ? '#1976D2' : (performanceMetrics?.performance === "Poor" ? "orange" : performanceMetrics?.performance === "Neutral" ? "gray" : "red")
                            }}> { performanceMetrics?.performance } </Maybe>
                            </Typography>
                        </Box>
                    </Box>

                </Box>

            )}

            {newsSentiments && (
                <Box sx={{border: '2px solid lightgray', borderRadius: '10px', padding: 2, mt: 5}}>
                    <Typography variant="h6" gutterBottom sx={{mt: 1}}> News Sentiment Analysis: </Typography>

                    <Box sx={{display: "flex", mt: 2, border: "2px solid lightgray", borderRadius: 10, padding: 2,  background: "white", flexDirection: "column", justifyContent: "Center"}}>
                        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                            <Box sx={{display: "flex", alignItems: "Center", justifyContent: "center", flexDirection: "row"}}>
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        backgroundColor: "#1976D2",
                                        mr: 1
                                    }}
                                />
                                <Typography>
                                    Positive News
                                </Typography>
                            </Box>

                            <Box sx={{display: "flex", alignItems: "Center", justifyContent: "center"}}>
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        backgroundColor: "gray",
                                        mr: 1
                                    }}
                                />
                                <Typography>
                                    Neutral News
                                </Typography>
                            </Box>

                            <Box sx={{display: "flex", alignItems: "Center", justifyContent: "center"}}>
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        backgroundColor: "orange",
                                        mr: 1
                                    }}
                                />
                                <Typography>
                                    Negative News
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{display: "flex", justifyContent: "center", mt: 2}}>
                            <Typography variant="h6" sx={{fontWeight: "bold"}}>
                                Overall Sentiment: <Typography variant="h6" sx={{textAlign:"Center", fontWeight:"bold", color: getSentiment() > 0 ? "#1976D2" : (getSentiment() < 0 ? "orange" : "gray") }}> { getSentiment() > 0 ? "Positive" : (getSentiment() < 0 ? "Negative" : "Neutral") } </Typography>
                            </Typography>
                        </Box>
                    </Box>


                    <Box sx={{ padding: 2, maxHeight: '400px', overflowY: 'auto', mt: 2 }}>
                        {newsSentiments && newsSentiments.length > 0 ? (
                            newsSentiments.map((news, index) => (
                                news.title ? (
                                    <Card key={index} sx={{ marginBottom: 1, border: "1px solid lightgray", borderRadius: 2 }}>
                                        <CardContent>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <Box sx={{ alignItems: 'center', mr: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 10,
                                                                height: 10,
                                                                borderRadius: '50%',
                                                                backgroundColor: getSentimentColor(news.sentiment),
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography
                                                        variant="h8"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            textAlign: 'left',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '590px',
                                                        }}
                                                    >
                                                        <a
                                                            href={news.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                                        >
                                                            {news.title === " " ? "Untitled" : news.title.split('.pdf')[0] }
                                                        </a>
                                                    </Typography>
                                                </Box>

                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Date:</strong> {formatDateToMacedonianVersion2(news.date.toString(),"/")}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ) : null
                            ))
                        ) : (
                            <Typography variant="h6">No news sentiments available</Typography>
                        )}
                    </Box>
                </Box>
            )}


        </Box>
        </Box>
        </Box>
    );
}

export default FundamentalAnalysis;