export interface loginFormModel {
  emailOrUsername: string;
  password: string;
}

export interface registerFormModel {
  emailOrUsername: string;
  password: string;
  confirmPassword: string;
}

export type authFormModel = loginFormModel & registerFormModel;

export interface authFormData {
  isLogin: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface socialProvider {
  name: string;
  icon: string;
  ariaLabel: string;
}
