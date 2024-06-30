import Home from "./components/pages/Home";
import Deploy from "./components/pages/Deploy";
import { Navbar } from './components/utils/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Delete from "./components/utils/Delete";

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/deploy' element={<Deploy />} />
          <Route path='/delete' element={<Delete />} />
        </Routes>
      </BrowserRouter>
      {/* <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
        <Home />
      </div> */}
    </>
  );
}

export default App;
