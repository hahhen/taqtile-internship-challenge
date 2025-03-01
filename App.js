import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
// You can import from local files
import { Search } from './components/Search';
// or any pure javascript modules available in npm
import { SafeAreaView } from 'react-native-safe-area-context';
import { OpenSans_400Regular, OpenSans_600SemiBold, OpenSans_700Bold, useFonts } from '@expo-google-fonts/open-sans';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';

const FlexSafeAreaView = styled(SafeAreaView)`
  flex: 1;
`

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <>
      <FlexSafeAreaView>
        <Search />
      </FlexSafeAreaView>
      <StatusBar backgroundColor='#38344E' style="light" />
    </>
  );
}
