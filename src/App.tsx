import "./app.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
function App() {
	return (
		<div className="app-container">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/editor/:notebook" element={<Editor />} />
			</Routes>
		</div>
	);
}

export default App;
