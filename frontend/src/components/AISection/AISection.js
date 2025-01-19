// src/components/AISection/AISection.js

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Stack,
    Paper,
    Divider,
    Grid,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import PredictionsCard from './PredictionsCard'; // Ensure this component exists
import { fetchLSTMSummary } from '../../services/api';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { formatNumberToMacedonian} from "../../Utils/Helpres";

const AISection = () => {
    const [predictionsData, setPredictionsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4); // Display 4 issuers per page
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch data from backend
    const loadPredictions = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchLSTMSummary();
            setPredictionsData(data);
        } catch (err) {
            setError('Failed to load AI predictions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPredictions();
    }, []);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = predictionsData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(predictionsData.length / itemsPerPage);

    const handlePrevPage = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    };

    return (
        <Box
            sx={{
                p: 4,
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '-100px',
                marginBottom: '60px',
            }}
        >
            <Paper
                elevation={8}
                sx={{
                    width: "fit-content",
                    borderRadius: 4,
                    padding: 5
                }}
            >
                <Grid container>
                    <Typography
                        variant="h7"
                        gutterBottom
                        align="left"
                        sx={{
                            color: 'white',
                            textAlign: 'left',
                            bgcolor: '#1976d2', // Already set in Paper
                            paddingTop: 1,
                            paddingBottom: 1,
                            paddingLeft: 2,
                            paddingRight: 2,
                            borderRadius: 5,
                        }}
                    >
                        AI Predictions - Next Month
                    </Typography>
                </Grid>

                <Divider
                    sx={{
                        backgroundColor: 'white',
                        mb: 3,
                        mx: 2,
                        width: 'calc(100% - 32px)',
                        margin: "15px 0px 20px 0px",
                    }}
                />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            {currentItems.map((pd, i) => (
                                <PredictionsCard
                                    key={i}
                                    data={{
                                        name: pd.issuer,
                                        price: formatNumberToMacedonian(pd.nextMonthPrice),
                                        change: `${pd.nextMonthPercentChange >= 0 ? '+' : ''}${pd.nextMonthPercentChange.toFixed(2)}%`,
                                        changeColor: pd.nextMonthPercentChange >= 0 ? 'green' : 'red',
                                    }}
                                />
                            ))}
                        </Stack>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mt: 3,
                                }}
                            >
                                <Button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    startIcon={<ArrowBackIosIcon />}
                                    sx={{ mr: 2 }}
                                >
                                    Prev
                                </Button>
                                <Typography variant="body1">
                                    Page {currentPage} of {totalPages}
                                </Typography>
                                <Button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    endIcon={<ArrowForwardIosIcon />}
                                    sx={{ ml: 2 }}
                                >
                                    Next
                                </Button>
                            </Box>
                        )}
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default AISection;
