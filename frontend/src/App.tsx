import Home from "./components/pages/Home";
import Deploy from "./components/pages/Deploy";
import Navbar from './components/utils/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Delete from "./components/utils/Delete";
import Console from "./components/utils/Console";

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/deploy' element={<Deploy />} />
          <Route path='/delete' element={<Delete />} />
          <Route path='/console' element={<Console />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
