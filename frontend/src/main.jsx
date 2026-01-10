import React, {Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // <--- Import this
import './i18n'; // <--- 2. Import the config file here

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter> {/* <--- Wrap App in this */}
            <Suspense fallback={<div>Loading language...</div>}>
                <App />
            </Suspense>
        </BrowserRouter>
    </React.StrictMode>,
)