// src/components/ChartComponents/ChartTypeSelector.js
import React from 'react';
import { Button, ButtonGroup } from '@mui/material';

const ChartTypeSelector = ({ chartType, onChartTypeChange }) => {
    return (
        <ButtonGroup variant="outlined" size="small">
            <Button
                onClick={() => onChartTypeChange('line')}
                variant={chartType === 'line' ? 'contained' : 'outlined'}
            >
                Line
            </Button>
            <Button
                onClick={() => onChartTypeChange('candlestick')}
                variant={chartType === 'candlestick' ? 'contained' : 'outlined'}
            >
                Candlestick
            </Button>
            <Button
                onClick={() => onChartTypeChange('area')}
                variant={chartType === 'area' ? 'contained' : 'outlined'}
            >
                Area
            </Button>
        </ButtonGroup>
    );
};

export default ChartTypeSelector;
