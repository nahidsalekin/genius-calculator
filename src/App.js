import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home/Home';
import ScreenB from './Pages/Home/ScreenB/ScreenB';

function App() {
  return (
    <div className="px-3">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />

          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
