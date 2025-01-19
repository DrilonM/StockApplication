// src/components/HistoricalTable/HistoricalTable.js
import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box, Typography
} from '@mui/material';

const HistoricalTable = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil((data || []).length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = (data || []).slice(startIndex, startIndex + itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Last Trade</TableCell>
                            <TableCell>Max</TableCell>
                            <TableCell>Min</TableCell>
                            <TableCell>%Chg</TableCell>
                            <TableCell>Volume</TableCell>
                            <TableCell>Total Turnover</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentData.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.last_trade_price}</TableCell>
                                <TableCell>{row.max}</TableCell>
                                <TableCell>{row.min}</TableCell>
                                <TableCell>{row.percent_change}%</TableCell>
                                <TableCell>{row.volume}</TableCell>
                                <TableCell>{row.total_turnover}</TableCell>
                            </TableRow>
                        ))}
                        {currentData.length === 0 && (
                            <TableRow><TableCell colSpan={7}>No data</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="outlined" onClick={handlePrev} disabled={currentPage === 1}>Prev</Button>
                    <Typography variant="body2">Page {currentPage} of {totalPages}</Typography>
                    <Button variant="outlined" onClick={handleNext} disabled={currentPage === totalPages}>Next</Button>
                </Box>
            )}
        </Box>
    );
};

export default HistoricalTable;
