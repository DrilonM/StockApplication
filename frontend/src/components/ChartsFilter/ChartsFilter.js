// src/components/ChartsFilter/ChartsFilter.js
import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Autocomplete } from '@mui/material';
import { fetchAllIssuers } from '../../services/api';

const ChartsFilter = ({ fromDate, toDate, symbol, onFilter }) => {
    const [tempFrom, setTempFrom] = useState(fromDate);
    const [tempTo, setTempTo] = useState(toDate);
    const [tempSymbol, setTempSymbol] = useState(symbol);
    const [issuerOptions, setIssuerOptions] = useState([]);

    useEffect(() => {
        const getIssuers = async () => {
            try {
                const issuers = await fetchAllIssuers();
                setIssuerOptions(issuers);
            } catch (error) {
                console.error('Failed to fetch issuers:', error);
            }
        };
        getIssuers();
    }, []);

    const handleFind = () => {
        onFilter(tempFrom, tempTo, tempSymbol);
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Filter</Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                <TextField
                    label="From"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={tempFrom}
                    onChange={(e) => setTempFrom(e.target.value)}
                />
                <TextField
                    label="To"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={tempTo}
                    onChange={(e) => setTempTo(e.target.value)}
                />
                <Autocomplete
                    options={issuerOptions}
                    value={tempSymbol}
                    onChange={(event, newValue) => {
                        setTempSymbol(newValue || '');
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Symbol" variant="outlined" />
                    )}
                    freeSolo
                    sx={{width:"100px"}}
                />
                <Button variant="contained" onClick={handleFind}>Find</Button>
            </Box>
        </Box>
    );
};

export default ChartsFilter;
