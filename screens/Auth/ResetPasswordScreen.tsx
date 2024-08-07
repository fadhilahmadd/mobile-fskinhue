import React, { useState } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';

import Spacing from '../../constants/Spacing';
import Font from '../../constants/Font';
import Colors from '../../constants/Colors';
import { RootStackParamList } from "../../types";
import { RouteProp } from '@react-navigation/native';

type ResetPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const route = useRoute<ResetPasswordScreenRouteProp>();
    const { email } = route.params;

    const handleResetPassword = async () => {
        if (!password) {
            Alert.alert('Error', 'Tolong masukkan password baru');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://34.128.112.213:5000/reset-password', {
                email,
                password
            });

            Alert.alert('Berhasil', 'Kata sandi berhasil diubah');
            navigation.navigate('Login');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Gagal mengubah kata sandi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Reset Password</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Kata sandi baru"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity onPress={handleResetPassword} style={styles.button} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color={Colors.onPrimary} />
                ) : (
                    <Text style={styles.buttonText}>Setel Ulang Kata Sandi</Text>
                )}
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
});

export default ResetPasswordScreen;
