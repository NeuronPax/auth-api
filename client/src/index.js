import {createRoot} from 'react-dom/client'
import {DataProvider} from './api/store'
import App from './App'

import './index.css'

createRoot(document.getElementById('root')).render(
	<DataProvider>
		<App />
	</DataProvider>
)
