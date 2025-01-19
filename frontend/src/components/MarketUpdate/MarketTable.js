// MarketTable.js
import React from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
} from '@mui/material';
import MiniChart from './MiniChart';

const MarketTable = ({ data, count, page, rowsPerPage, handleChangePage }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <TableContainer component={Paper} sx={{ width: 'fit-content' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    width: '100px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                }}
                            >
                                Symbol
                            </TableCell>
                            <TableCell
                                sx={{
                                    width: '100px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                }}
                            >
                                LTP
                            </TableCell>
                            <TableCell
                                sx={{
                                    width: '100px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                }}
                            >
                                24h %
                            </TableCell>
                            <TableCell
                                sx={{
                                    width: '100px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                }}
                            >
                                Quantity
                            </TableCell>
                            <TableCell
                                sx={{
                                    width: '100px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                }}
                            >
                                Last 7 Days
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((d, i) => (
                            <TableRow key={i}>
                                <TableCell
                                    sx={{ textAlign: 'center', verticalAlign: 'middle' }}
                                >
                                    {d.symbol}
                                </TableCell>
                                <TableCell
                                    sx={{ textAlign: 'center', verticalAlign: 'middle' }}
                                >
                                    {d.ltp}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        textAlign: 'center',
                                        verticalAlign: 'middle',
                                        color: d.change.indexOf('-')!==-1 ? 'red' : 'green',
                                    }}
                                >
                                    {d.change}%
                                </TableCell>
                                <TableCell
                                    sx={{ textAlign: 'center', verticalAlign: 'middle' }}
                                >
                                    {d.quantity}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        width: '300px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'middle',
                                    }}
                                >
                                    <MiniChart
                                        data={d.last7Days}
                                        color={d.last7Days[0] > d.last7Days[d.last7Days.length-1] ? 'red' : 'green'}
                                        topColor={d.last7Days[0] > d.last7Days[d.last7Days.length-1] ? 'red' : 'green'}
                                        bottomColor={
                                            d.last7Days[0] > d.last7Days[d.last7Days.length-1] ? '#ffffff' : '#20fc0303'
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))}

                        {data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No data available.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={count}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[]}
                sx={{ float: 'right' }}
            />
        </Box>
    );
};

export default MarketTable;
