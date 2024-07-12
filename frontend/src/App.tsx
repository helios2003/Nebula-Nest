import Home from "./components/pages/Home";
import Deploy from "./components/pages/Deploy";
import Navbar from './components/utils/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/deploy' element={<Deploy />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
