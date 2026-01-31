import axios from "axios";  
import { AuthProvider } from "@refinedev/core";

export const authProvider = (keycloak: any ): AuthProvider => ({
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
      console.error('Auth onError:', error);
      
      // Не редиректить при ошибках API, только при ошибках аутентификации
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return {
          logout: true,
          redirectTo: "/login",
          error,
        };
      }
      
      return { error };
    },
    check: async () => {
      try {
        console.log('Auth check - keycloak:', keycloak);
        console.log('Auth check - token:', keycloak?.token);
        const { token } = keycloak;
        if (token) {
          axios.defaults.headers.common = {
            Authorization: `Bearer ${token}`,
          };
          console.log('Auth check - success');
          return {
            authenticated: true,
          };
        } else {
          console.log('Auth check - no token');
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
        console.log('Auth check - error:', error);
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
  });

export type IIdentity = {
  name: string;
};