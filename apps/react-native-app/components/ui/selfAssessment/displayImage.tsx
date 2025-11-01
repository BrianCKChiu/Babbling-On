import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { getFile } from "@/firebase";
import { Center, Image, Spinner } from "native-base";

export const DisplayImage = ({ path }: { path: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = await getFile(path);
        setImageUrl(url);
      } catch (error) {
        console.error("Error fetching image: ", error);
      }
    };

    fetchImage();
  }, [path]);

  return (
    <View style={styles.imageContainer}>
      {imageUrl ? (
        <Center>
          <Image
          style={{borderColor: "black", borderWidth: 3}}
            source={{
              uri: imageUrl,
            }}
            alt="Gesture"
            size="2xl"
          />
        </Center>
      ) : (
        <View style={[styles.imagePlaceholder]}>
          <Spinner color="cyan.500" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
});
