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
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from "../../types";

import Spacing from '../../constants/Spacing';
import Font from '../../constants/Font';
import Colors from '../../constants/Colors';

type ForgotPasswordScreenNavigationProp = RootStackScreenProps<'ForgotPassword'>['navigation'];

const ForgotPasswordScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();

    const handleSendOTP = async () => {
        if (!email) {
            Alert.alert('Error', 'Mohon masukkan alamat email');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://34.128.112.213:5000/send-otp', { email });
            Alert.alert('Berhasil', 'OTP terkirim ke email anda');
            navigation.navigate('VerifyOtp', { email });
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Gagal mengirim otp');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Lupa Sandi</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TouchableOpacity onPress={handleSendOTP} style={styles.button} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color={Colors.onPrimary} />
                ) : (
                    <Text style={styles.buttonText}>Kirim OTP</Text>
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

export default ForgotPasswordScreen;
