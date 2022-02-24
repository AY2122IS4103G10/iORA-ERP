import { Routes, Route } from "react-router-dom";
import { ECIndex } from "./views/containers/Index/ECIndex";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ECIndex />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
