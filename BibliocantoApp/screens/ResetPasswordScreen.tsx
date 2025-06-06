import React, { useState } from "react";
import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator, TouchableOpacity, ToastAndroid } from "react-native";
import { RootStackParamList } from '../routes/StackNavigator';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import api from '../services/api';
import { MaterialIcons } from '@expo/vector-icons';

export default function ResetPasswordScreen() {
  const route = useRoute();
  const { email, code } = route.params as { email: string, code: string };
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const resetPassword = async () => {
    setIsLoading(true);
    if (!newPassword) {
      Alert.alert("Erro", "Digite uma nova senha.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert('Atenção!', "A senha deve conter pelo menos 10 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.");
      setIsLoading(false);
      return;
    }

    const data = { email, code, newPassword };

    try {
      const response = await api.post('api/Account/ResetPasswordWithCode', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      ToastAndroid.showWithGravityAndOffset(
        response.data,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      navigation.navigate("Login");
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Erro", "Não foi possível redefinir a senha.");
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Escolha uma nova senha!</Text>

      <Text style={styles.subtitle}>Nova senha:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={newPassword}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
          <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Confirme sua nova senha:</Text>
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

      <TouchableOpacity style={styles.button} onPress={resetPassword}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Redefinir a senha</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    fontSize: 30,
    fontFamily: 'Merriweather, serif',
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#47211c',
    marginBottom: 10,
    textAlign: 'justify',
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


