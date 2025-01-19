// src/components/AISection/PredictionsCard.js

import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {useNavigate} from "react-router-dom";
import { formatNumberToMacedonian} from "../../Utils/Helpres";

const PredictionsCard = ({ data }) => {
    const { name, price, change, changeColor } = data;
    const isPositive = changeColor === 'green';
    const navigate = useNavigate();

    const handleClick = () => {
        // Navigate to /lstm with issuer as a query parameter
        navigate(`/lstm?issuer=${encodeURIComponent(name)}`);
    };
    return (
        <Card
            onClick={handleClick}
            sx={{
                minWidth: 200,
                width: 260,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: '#fff',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6,
                },
            }}
        >
            <CardContent>

                <Typography
                    variant="subtitle1"
                    component="div"
                    sx={{
                        fontWeight: 'bold',
                        color: '#1976d2',
                        mb: 1,
                    }}
                >
                    {name}
                </Typography>


                <Box sx={{ display: 'flex', alignItems: 'center', gap:"10px" }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {price}den
                    </Typography>
                    <Chip
                        label={`${isPositive ? '+' : '-'}${formatNumberToMacedonian(Math.abs(parseFloat(change)))}%`}
                        icon={isPositive ? <ArrowUpwardIcon color="white"/> : <ArrowDownwardIcon color="white" />}
                        sx={{
                            backgroundColor: changeColor,
                            color: '#fff',
                            fontWeight: 'bold',
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default PredictionsCard;
