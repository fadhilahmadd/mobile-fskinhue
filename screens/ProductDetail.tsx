import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "../constants/Spacing";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetail">;

const IMAGE_HEIGHT = 440;

const ProductDetail: React.FC<Props> = ({ route, navigation }) => {
  const { idOutfit } = route.params;  // Get the outfit ID from route params
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    // Fetch product details based on the ID
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.26.16:5000/api/json/v1/detail/${idOutfit}`);
        setProduct(response.data.detail[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductDetails();
  }, [idOutfit]);

  if (!product) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={{ paddingHorizontal: Spacing * 2 }}>

        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: Spacing / 2 }}>
            <Ionicons name="arrow-back-outline" size={Spacing * 3} color={Colors.onPrimary} />
          </TouchableOpacity>

          <Text style={{ fontFamily: Font["poppins-semiBold"], fontSize: Spacing * 2, color: Colors.onPrimary }}>Detail</Text>

          <TouchableOpacity style={{ padding: Spacing / 2 }}>
            <Ionicons name="search-outline" size={Spacing * 3} style={{color: Colors.splash}} />
          </TouchableOpacity>
        </View>

        {/* Gambar */}
        <Image source={{ uri: product.strOutfitThumb }} style={{ width: "100%", height: IMAGE_HEIGHT, borderRadius: Spacing * 6, marginVertical: Spacing }} />

        {/* Nama & Warna */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center", paddingVertical: Spacing }}>
          <Text style={{ fontSize: Spacing * 3, fontFamily: Font["poppins-bold"], color: Colors.gold }}>{product.strOutfit}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {product.hexColor1 && (
              <View
                style={[
                  {
                    margin: Spacing / 5,
                    borderRadius: Spacing * 2,
                    borderWidth: 1,
                    borderColor: 'white'
                  },
                ]}
              >
                <View
                  style={{
                    backgroundColor: `#${product.hexColor1}`,
                    height: Spacing * 2,
                    width: Spacing * 2,
                    borderRadius: Spacing,
                  }}
                />
              </View>
            )}
            {product.hexColor2 && (
              <View
                style={[
                  {
                    margin: Spacing / 5,
                    borderRadius: Spacing * 2,
                    borderWidth: 1,
                    borderColor: 'white'
                  },
                ]}
              >
                <View
                  style={{
                    backgroundColor: `#${product.hexColor2}`,
                    height: Spacing * 2,
                    width: Spacing * 2,
                    borderRadius: Spacing,
                  }}
                />
              </View>
            )}
            {product.hexColor3 && (
              <View
                style={[
                  {
                    margin: Spacing / 5,
                    borderRadius: Spacing * 2,
                    borderWidth: 1,
                    borderColor: 'white',
                  },
                ]}
              >
                <View
                  style={{
                    backgroundColor: `#${product.hexColor3}`,
                    height: Spacing * 2,
                    width: Spacing * 2,
                    borderRadius: Spacing,
                  }}
                />
              </View>
            )}
          </View>
        </View>

        {/* Detail */}
        <Text style={{ color: Colors.onPrimary, fontFamily: Font["poppins-regular"], fontSize: Spacing * 1.4 }}>{product.strDescription}</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background, // Ensure background color matches your design
  },
});
