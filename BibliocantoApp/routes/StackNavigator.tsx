import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import BookScreen from '../screens/BookScreen';
import MyLibrary from '../screens/MyLibraryScreen';
import CodeRequest from '../screens/CodeRequestPasswordScreen';
import CodeValidation from '../screens/CodeValidationScreen';
import ResetPassword from '../screens/ResetPasswordScreen';
import Lidos from '../screens/ReadScreen';
import Relidos from '../screens/RereadScreen';
import Resenhas from '../screens/ResenhaScreen';
import OpcoesScreen from '../screens/OpcoesScreen';
import SobreSite from '../screens/SobreSiteScreen';
import PoliticaPrivacidade from '../screens/PoliticaPrivacidadeScreen';
import Perfil from '../screens/PerfilScreen';
import NewHome from '../screens/NewHomeScreen';
import Preferencias from '../screens/PreferenciaScreen';
import { Image } from 'react-native';

export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Home: undefined;
  Book: { idLivro: number };
  Resenha: { idLivro: number };
  MyLibrary: undefined;
  CodeRequest: undefined;
  CodeValidation: { email: string };
  ResetPassword: { email: string; code: string };
  Lidos: undefined;
  Relidos: undefined;
  OpcoesScreen: undefined;
  SobreSite: undefined;
  PoliticaPrivacidade: undefined;
  Perfil: undefined;
  NewHome: undefined;
  Preferencias: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: 'white' },
        headerTintColor: '#000',
        headerTitleAlign: 'left',
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: '#fff' }, // fundo das telas
      }}
    >
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login', headerBackVisible: false, headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Acervo', headerTitleAlign: 'center' }} />
      <Stack.Screen
        name="NewHome"
        component={NewHome}
        options={{
          title: 'Início',
          headerBackVisible: false,
          headerTitle: () => (
            <Image
              source={require('../assets/BibliocantoTCC-mainlogo.png')}
              style={{ width: 35, height: 35 }}
            />
          ),
        }}
      />
      <Stack.Screen name="Book" component={BookScreen} options={{ title: 'Detalhes do livro', headerTitleAlign: 'center', headerBackVisible: false }} />
      <Stack.Screen name="Resenha" component={Resenhas} options={{ title: 'Detalhes do livro', headerTitleAlign: 'center', headerBackVisible: false }} />
      <Stack.Screen name="CodeValidation" component={CodeValidation} options={{ title: 'Validar Código', headerBackVisible: true }} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: 'Redefinir Senha', headerBackVisible: true }} />
      <Stack.Screen name="CodeRequest" component={CodeRequest} options={{ title: 'Recuperar Senha', headerBackVisible: true }} />
      <Stack.Screen name="MyLibrary" component={MyLibrary} options={{ title: 'Seu Acervo', headerTitleAlign: 'center' }} />
      <Stack.Screen name="Lidos" component={Lidos} options={{ title: 'Seu Acervo', headerTitleAlign: 'center' }} />
      <Stack.Screen name="Relidos" component={Relidos} options={{ title: 'Seu Acervo', headerTitleAlign: 'center' }} />
      <Stack.Screen name="OpcoesScreen" component={OpcoesScreen} options={{ title: 'Opções' }} />
      <Stack.Screen name="SobreSite" component={SobreSite} options={{ title: 'Sobre o bibliocanto', headerBackVisible: true }} />
      <Stack.Screen name="PoliticaPrivacidade" component={PoliticaPrivacidade} options={{ title: 'Política de privacidade', headerBackVisible: true }} />
      <Stack.Screen name="Perfil" component={Perfil} options={{ title: 'Dados do Perfil', headerBackVisible: true }} />
      <Stack.Screen name="Preferencias" component={Preferencias} options={{ title: 'Preferências', headerBackVisible: true }} />
    </Stack.Navigator>
  );
}
