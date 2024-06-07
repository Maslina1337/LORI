import { useState, useEffect, createContext, useContext } from 'react'
import './App.css'
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

// Страницы
import LifePage from './pages/life_page';
import BirthPage from './pages/birth_page';
import WonderfulCursor from "./components/large/cursor"

import pages_paths from './scripts/pages_paths';

// Контексты
import { BackendDataProvider, BackendDataContext } from './context/backend_data_context';
import { LifePageContentContextProvider } from './context/life_page_content_context';

function App() {
    return (
    <>
        <BackendDataProvider>
        <LifePageContentContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' element={<Navigate to={pages_paths.life_page} replace/>}/>
                    <Route path={pages_paths.life_page} element={<LifePage/>}/>
                    <Route path={pages_paths.birth_page} element={<BirthPage/>}/>
                </Routes>
            </BrowserRouter>
        </LifePageContentContextProvider>
        </BackendDataProvider>
        

        <WonderfulCursor/>

        <script src='./scripts/dev_titikaka'></script>

        <script src="./scripts/cursor_position_knowladge"></script>
        <script src="/socket.io/socket.io.js"></script>
        <script src="/scripts/socket_scripts.js"></script>
    </>
    )
}

export default App
