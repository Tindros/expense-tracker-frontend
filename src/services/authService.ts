import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  type IAuthenticationDetailsData,
} from 'amazon-cognito-identity-js';

import type {
  LoginCredentials,
  RegisterData,
  AuthResult,
} from '../types/auth';

const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
});

export const authService = {
  async login(
    credentials: LoginCredentials
  ): Promise<AuthResult> {
    return new Promise((resolve) => {
      const authenticationData: IAuthenticationDetailsData = {
        Username: credentials.email,
        Password: credentials.password,
      };

      const authenticationDetails =
        new AuthenticationDetails(authenticationData);

      const cognitoUser = new CognitoUser({
        Username: credentials.email,
        Pool: userPool,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          const accessToken =
            session.getAccessToken().getJwtToken();

          const idToken =
            session.getIdToken().getJwtToken();

          // Store tokens for API requests
          localStorage.setItem(
            'auth_token',
            accessToken
          );

          localStorage.setItem(
            'id_token',
            idToken
          );

          resolve({
            success: true,
            message: 'Login successful',
            token: accessToken,
          });
        },

        onFailure: (error) => {
          console.error(
            'Cognito login error:',
            error
          );

          resolve({
            success: false,
            message:
              error.message || 'Login failed',
          });
        },
      });
    });
  },

  async register(data: RegisterData): Promise<AuthResult> {
  const attributeList = [
    new CognitoUserAttribute({
      Name: 'email',
      Value: data.email,
    }),
    new CognitoUserAttribute({
      Name: 'name',
      Value: data.fullName,
    }),
  ];

  return new Promise((resolve) => {
    userPool.signUp(
      data.email,
      data.password,
      attributeList,
      [],
      (error, result) => {
        if (error) {
          console.error('Cognito registration error:', error);

          resolve({
            success: false,
            message: error.message,
          });

          return;
        }

        console.log('Cognito registration successful:', result);

        resolve({
          success: true,
          message:
            'Registration successful. Please check your email for confirmation.',
        });
      }
    );
  });
},

  logout() {
    const currentUser =
      userPool.getCurrentUser();

    if (currentUser) {
      currentUser.signOut();
    }

    localStorage.removeItem('auth_token');
    localStorage.removeItem('id_token');
  },

  getAccessToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(
      'auth_token'
    );
  },
};