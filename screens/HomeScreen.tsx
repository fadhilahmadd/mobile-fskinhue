import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";

import { user } from "../data/index";
import Spacing from "../constants/Spacing";
import Font from "../constants/Font";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import axios from 'axios';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = 250; // Declare IMAGE_HEIGHT here

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { category } = route.params;  // Get the category from route params
  const [outfits, setOutfits] = useState<any[]>([]);

  useEffect(() => {
    // Fetch outfits based on the category
    const fetchOutfits = async () => {
      try {
        const response = await axios.get(`http://34.128.112.213:5000/api/json/categories/${category}`);
        setOutfits(response.data.outfit);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOutfits();
  }, [category]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: Spacing / 2 }}>
              <Ionicons name="arrow-back-outline" size={Spacing * 3} color={Colors.onPrimary} />
            </TouchableOpacity>
          </View>

          <Text style={{ fontFamily: Font["poppins-semiBold"], fontSize: Spacing * 2, color: Colors.gold }}>Rekomendasi Outfit</Text>

          <View style={styles.headerRight}>
            <TouchableOpacity style={{ padding: Spacing / 2 }}>
              <Ionicons name="search-outline" size={Spacing * 3} style={{color: Colors.splash}} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.introTextContainer}>
          <Text style={styles.introText}>Bersinar dengan<Text style={styles.introTextHighlight}> Warna </Text> yang tepat</Text>
        </View>

        <Text style={{ fontSize: Spacing * 2, fontFamily: Font["poppins-semiBold"], color: Colors.onPrimary }}>Kategori Undertone</Text>
        <ScrollView horizontal contentContainerStyle={{ paddingVertical: Spacing }}>
          {
            <TouchableOpacity
              style={[
                {
                  paddingHorizontal: Spacing * 2,
                  paddingVertical: Spacing / 2,
                  borderWidth: 1,
                  borderRadius: Spacing * 2,
                  borderColor: Colors.border,
                  marginRight: Spacing,
                  backgroundColor: Colors.primary,
                },
              ]}
            >
              <Text
                style={{
                  color: Colors.onPrimary,
                  fontSize: Spacing * 1.4,
                  fontFamily: Font["poppins-regular"]
                }}
              >
                {category}
              </Text>
            </TouchableOpacity>}
        </ScrollView>

        <View style={styles.outfitsContainer}>
          {outfits.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.outfitCard}
              onPress={() => navigation.navigate('OutfitDetail', { idOutfit: item.idOutfit })}
            >
              <Image
                source={{ uri: item.strOutfitThumb }}
                style={styles.outfitImage}
                resizeMode="cover"
              />
              <Text style={styles.outfitName}>{item.strOutfit}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: Colors.background, // Add background color to avoid white space behind status bar
  },
  scrollView: {
    paddingHorizontal: Spacing * 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: Spacing * 4,
    height: Spacing * 4,
    borderRadius: Spacing * 2,
  },
  userName: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: Spacing * 2,
    color: Colors.text,
    marginLeft: Spacing,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: Spacing / 2,
  },
  introTextContainer: {
    paddingVertical: Spacing * 2,
  },
  introText: {
    fontSize: Spacing * 3.5,
    fontFamily: Font["poppins-bold"],
    color: Colors.onPrimary,
  },
  introTextHighlight: {
    fontSize: Spacing * 4,
    color: Colors.primary,
  },
  recommendedTextContainer: {
    paddingVertical: Spacing * 2,
  },
  recommendedText: {
    fontSize: Spacing * 2,
    fontFamily: Font["poppins-bold"],
    color: Colors.text,
  },
  outfitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  outfitCard: {
    width: (SCREEN_WIDTH - (Spacing * 6)) / 2,  // Adjusting width based on screen size
    marginVertical: Spacing,
  },
  outfitImage: {
    width: "100%",
    height: IMAGE_HEIGHT,
    borderRadius: Spacing,
  },
  outfitName: {
    fontFamily: Font["poppins-semiBold"],
    fontSize: Spacing * 2,
    color: Colors.onPrimary,
    marginTop: Spacing,
  },
});

export default HomeScreen;
