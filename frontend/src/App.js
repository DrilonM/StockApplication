import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChartsPage from './pages/ChartsPage';
import './styles/global.css';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import TechnicalAnalysisPage from "./pages/TechnicalAnalysisPage";
import FundamentalAnalysisPage from "./pages/FundamentalAnalysisPage";
import LSTMPage from "./pages/LSTMPage"

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/charts" element={<ChartsPage />} />
                <Route path="/technical" element={<TechnicalAnalysisPage />} />
                <Route path="/fundamental" element={<FundamentalAnalysisPage />}/>
                <Route path="/lstm" element={<LSTMPage />}/>
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
