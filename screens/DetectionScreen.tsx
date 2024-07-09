import React, { useState } from "react";
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
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import Spacing from "../constants/Spacing";
import Font from "../constants/Font";
import Colors from "../constants/Colors";
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const IMAGE_MAX_WIDTH = width * 0.9;

const DetectionScreen: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageWidth, setImageWidth] = useState<number>(0);
    const [imageHeight, setImageHeight] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [reportImage, setReportImage] = useState<string | null>(null);
    const navigation = useNavigation();

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
        setReportImage(null);
    };

    const handlePrediction = async (endpoint: string) => {
        if (!selectedImage) {
            Alert.alert("No image selected", "Please select or take a photo to proceed.");
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
            const reportImagePath = response.data[0].report_image_path;
            const fullReportImagePath = `http://192.168.26.16:5000/uploads/${reportImagePath}`;
            
            setReportImage(fullReportImagePath);

            if (prediction === "Tidak Diketahui") {
                Alert.alert("Hasil Prediksi", "Prediction: Tidak Diketahui");
            } else {
                const data = response.data[0];
                navigation.navigate('PaletWarna', { 
                    category: prediction,
                    reportImage: fullReportImagePath,
                    details: data.skin_tone_result,
                });
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Pastikan anda mengambil foto wajah yang jelas.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={{ fontFamily: Font["poppins-semiBold"], fontSize: Spacing * 2, color: Colors.gold }}>
                        Rekomendasi Outfit
                    </Text>
                </View>
                <View style={styles.header}>
                    <Text style={{ fontFamily: Font["poppins-semiBold"], fontSize: Spacing * 2, color: Colors.gold }}>
                        Berdasarkan Korelasi Warna Kulit
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

                {/* {reportImage && (
                    <Image source={{ uri: reportImage }} style={{ width: imageWidth, height: imageHeight, borderRadius: Spacing * 2, alignSelf: 'center', marginVertical: Spacing }} />
                )} */}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => handlePrediction('http://192.168.26.16:5000/yolo')}
                        style={[styles.button, styles.detectButton]}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color={Colors.onPrimary} />
                        ) : (
                            <Text style={[styles.buttonText, styles.detectButtonText]}>Ayo Deteksi!</Text>
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
        justifyContent: "center",
        alignItems: "center",
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
});

export default DetectionScreen;
