import { createContext, ReactNode, useEffect, useState } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { api }  from '../services/api';

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
  name: string,
  avatarUrl: string
}

export interface AuthContextDataProps {
  user: UserProps,
  isUserLoading: boolean,
  signIn: () => Promise<void>
}

interface AuthProviderProps {
  children: ReactNode
}


export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthProviderProps ) {
  const [ isUserLoading, setIsUserLoading ] = useState(false);
  const [ user, setUser ] = useState({} as UserProps);

  //Pegar URL para usar na URL de auth do google
  /*console.log(AuthSession.makeRedirectUri({useProxy: true}))*/

  /**Chave GOOGLE
   * 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
   */

  /**
   * TOKEN AUTH
   * ya29.a0Aa4xrXONHbUq1VahCSljJk3xplAQGbAF03lOZK2PvS-ZhcLnMbjwAiGkYp3s9Akdf0zCJxH0xpYW3T4RM828pjjuwQ7cFmn0oU51SvAS78isPKTH9VQx2gqenkdleqvqruK1Hu8INYuHf2N0jyn3TS63IO2XaCgYKASASARESFQEjDvL9Xn_8vsHwQ_ghpwPdACQI5Q0163
   */

  const [request, response, promptAsync ] = Google.useAuthRequest({
    clientId: process.env.CLIENT_ID, //'1083274814143-3epd7p7v6othsng33g14bdu6rj9irkag.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({useProxy: true}),
    scopes: ['profile','email']
  })

  async function signIn() {
    //console.log('Login')
    try {
      setIsUserLoading(true);

      await promptAsync();

    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }

 async function signInWithGoogle (access_token: string) {
  //console.log('>> Token autenticação: ', access_token)

    try {
      setIsUserLoading(true);

      const tokenResponse = await api.post('/users', { access_token });

      api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;

      const userInfoResponse = await api.get('/me');
      
      setUser(userInfoResponse.data.user)

    } catch (error) {
     console.log(error);
     throw error; 
    }finally{
      setIsUserLoading(false)
    }

 }

  useEffect(() => {
    if(response?.type === 'success' && response.authentication?.accessToken){
      signInWithGoogle(response.authentication?.accessToken);
    }
  }, [response])

  return (
    <AuthContext.Provider value={{
        signIn,
        isUserLoading,
        /*user: {
          name: 'Josuel',
          avatarUrl: 'https://github.com/josuellions.png'
        }*/
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}