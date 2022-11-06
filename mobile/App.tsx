import { StyleSheet } from 'react-native';
import { NativeBaseProvider, VStack, StatusBar } from 'native-base';

import { useFonts, Roboto_700Bold, Roboto_500Medium, Roboto_400Regular } from '@expo-google-fonts/roboto';
import { AuthContextProvider } from './src/contexts/AuthContext';

import { THEME } from './src/styles/theme'

import { Loading } from './src/components/Loading';
import { SignIn } from './src/screens/SignIn';
import { New } from './src/screens/New';
import { Find } from './src/screens/Find';
import { Pools } from './src/screens/Pools';
import { Routes } from './src/routes';

export default function App() {

  const [fontsLoaded] = useFonts({ Roboto_700Bold, Roboto_500Medium, Roboto_400Regular })

  return (
    <AuthContextProvider>
      <NativeBaseProvider theme={THEME}>
        {/* <VStack flex={1} bgColor="gray.900" px={2}> */}
          {!fontsLoaded ?
            <Loading />
            :
            <Routes /> 
            // <New/>
            // <Find />
            // <Pools/>
          }

          <StatusBar 
            barStyle='light-content'
            backgroundColor='transparent'
            translucent
          />
        {/* </VStack> */}
      </NativeBaseProvider>
    </AuthContextProvider>
  );
}

/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24

  }
});
*/
