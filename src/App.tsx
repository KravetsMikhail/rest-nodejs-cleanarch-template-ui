import {
	Authenticated,
	GitHubBanner,
	Refine,
	HttpError
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
	ErrorComponent,
	RefineSnackbarProvider,
	ThemedLayoutV2,
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
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { AppIcon } from "./components/app-icon";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
	TaskCreate,
	TaskEdit,
	TaskList,
	TaskShow,
} from "./pages/tasks";
import { Login } from "./pages/login";
import { authProvider } from "./providers/auth-provider";

function App() {
	const { keycloak, initialized } = useKeycloak();

	if (!initialized) {
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
		(response) => {
			return response;
		},
		(error) => {
			const customError: HttpError = {
				...error,
				message: error.response?.data?.message,
				statusCode: error.response?.status,
			};

			return Promise.reject(customError);
		},
	); 

	const dataProvider = coreDataProvider(
		import.meta.env.VITE_API_URL,
		axiosInstance
	);

	/* const authProvider: AuthProvider = {
	  login: async () => {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const { to } = Object.fromEntries(urlSearchParams.entries());
		await keycloak.login({
		  redirectUri: to ? `${window.location.origin}${to}` : undefined,
		});
		return {
		  success: true,
		};
	  },
	  logout: async () => {
		try {
		  await keycloak.logout({
			redirectUri: window.location.origin,
		  });
		  return {
			success: true,
			redirectTo: "/login",
		  };
		} catch (error) {
		  return {
			success: false,
			error: new Error("Logout failed"),
		  };
		}
	  },
	  onError: async (error) => {
		console.error(error);
		return { error };
	  },
	  check: async () => {
		try {
		  const { token } = keycloak;
		  if (token) {
			axios.defaults.headers.common = {
			  Authorization: `Bearer ${token}`,
			};
			return {
			  authenticated: true,
			};
		  } else {
			return {
			  authenticated: false,
			  logout: true,
			  redirectTo: "/login",
			  error: {
				message: "Check failed",
				name: "Token not found",
			  },
			};
		  }
		} catch (error) {
		  return {
			authenticated: false,
			logout: true,
			redirectTo: "/login",
			error: {
			  message: "Check failed",
			  name: "Token not found",
			},
		  };
		}
	  },
	  getPermissions: async () => null,
	  getIdentity: async () => {
		if (keycloak?.tokenParsed) {
		  return {
			name: keycloak.tokenParsed.family_name,
		  };
		}
		return null;
	  },
	}; */

	return (
		<BrowserRouter>
			<GitHubBanner />
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
										list: "/tasks",
										create: "/tasks/create",
										edit: "/tasks/edit/:id",
										show: "/tasks/show/:id",
										meta: {
											canDelete: true,
										},
									},
								]}
								options={{
									syncWithLocation: true,
									warnWhenUnsavedChanges: true,
									useNewQueryKeys: true,
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
												<ThemedLayoutV2 Header={Header}>
													<Outlet />
												</ThemedLayoutV2>
											</Authenticated>
										}
									>
										<Route
											index
											element={<NavigateToResource resource="tasks" />}
										/>
										<Route path="/tasks">
											<Route index element={<TaskList />} />
											<Route path="create" element={<TaskCreate />} />
											<Route path="edit/:id" element={<TaskEdit />} />
											<Route path="show/:id" element={<TaskShow />} />
										</Route>
										<Route path="*" element={<ErrorComponent />} />
									</Route>
									<Route
										element={
											<Authenticated
												key="authenticated-outer"
												fallback={<Outlet />}
											>
												<NavigateToResource resource="tasks" />
											</Authenticated>
										}
									>
										<Route path="/login" element={<Login />} />
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
		</BrowserRouter>
	);
}

export default App;
