import React, { useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    Animated,
    Easing,
    Image,
} from "react-native";
import { useNavigation } from '@react-navigation/native';

import Colors from "../constants/Colors";
import Spacing from "../constants/Spacing";
import Font from "../constants/Font";

const SplashScreen: React.FC = () => {
    const navigation = useNavigation();
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 2,
            duration: 2700,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Deteksi' }],
            });
        });
    }, [opacity, navigation]);

    return (
        <View style={styles.container}>
            <Animated.View style={{ ...styles.logoContainer, opacity }}>
                <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.splash,
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 450, // adjust the width as needed
        height: 450, // adjust the height as needed
        resizeMode: 'contain', // to keep the aspect ratio
    },
    logoText: {
        fontFamily: Font["poppins-semiBold"],
        fontSize: Spacing * 3,
        color: 'white',
    },
});

export default SplashScreen;
