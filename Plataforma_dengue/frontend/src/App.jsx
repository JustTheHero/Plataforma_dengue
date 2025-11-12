import { useState, useEffect } from 'react'
import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import DengueMap from './pages/DengueMap'
//import DengueStats from './pages/dengueStats'
//import Upload from './pages/upload'
import 'leaflet/dist/leaflet.css';

function App() {
return(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      {/*<Route path="/dengueMap" element={<DengueMap />} /> */}
      {/*<Route path="/dengueStats" element={<DengueStats />} />*/}
      {/*<Route path="/upload" element={<Upload />} />*/}
    </Routes>
  </Router>
)
}
export default App
