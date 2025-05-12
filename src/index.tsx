import { createRoot } from "react-dom/client";

import { ReactKeycloakProvider } from "@react-keycloak/web";
import Keycloak from "keycloak-js";

import App from "./App";

const keycloak = new Keycloak({
	clientId: "rest-nodejs-cleanarch-template-ui",
	url: import.meta.env.VITE_KEYCLOAK_URL,
	realm: "rest-nodejs-cleanarch-template"
});

const initOptions = {
	onLoad: 'login-required',
	checkLoginIframe: false,
	pkceMethod: 'S256',
	flow: 'standard',
	enableLogging: true,
	silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
	redirectUri: window.location.origin
};

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
	<ReactKeycloakProvider authClient={keycloak} initOptions={initOptions}>
		<App />
	</ReactKeycloakProvider>
);
