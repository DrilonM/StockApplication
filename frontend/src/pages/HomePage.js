import React from 'react';
import HeroSection from '../components/HeroSection/HeroSection';
import AISection from '../components/AISection/AISection';
import MarketUpdate from '../components/MarketUpdate/MarketUpdate';
import {
    Box,
} from '@mui/material';
const HomePage = () => {
    return (
        <Box>
            <HeroSection />
            <AISection />
            <MarketUpdate />
        </Box>
    );
};

export default HomePage;
