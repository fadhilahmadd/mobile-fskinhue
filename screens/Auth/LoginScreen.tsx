import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator,
    Platform,
    StatusBar
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import Spacing from '../../constants/Spacing';
import Font from '../../constants/Font';
import Colors from '../../constants/Colors';

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                navigation.navigate('Deteksi');
            }
        };

        checkLoginStatus();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Tolong Masukkan Email dan Password');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://34.128.112.213:5000/login', {
                email,
                password
            });

            const { token } = response.data;
            console.log('Token:', token);

            await AsyncStorage.setItem('token', token);

            navigation.navigate('Deteksi');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', ' Email atau password salah!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Login</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Kata Sandi"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color={Colors.onPrimary} />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
                <Text style={styles.registerLinkText}>Tidak memiliki akun? Daftar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPasswordLink}>
                <Text style={styles.forgotPasswordLinkText}>Lupa Password?</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: Colors.background,
        paddingHorizontal: Spacing * 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: Spacing * 2,
    },
    title: {
        fontFamily: Font['poppins-semiBold'],
        fontSize: Spacing * 3,
        color: Colors.gold,
    },
    input: {
        backgroundColor: Colors.onPrimary,
        padding: Spacing,
        borderRadius: Spacing,
        marginVertical: Spacing,
        fontFamily: Font['poppins-regular'],
        fontSize: Spacing * 1.6,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: Spacing,
        borderRadius: Spacing,
        alignItems: 'center',
        marginVertical: Spacing * 2,
    },
    buttonText: {
        fontFamily: Font['poppins-semiBold'],
        color: Colors.splash,
        fontSize: Spacing * 1.6,
    },
    registerLink: {
        marginTop: Spacing * 2,
        alignItems: 'center',
    },
    registerLinkText: {
        fontFamily: Font['poppins-regular'],
        color: Colors.primary,
        fontSize: Spacing * 1.6,
    },
    forgotPasswordLink: {
        marginTop: Spacing,
        alignItems: 'center',
    },
    forgotPasswordLinkText: {
        fontFamily: Font['poppins-regular'],
        color: Colors.primary,
        fontSize: Spacing * 1.6,
    },
});

export default LoginScreen;
