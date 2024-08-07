import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Alert,
    Dimensions,
    Platform,
    StatusBar,
    ActivityIndicator,
    BackHandler,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import Spacing from "../constants/Spacing";
import Font from "../constants/Font";
import Colors from "../constants/Colors";

const { width } = Dimensions.get('window');
const IMAGE_MAX_WIDTH = width * 0.9;

const DetectionScreen: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageWidth, setImageWidth] = useState<number>(0);
    const [imageHeight, setImageHeight] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingWarna, setLoadingWarna] = useState<boolean>(false);
    const navigation = useNavigation();

    // Custom back button behavior
    useEffect(() => {
        const backAction = () => {
            if (navigation.canGoBack()) {
                navigation.navigate('Deteksi'); // Or navigate to a different screen if needed
                return true;
            } else {
                return false;
            }
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [navigation]);

    const handleUploadImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            const uri = result.assets[0].uri;
            Image.getSize(uri, (width, height) => {
                const scaleFactor = width / IMAGE_MAX_WIDTH;
                setImageWidth(IMAGE_MAX_WIDTH);
                setImageHeight(height / scaleFactor);
            });
            setSelectedImage(uri);
        }
    };

    const handleTakePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            const uri = result.assets[0].uri;
            Image.getSize(uri, (width, height) => {
                const scaleFactor = width / IMAGE_MAX_WIDTH;
                setImageWidth(IMAGE_MAX_WIDTH);
                setImageHeight(height / scaleFactor);
            });
            setSelectedImage(uri);
        }
    };

    const handleClearImage = () => {
        setSelectedImage(null);
        setImageWidth(0);
        setImageHeight(0);
    };

    const handlePrediction = async (endpoint: string) => {
        if (!selectedImage) {
            Alert.alert("Tidak ada gambar yang dipilih", "Tolong unggah gambar atau ambil foto untuk diproses.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('files', {
            uri: selectedImage,
            name: 'photo.jpg',
            type: 'image/jpeg'
        } as any);

        try {
            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const prediction = response.data[0].class;
            console.log(prediction);
            if (prediction === "Tidak Diketahui") {
                Alert.alert("Hasil Prediksi", "Prediction: Tidak Diketahui");
            } else {
                navigation.navigate('Home', { category: prediction });
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Kesalahan saat membuat prediksi.");
        } finally {
            setLoading(false);
        }
    };

    const handlePredictionWarna = async (endpoint: string) => {
        if (!selectedImage) {
            Alert.alert("Tidak ada gambar yang dipilih", "Tolong unggah gambar atau ambil foto untuk diproses.");
            return;
        }

        setLoadingWarna(true);

        const formData = new FormData();
        formData.append('files', {
            uri: selectedImage,
            name: 'photo.jpg',
            type: 'image/jpeg'
        } as any);

        try {
            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const prediction = response.data[0].class;
            console.log(prediction);

            if (prediction === "Tidak Diketahui") {
                Alert.alert("Hasil Prediksi", "Prediction: Tidak Diketahui");
            } else {
                navigation.navigate('WarnaDetail', { warna: prediction });
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong while making the prediction.");
        } finally {
            setLoadingWarna(false);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomColor: Colors.onPrimary }}>
                <Image source={require('../assets/images/logo.png')} style={styles.logo} />

                <Text style={{ fontFamily: Font["poppins-semiBold"], fontSize: Spacing * 2, color: Colors.onPrimary }}></Text>

                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={{ fontFamily: Font["poppins-semiBold"], fontSize: Spacing * 2, color: Colors.gold }}>
                        Selamat Datang,
                    </Text>
                </View>
                <View style={styles.header}>
                    <Text style={{ fontFamily: Font["poppins-semiBold"], fontSize: Spacing * 2, color: Colors.gold }}>
                        Di Aplikasi F-SkinHue
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleUploadImage} style={styles.button}>
                        <Text style={styles.buttonText}>Unggah Gambar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleTakePhoto} style={styles.button}>
                        <Text style={styles.buttonText}>Ambil Foto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleClearImage} style={styles.button}>
                        <Text style={styles.buttonText}>Bersihkan Gambar</Text>
                    </TouchableOpacity>
                </View>

                {selectedImage && (
                    <Image source={{ uri: selectedImage }} style={{ width: imageWidth, height: imageHeight, borderRadius: Spacing * 2, alignSelf: 'center', marginVertical: Spacing }} />
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => handlePrediction('http://34.128.112.213:5000/yolo')}
                        style={[styles.button, styles.detectButton]}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color={Colors.onPrimary} />
                        ) : (
                            <Text style={[styles.buttonText, styles.detectButtonText]}>Ayo Deteksi Undertone!</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => handlePredictionWarna('http://34.128.112.213:5000/yolo-warna')}
                        style={[styles.button, styles.detectButton]}
                        disabled={loadingWarna}
                    >
                        {loadingWarna ? (
                            <ActivityIndicator size="small" color={Colors.onPrimary} />
                        ) : (
                            <Text style={[styles.buttonText, styles.detectButtonText]}>Ayo Deteksi Warna!</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

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
    scrollContainer: {
        flexGrow: 1,
    },
    header: {
        flexDirection: "row",
    },
    title: {
        fontFamily: Font["poppins-bold"],
        fontSize: Spacing * 3,
        color: Colors.text,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: Spacing,
        marginTop: Spacing * 2,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: Spacing,
        borderRadius: Spacing,
        flex: 1,
        marginHorizontal: Spacing / 2,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: Font["poppins-semiBold"],
        color: Colors.splash,
        fontSize: Spacing * 1.6,
    },
    detectButton: {
        backgroundColor: Colors.primary,
    },
    detectButtonText: {
        fontFamily: Font["poppins-semiBold"],
        color: Colors.splash,
        fontSize: Spacing * 1.6,
    },
    logoutButton: {
        
        backgroundColor: Colors.gold,
        padding: Spacing / 2,
        borderRadius: Spacing,
        alignItems: 'center',
        marginVertical: Spacing * 2,
    },
    logoutButtonText: {
        fontFamily: Font["poppins-semiBold"],
        color: Colors.splash,
        fontSize: Spacing * 1.6,
    },
    logo: {
        width: 90, // adjust the width as needed
        height: 90, // adjust the height as needed
        resizeMode: 'contain', // to keep the aspect ratio
    },
});

export default DetectionScreen;
