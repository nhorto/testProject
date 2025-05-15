import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, createContext } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from 'react-native';
import { supabase } from '../lib/supabase'; // Import the Supabase client

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Auth context with Supabase integration
export const AuthContext = createContext({
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
  user: null,
  isLoading: true,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  // Authentication state
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth state on mount
  useEffect(() => {
    async function checkSession() {
      try {
        setIsLoading(true);
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Set the user state based on the session
        if (session) {
          setUser(session.user);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
      }
    }

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // Clean up the subscription when component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Auth functions
  const authContext = {
    signIn: async ({ email, password }) => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        return { user: data.user, error: null };
      } catch (error) {
        return { user: null, error: error.message };
      } finally {
        setIsLoading(false);
      }
    },
    signUp: async ({ email, password, name }) => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name
            }
          }
        });
        
        if (error) throw error;
        
        // After successful sign-up, insert the user into the public.users table
        if (data.user) {
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: email,
              name: name
            });
            
          if (profileError) throw profileError;
        }
        
        return { user: data.user, error: null };
      } catch (error) {
        return { user: null, error: error.message };
      } finally {
        setIsLoading(false);
      }
    },
    signOut: async () => {
      try {
        setIsLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        console.error('Error signing out:', error.message);
      } finally {
        setIsLoading(false);
      }
    },
    user,
    isLoading,
  };

  // Show splash screen until everything is loaded
  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading]);

  if (!loaded || isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
          </Stack>
        </ThemeProvider>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </AuthContext.Provider>
  );
}