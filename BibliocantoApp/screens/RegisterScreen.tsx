import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, ActivityIndicator, Alert, TouchableOpacity, StyleSheet,ToastAndroid } from 'react-native';
import { RootStackParamList } from '../routes/StackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../services/api';
import { MaterialIcons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RegisterScreen(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation<NavigationProp>();
    const [isLoading, setIsLoading] = useState(false);

    const CreateUser = async () => {
      setIsLoading(true);  
      const data = { email, password, confirmPassword };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Alert.alert('Atenção!', "Por favor, insira um e-mail válido.");
          setIsLoading(false);
          return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
        if (!passwordRegex.test(password)) {
          Alert.alert('Atenção!', "A senha deve conter pelo menos 10 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.");
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          Alert.alert('Atenção!', "As senhas não coincidem, tente novamente.");
          setIsLoading(false);
          return;
        }

        try {
          const verificaEmail = await api.get('api/Account/UserByEmail', {
            params: { email }
          });

          if (!verificaEmail.data) {
            const response = await api.post('api/Account/CreateUser', data);
            ToastAndroid.showWithGravityAndOffset(
              response.data,
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
            navigation.navigate('Login');
          } else {
            Alert.alert('Atenção!', 'Usuário já cadastrado no sistema!');
          }
        } catch (error) {
          setIsLoading(false); 
          Alert.alert('Erro!', 'Erro ao criar usuário. Tente novamente.');
        }

    }

    return (
        <View style={styles.container}>
          
            <Text style={styles.title}>Bibliocanto</Text>
            <Text style={styles.subtitle}>Cadastre-se para gerenciar seus livros.</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="E-mail"
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

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirme a senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="gray" />
              </TouchableOpacity>
            </View>
    
            <TouchableOpacity style={styles.button} onPress={CreateUser}>
              {isLoading ?  (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Criar Usuário</Text>
              )}
            </TouchableOpacity>
        </View>
      );

};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F0F2F5',
      padding: 20,
    },
    formContainer: {
      backgroundColor: 'white',
      padding: 40,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 60,
      elevation: 5,
      width: '80%',
      textAlign: 'center',
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
    eyeButton: {
      padding: 5,
    },
    title: {
      fontSize: 40,
      fontWeight: 'bold',
      fontFamily: 'Merriweather, serif',
      color: 'black',
      marginBottom: 20,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#47211c',
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      flex: 1,
      height: "100%",
    },
    button: {
      backgroundColor: "#007bff",
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      width: "100%",
      marginBottom: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });


