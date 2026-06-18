export interface User {
  id: number;
  email: string;
  name: string;
  lang: string;
  theme: string;
  level: string;
  ignoredTagId: number | null;
}

export interface AuthTokens {
  accessToken: string;
  user: User;
}
