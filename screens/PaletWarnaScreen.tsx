import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Dimensions,
    Platform,
    StatusBar,
} from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import Spacing from "../constants/Spacing";
import Font from "../constants/Font";
import Colors from "../constants/Colors";
import { RootStackParamList } from "../types";
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Props = NativeStackScreenProps<RootStackParamList, "PaletWarna">;

const PaletWarna: React.FC<Props> = ({ route }) => {
    const { category, reportImage, details } = route.params;
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Kategori: {category}</Text>

                {reportImage && (
                    <Image 
                        source={{ uri: reportImage }} 
                        style={styles.image} 
                        resizeMode="contain"
                    />
                )}
                {/* {details && (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailText}>Accuracy: {details.faces[0].accuracy}%</Text>
                    </View>
                )} */}
                <View style={{ marginTop: 1 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home', { category })} style={[styles.button, styles.detectButton]}>
                        <Text style={[styles.buttonText, styles.detectButtonText]}>Lihat Outfit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: Colors.background,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: Spacing * 2,
        paddingBottom: Spacing * 2,
    },
    title: {
        fontFamily: Font["poppins-bold"],
        fontSize: Spacing * 3,
        color: Colors.onPrimary,
        textAlign: "center",
        marginVertical: Spacing * 2,
    },
    image: {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_WIDTH * 0.8,
        alignSelf: "center",
        borderRadius: Spacing,
    },
    detailsContainer: {
        paddingHorizontal: Spacing * 2,
    },
    detailText: {
        fontFamily: Font["poppins-regular"],
        fontSize: Spacing * 1.6,
        color: Colors.onPrimary,
        marginVertical: Spacing / 2,
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

export default PaletWarna;
