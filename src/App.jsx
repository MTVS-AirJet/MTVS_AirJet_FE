import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import MapList from './pages/MapList';
import MapCreate from './pages/MapCreate';
import MapSearch from './pages/MapSearch';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/map/list" element={<MapList />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/map/create" element={<MapCreate />} />
        <Route path="/map/search" element={<MapSearch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
