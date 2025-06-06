import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { RootStackParamList } from '../routes/StackNavigator';
import api from '../services/api';
import { MaterialIcons } from '@expo/vector-icons';
import { AxiosError } from 'axios';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const login = async () => {
    const data = { email, password };

    if (!email || !password) {
      Alert.alert('Atenção!', 'Por favor, preencha todos os campos para continuar.');
      return;
    }

    setLoading(true);

    try {

      const response = await api.post('api/Account/LoginUser', data);

      await SecureStore.setItemAsync('email', email);
      await SecureStore.setItemAsync('token', response.data.token);
      await SecureStore.setItemAsync('expiration', response.data.expiration);

      const responseId = await api.get('api/Account/IdUserByEmail', {
        params: { email: email },
      });

      await SecureStore.setItemAsync('IdUser', responseId.data.id);
      setLoading(false);
      navigation.navigate('NewHome');

    } catch (error: any) {
      setLoading(false);
      let responseBody = '';
      let errorMessage = 'Erro desconhecido.';

      if (error instanceof AxiosError) {
        const data = error.response?.data;

        if (data && typeof data === 'object') {
          responseBody = JSON.stringify(data, null, 2);
      
          if ('title' in data && typeof data.title === 'string') {
            errorMessage = data.title;
          }
      
          if ('errors' in data && typeof data.errors === 'object') {
            const errors = data.errors as Record<string, string[]>;
            const detalhes = Object.entries(errors)
              .map(([campo, mensagens]) => `${campo}: ${mensagens.join(', ')}`)
              .join('\n');
            errorMessage += `\n${detalhes}`;
          }
        } else {
          errorMessage = String(data || 'Houve um erro ao processar a solicitação. Tente novamente mais tarde.');
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      Alert.alert('Atenção!', errorMessage);
    }
  };

  const handleCreateUser = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    navigation.navigate('CodeRequest');
  };

  return (
    <View style={styles.loginContainer}>

      <Image
        source={require('../assets/BibliocantoTCC-mainlogo.png')}
        style={{ width: 100, height: 100, marginBottom: 15 }}
      />

      <Text style={styles.projectName}>Bibliocanto</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
          <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={login}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Entrar com Google</Text>
      </TouchableOpacity> */}

      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>ou</Text>

        <TouchableOpacity onPress={handleCreateUser}>
          <Text style={styles.forgotPassword}>Criar Usuário</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F0F2F5",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
  },
  projectName: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Merriweather",
    color: "black",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "100%",
    height: 50,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: "100%",
  },
  eyeButton: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  googleButton: {
    backgroundColor: "#db4437",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  createUserButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#007bff",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
  orText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
    color: "#888",
  },
});
