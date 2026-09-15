/*
 * Copyright (c) Haulmont 2025. All Rights Reserved.
 * Use is subject to license terms.
 */

import "./App.css"
import {AppLayout} from "@components/layout/AppLayout.tsx";
import {AuthGuard} from "@components/auth/AuthGuard.tsx";

function App() {
    return (
        <AuthGuard>
            <AppLayout/>
        </AuthGuard>
    );
}

export default App
