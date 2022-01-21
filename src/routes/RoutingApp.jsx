import PreloadApp from './PreloadApp';
import MainApp from './MainApp';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

export default function RoutingApp() {
    window.ipcRenderer.send('mainWindowReady', { ready: true });
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <HashRouter forceRefresh={true}>
                <Routes>
                    <Route exact path="/" element={<Navigate to="/main" />} />
                    <Route exact path="/preload" element={<PreloadApp />} />
                    <Route path="/main" element={<MainApp />} />
                </Routes>
            </HashRouter>
        </ThemeProvider>
    )
}