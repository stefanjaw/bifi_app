export interface authSocialProvider {
  name: string;
  icon: string;
  ariaLabel: string;
  action: () => Promise<boolean>;
}
