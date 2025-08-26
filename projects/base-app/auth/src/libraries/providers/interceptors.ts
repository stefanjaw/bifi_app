import { authTokenInterceptor } from '../interceptors/auth-token';

export const AUTH_HTTP_INTERCEPTORS = [authTokenInterceptor];
