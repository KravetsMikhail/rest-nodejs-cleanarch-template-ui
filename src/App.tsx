import {
	Authenticated,
	Refine,
	HttpError
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
	ErrorComponent,
	RefineSnackbarProvider,
	ThemedLayout,
	useNotificationProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { useKeycloak } from "@react-keycloak/web";
import routerBindings, {
	CatchAllNavigate,
	DocumentTitleHandler,
	NavigateToResource,
	UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { coreDataProvider } from "./providers/core-provider";
import axios from "axios";
import { BrowserRouter, Outlet, Route, Routes, useLocation } from "react-router";
import { AppIcon } from "./components/app-icon";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { TaskList } from "./pages/tasks/list";
import { TaskCreate } from "./pages/tasks/create";
import { TaskEdit } from "./pages/tasks/edit";
import { TaskShow } from "./pages/tasks/show";
import { Dashboard } from "./pages/dashboard";
import { authProvider } from "./providers/auth-provider";

function AppContent() {
	const { keycloak, initialized } = useKeycloak();
	const location = useLocation();

	console.log('App - keycloak:', keycloak);
	console.log('App - initialized:', initialized);
	console.log('App - location:', location.pathname);

	if (!initialized) {
		console.log('App - loading...');
		return <div>Loading...</div>;
	}

	const axiosInstance = axios.create();
 	axiosInstance.interceptors.request.use((config) => {
		const token = keycloak.token;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	}); 

 	// Convert axios errors to HttpError on every response.
	axiosInstance.interceptors.response.use(
		(response) => response,
		(error) => {
			const customError = {
				...error,
				message: error.response?.data?.message || error.message,
				statusCode: error.response?.status || null,
			};

			return Promise.reject(customError);
		},
	); 

	const dataProvider = coreDataProvider(
		import.meta.env.VITE_API_URL,
		axiosInstance
	);

	return (
		<RefineKbarProvider>
			<ColorModeContextProvider>
				<CssBaseline />
				<GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
				<RefineSnackbarProvider>
					<DevtoolsProvider>
						<Refine
							dataProvider={{
								default: dataProvider,
							}}
							notificationProvider={useNotificationProvider}
							authProvider={authProvider(keycloak)}
							routerProvider={routerBindings}
							resources={[
								{
									name: "tasks",
									identifier: "tasks",
									list: "/tasks",
									create: "/tasks/create",
									edit: "/tasks/edit/:id",
									show: "/tasks/show/:id",
									meta: {
										label: "Tasks",
										canDelete: true,
									},
								},
							]}
							options={{
								syncWithLocation: false,
								warnWhenUnsavedChanges: true,
								projectId: "6mdJ1i-c37dju-qI5aFP",
								title: { text: "Refine Project", icon: <AppIcon /> },
							}}
						>
							<Routes>
								<Route
									element={
										<Authenticated
											key="authenticated-inner"
											fallback={<CatchAllNavigate to="/login" />}
										>
											<ThemedLayout Header={Header}>
												<Outlet />
											</ThemedLayout>
										</Authenticated>
									}
								>
									<Route path="/" element={<Dashboard />} />
									<Route path="/tasks/show/:id" element={<TaskShow />} />
									<Route path="/tasks/edit/:id" element={<TaskEdit />} />
									<Route path="/tasks/create" element={<TaskCreate />} />
									<Route path="/tasks" element={<TaskList />} />
									<Route path="*" element={<ErrorComponent />} />
								</Route>
							</Routes>
							<RefineKbar />
							<UnsavedChangesNotifier />
							<DocumentTitleHandler />
						</Refine>
						<DevtoolsPanel />
					</DevtoolsProvider>
				</RefineSnackbarProvider>
			</ColorModeContextProvider>
		</RefineKbarProvider>
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
