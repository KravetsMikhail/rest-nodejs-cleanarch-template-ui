import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { TaskList } from "./pages/tasks";
import { TaskShowSimple } from "./pages/tasks/show-simple";

function AppContent() {
	const location = useLocation();
	console.log('App - location:', location.pathname);
	
	return (
		<Routes>
			<Route path="/tasks/show/:id" element={<TaskShowSimple />} />
			<Route path="/tasks" element={<TaskList />} />
			<Route path="/" element={<div>Home</div>} />
		</Routes>
	);
}

function App() {
	return (
		<BrowserRouter>
			<AppContent />
		</BrowserRouter>
	);
}

export default App;
