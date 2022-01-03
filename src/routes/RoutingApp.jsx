import PreloadApp from './PreloadApp';
import MainApp from './MainApp';

import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

export default function RoutingApp()
{
    return(
        <BrowserRouter forceRefresh={true}>
            <Routes>
                <Route exact path ="/" element={<Navigate to="/preload"/>} />
                <Route exact path="/preload" element={<PreloadApp/>} />
                <Route path="/main" element={<MainApp/>} />
            </Routes>
        </BrowserRouter>
    )
}