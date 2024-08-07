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

type VerifyOTPScreenRouteProp = RouteProp<RootStackParamList, 'VerifyOtp'>;

const VerifyOtpScreen: React.FC = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const route = useRoute<VerifyOTPScreenRouteProp>();
    const { email } = route.params;

    const handleVerifyOtp = async () => {
        if (!otp) {
            Alert.alert('Error', 'Mohon masukkan OTP');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://34.128.112.213:5000/verify-otp', {
                email,
                otp
            });

            Alert.alert('Berhasil', 'OTP terverifikasi');
            navigation.navigate('ResetPassword', { email });
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'OTP Salah');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Verifikasi OTP</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
            />

            <TouchableOpacity onPress={handleVerifyOtp} style={styles.button} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color={Colors.onPrimary} />
                ) : (
                    <Text style={styles.buttonText}>Verifikasi OTP</Text>
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

export default VerifyOtpScreen;
