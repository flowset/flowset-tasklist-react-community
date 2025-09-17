/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import {Navigate, Route, Routes} from "react-router-dom";
import {Page404} from "../pages/Page404.tsx";
import {ProcessListPage} from "../pages/process/ProcessListPage.tsx";
import {UserTasksPage} from "../pages/task/UserTasksPage.tsx";
import {DashboardPage} from "../pages/dashboard/DashboardPage.tsx";
import {AboutProductPage} from "../pages/about/AboutProductPage.tsx";


export const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="dashboard"/>}/>
                <Route path="/dashboard" element={<DashboardPage/>}/>
                <Route path="/about" element={<AboutProductPage/>}/>
                <Route path="*" element={<Page404/>}/>
                <Route path="/processes" element={<ProcessListPage/>}/>
                <Route path="/tasks">
                    <Route index={true} element={<UserTasksPage/>}/>
                </Route>
            </Routes>
        </>
    );
};