// MarketUpdate.js
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { fetchLastSevenDaysPerIssuer } from '../../services/api';
import MarketTable from './MarketTable';
import { parseFromMacedonianToNumber } from '../../Utils/Helpres.js';

const MarketUpdate = () => {
    const [category, setCategory] = useState('Gainers');
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [allData, setAllData] = useState([]);

    const [page, setPage] = useState(0);
    const rowsPerPage = 4;

    useEffect(() => {
        fetchLastSevenDaysPerIssuer().then((data) => {
            const processedData = Object.keys(data).map((issuerKey) => {
                const issuerDataArray = data[issuerKey];

                if (!issuerDataArray || issuerDataArray.length === 0) {
                    return null;
                }
                const sortedData = issuerDataArray.sort((a, b) =>
                    a.date.localeCompare(b.date)
                );

                const latestDataPoint = sortedData[sortedData.length - 1];

                const last7DaysPrices = sortedData.map((d) => {
                        return parseFromMacedonianToNumber(d.last_trade_price)
                    }
                );


                return {
                    symbol: issuerKey + "",
                    ltp: latestDataPoint.last_trade_price + "",
                    change: latestDataPoint.percent_change + "",
                    quantity: latestDataPoint.volume + "",
                    last7Days: last7DaysPrices,
                };
            });

            setAllData(processedData);
        });
    }, []);

    useEffect(() => {
        filterData();
    }, [allData, category, searchQuery]);


    const filterData = () => {
        let result = [...allData];

        if (category === 'Gainers') {
            result = result.filter((d) => d.change.indexOf('-')===-1 && d.change!=='0,00');
        } else if (category === 'Losers') {
            result = result.filter((d) => d.change.indexOf('-')!==-1);
        } else if (category === 'Top Sectors') {
            result = result.sort((a,b) => parseFromMacedonianToNumber(b.ltp) - parseFromMacedonianToNumber(a.ltp))
            console.log(result)
        }

        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            result = result.filter((d) => d.symbol.toLowerCase().includes(q));
        }

        setFilteredData(result);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const paginatedData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box
            sx={{
                p: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80vh',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Typography variant="h4">Market Update</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            width: '100%',
                        }}
                    >
                        <ToggleButtonGroup
                            value={category}
                            exclusive
                            onChange={(e, val) => val && setCategory(val)}
                            size="small"
                        >
                            <ToggleButton value="Gainers">Gainers</ToggleButton>
                            <ToggleButton value="Losers">Losers</ToggleButton>
                            <ToggleButton value="Top Sectors">Top Sectors</ToggleButton>
                        </ToggleButtonGroup>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search by symbol..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ ml: 'auto' }}
                        />
                    </Box>
                </Box>

                <MarketTable
                    data={paginatedData}
                    count={filteredData.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handleChangePage={handleChangePage}
                />
            </Box>
        </Box>
    );
};

export default MarketUpdate;
