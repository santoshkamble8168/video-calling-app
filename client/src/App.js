import { Routes, Route } from "react-router-dom"
import {ROOT, ROOM} from "./constants/routes"
import Home from "./pages/Home";
import Room from "./pages/Room";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path={ROOT} element={<Home />} />
        <Route path={ROOM} element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
