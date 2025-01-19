// src/pages/LSTMPage.js

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Autocomplete,
    TextField,
    Button,
    Card,
    CardContent,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Alert
} from '@mui/material';
import { useSearchParams } from 'react-router-dom'; // Import for reading query params
import { fetchAllLSTMIssuers, fetchLSTMPredictions } from '../services/api';
import {formatNumberToMacedonian, formatDateToMacedonian} from "../Utils/Helpres";

const LSTMPage = () => {
    const [allIssuers, setAllIssuers] = useState([]);
    const [selectedIssuer, setSelectedIssuer] = useState('ALK'); // default
    const [lstmData, setLstmData] = useState(null);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams(); // Hook to access query params

    useEffect(() => {
        // Fetch the list of issuers for dropdown
        const loadIssuers = async () => {
            try {
                const data = await fetchAllLSTMIssuers();
                setAllIssuers(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load issuers.');
            }
        };
        loadIssuers();
    }, []);

    useEffect(() => {
        const issuerFromParams = searchParams.get('issuer');
        if (issuerFromParams) {
            setSelectedIssuer(issuerFromParams);
            handleFetch(issuerFromParams);
        } else {
            handleFetch(selectedIssuer);
        }
    }, [searchParams]);

    const handleFetch = async (issuer) => {
        setError('');
        setLstmData(null);
        try {
            const data = await fetchLSTMPredictions(issuer);
            setLstmData(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch LSTM predictions.');
        }
    };

    const handleFindClick = () => {
        handleFetch(selectedIssuer);
    };

    const formatPercent = (value) => {
        if (value == null) return 'N/A';
        return `${formatNumberToMacedonian(value.toFixed(2))}%`;
    };

    const formatPrice = (price) => {
        if (price == null) return 'N/A';
        return formatNumberToMacedonian(price.toFixed(2));
    };

    const formatR2 = (num) =>{
        if (isNaN(num)) return num;
        if (typeof num !== 'number') parseFloat(num)

        const isNegative = num < 0;
        num = Math.abs(num);

        const [integerPart, decimalPart] = num.toFixed(3).split('.');

        const withThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        const formattedNumber = `${withThousands},${decimalPart}`;

        return isNegative ? `-${formattedNumber}` : formattedNumber;
    }

    const getPercentColor = (pct) => {
        if (pct == null) return 'inherit';
        return pct >= 0 ? 'green' : 'red';
    };

    return (
        <Box sx={{minHeight:"120vh"}}>
            <Box sx={{p: 4, width: "80vw", margin: "10px auto"}}>
                <Typography variant="h4" gutterBottom>
                    LSTM Predictions
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <Box sx={{display: 'flex', gap: 2, mb: 2}}>
                    <Autocomplete
                        options={allIssuers}
                        value={selectedIssuer}
                        onChange={(event, newValue) => setSelectedIssuer(newValue)}
                        renderInput={(params) => <TextField {...params} label="Select Issuer"/>}
                        sx={{width: 250}}
                    />

                    <Button variant="contained" onClick={handleFindClick}>
                        Find
                    </Button>
                </Box>

                {lstmData && (
                    <>
                        <Typography variant="h5" sx={{mt: 3, mb: 2}}>
                            Results
                        </Typography>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                gap: 2,
                                mb: 4,
                            }}
                        >
                            <Card sx={{border: '2px solid lightgray', borderRadius: 2}}>
                                <CardContent>
                                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                                        Short Term
                                    </Typography>
                                    <Typography variant="body1">
                                        Predicted Price: {formatPrice(lstmData.tomorrowPrice)} den
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{color: getPercentColor(lstmData.tomorrowPercentChange)}}
                                    >
                                        % Change: {formatPercent(lstmData.tomorrowPercentChange)}
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card sx={{border: '2px solid lightgray', borderRadius: 2}}>
                                <CardContent>
                                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                                        Medium Term
                                    </Typography>
                                    <Typography variant="body1">
                                        Predicted Price: {formatPrice(lstmData.nextWeekPrice)} den
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{color: getPercentColor(lstmData.nextWeekPercentChange)}}
                                    >
                                        % Change: {formatPercent(lstmData.nextWeekPercentChange)}
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card sx={{border: '2px solid lightgray', borderRadius: 2}}>
                                <CardContent>
                                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                                        Long Term
                                    </Typography>
                                    <Typography variant="body1">
                                        Predicted Price: {formatPrice(lstmData.nextMonthPrice)} den
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{color: getPercentColor(lstmData.nextMonthPercentChange)}}
                                    >
                                        % Change: {formatPercent(lstmData.nextMonthPercentChange)}
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card sx={{border: '2px solid lightgray', borderRadius: 2}}>
                                <CardContent>
                                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                                        Evaluation Metrics
                                    </Typography>
                                    <Typography variant="body1">
                                        MSE: {formatPrice(lstmData.meanAbsoluteError)}
                                    </Typography>
                                    <Typography variant="body1">
                                        RMSE: {formatPrice(lstmData.rootMeanSquaredError)}
                                    </Typography>
                                    <Typography variant="body1">
                                        R2: {lstmData.r2Score != null ? formatR2(lstmData.r2Score) : 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>

                        <Typography variant="h6" gutterBottom>
                            Next 30 Days Predictions
                        </Typography>
                        <Table sx={{border: '1px solid lightgray'}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Predicted Price (den)</TableCell>
                                    <TableCell>% Change</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lstmData.predictionRows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{formatDateToMacedonian(row.date)}</TableCell>
                                        <TableCell>{formatPrice(row.predictedPrice)} den</TableCell>
                                        <TableCell sx={{color: getPercentColor(row.percentChange)}}>
                                            {formatPercent(row.percentChange)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                )}
            </Box>
        </Box>);
}

export default LSTMPage;
