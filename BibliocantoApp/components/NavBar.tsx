import React from 'react';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from '../routes/StackNavigator';
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NavBar() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.navbar, { bottom: insets.bottom }]} >

            <TouchableOpacity onPress={() => navigation.navigate('NewHome')} style={styles.button}>
                <MaterialIcons name="home" size={24} color="black" />
                <Text style={styles.text}>Início</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.button}>
                <MaterialIcons name="book" size={24} color="black" />
                <Text style={styles.text}>Acervo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MyLibrary')} style={styles.button}>
                <MaterialIcons name="bookmarks" size={24} color="black" />
                <Text style={styles.text}>Meus Livros</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('OpcoesScreen')} style={styles.button}>
                <MaterialIcons name="person" size={30} color="black" />
                <Text style={styles.text}>Perfil</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: "#F0F2F5",
        paddingVertical: 10,
        paddingHorizontal: 'auto',
        left: 0,
        right: 0,
        height: 65,
        position: "absolute",
        borderWidth: 0.2,
        borderRadius: 5,
        //elevation: 5,
    },
    button: {
        padding: 10,
        alignItems:'center',
    },
    text: {
        fontSize: 13,
        color: 'black',
        fontWeight: '500',
    }

});
