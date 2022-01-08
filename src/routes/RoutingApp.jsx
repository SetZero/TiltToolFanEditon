import PreloadApp from './PreloadApp';
import MainApp from './MainApp';

import {HashRouter, Routes, Route, Navigate} from "react-router-dom";

export default function RoutingApp()
{
    return(
        <HashRouter forceRefresh={true}>
            <Routes>
                <Route exact path ="/" element={<Navigate to="/main"/>} />
                <Route exact path="/preload" element={<PreloadApp/>} />
                <Route path="/main" element={<MainApp/>} />
            </Routes>
        </HashRouter>
    )
}