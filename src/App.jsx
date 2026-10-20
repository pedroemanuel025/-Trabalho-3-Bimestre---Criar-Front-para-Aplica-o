import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DetalheItem from "./pages/DetalheItem";
import FormItem from "./pages/FormItem";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<DetalheItem />} />
        <Route path="/novo" element={<FormItem />} />
        <Route path="/editar/:id" element={<FormItem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;