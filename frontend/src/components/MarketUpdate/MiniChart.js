// MiniChart.js
import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const MiniChart = ({ data, color, topColor, bottomColor }) => {
    const chartContainerRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        // Clear any previous content
        chartContainerRef.current.innerHTML = '';

        const chart = createChart(chartContainerRef.current, {
            width: 200,
            height: 70,
            layout: {
                background: { type: 'solid', color: 'transparent' },
                textColor: '#333',
            },
            grid: {
                vertLines: { visible: false },
                horzLines: { visible: false },
            },
            timeScale: { visible: false },
            priceScale: { visible: false },
            crosshair: { vertLine: { visible: false }, horzLine: { visible: false } },
        });

        const lineSeries = chart.addAreaSeries({
            topColor: topColor,
            bottomColor: bottomColor,
            lineColor: color,
            lineWidth: 2,
        });

        chart.timeScale().fitContent();

        lineSeries.setData(
            data.map((value, index) => ({
                time: index + 1,
                value: value,
            }))
        );

        return () => {
            chart.remove();
        };
    }, [data, color, topColor, bottomColor]);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                borderBottom: '1px solid #ddd',
                padding: '5px',
                width: 'fit-content',
            }}
            ref={chartContainerRef}
        />
    );
};

export default MiniChart;
