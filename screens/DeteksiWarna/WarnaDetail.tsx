import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "../../constants/Spacing";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, "WarnaDetail">;

const IMAGE_HEIGHT = 440;

const WarnaDetail: React.FC<Props> = ({ route, navigation }) => {
  const { warna } = route.params;  // Get the Warna ID from route params
  const [product, setProduct] = useState<any>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number, height: number } | null>(null);

  useEffect(() => {
    const fetchWarnaDetails = async () => {
      try {
        const response = await axios.get(`http://34.128.112.213:5000/api/json/warna/${warna}`);
        setProduct(response.data.palet[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWarnaDetails();
  }, [warna]);

  useEffect(() => {
    if (product && product.strWarnaThumb) {
      Image.getSize(product.strWarnaThumb, (width, height) => {
        setImageDimensions({ width, height });
      }, (error) => {
        console.error(error);
      });
    }
  }, [product]);

  if (!product || !imageDimensions) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }

  const aspectRatio = imageDimensions.width / imageDimensions.height;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={{ paddingHorizontal: Spacing * 2 }}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={Spacing * 3} color={Colors.onPrimary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{product.warna}</Text>

          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search-outline" size={Spacing * 3} style={{ color: Colors.splash }} />
          </TouchableOpacity>
        </View>

        {/* Gambar */}
        <Image
          source={{ uri: product.strWarnaThumb }}
          style={[styles.image, { aspectRatio }]}
        />

        {/* Nama & Warna */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.strWarna}</Text>
        </View>

        {/* Detail */}
        <Text style={styles.productDescription}>{product.strDesc}</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default WarnaDetail;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background, // Ensure background color matches your design
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: Spacing / 2,
  },
  headerTitle: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: Spacing * 2,
    color: Colors.onPrimary,
  },
  searchButton: {
    padding: Spacing / 2,
  },
  image: {
    width: "100%",
    marginVertical: Spacing,
  },
  productInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    paddingVertical: Spacing,
  },
  productName: {
    fontSize: Spacing * 3,
    fontFamily: Font["poppins-bold"],
    color: Colors.gold,
  },
  productDescription: {
    color: Colors.onPrimary,
    fontFamily: Font["poppins-regular"],
    fontSize: Spacing * 1.4,
  },
});
