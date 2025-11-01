import React, { useEffect } from "react";

import { Box, Heading } from "native-base";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DrawerContentComponentProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { Drawer } from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

// helpers
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useUserStore } from "@/stores/userStore";

// Icons
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const drawerItemProps = {
  drawerActiveBackgroundColor: "#FFF6A7",
  drawerActiveTintColor: "#000000",
  drawerItemStyle: {
    paddingHorizontal: 8,
  },
};
export default function TabLayout() {
  const [user, isLoading] = useAuthState(auth);
  const { setUserExp } = useUserStore();
  // loads user level and creates user doc if not found
  useEffect(() => {
    if (isLoading) return;
    if (user == null) return;

    async function getUserLevel() {
      if (user == null) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      // if user isn't found create user doc
      if (!userDoc.exists()) {
        const newUserData = {
          level: 1,
          currentExp: 0,
        };
        await setDoc(doc(db, "users", user.uid), newUserData);
        setUserExp(newUserData.level, newUserData.currentExp);
      } else {
        setUserExp(userDoc.data()?.level, userDoc.data()?.currentExp);
      }
    }

    getUserLevel();
  }, [user]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="Home"
        screenOptions={{
          drawerItemStyle: {
            paddingHorizontal: 8,
            justifyContent: "flex-start",
            borderRadius: 8,
          },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="home"
          options={{
            headerShown: false,
            title: "Home",
            ...drawerItemProps,
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="course"
          options={{
            headerShown: false,
            title: "Explore Courses",
            ...drawerItemProps,
            drawerIcon: ({ color, size }) => (
              <FontAwesome name="compass" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="assessment"
          {...drawerItemProps}
          options={{
            headerShown: false,
            title: "Assessment",
            ...drawerItemProps,
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="check-circle" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings" // temporary change to quiz page
          options={{
            headerShown: false,
            ...drawerItemProps,
            title: "Settings",
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="settings" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile" // temporary change to quiz page
          options={{
            headerShown: false,
            ...drawerItemProps,
            title: "Profile",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>

    // ^^ tab menu
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <Box alignItems={"center"} mb={16} mt={4}>
        <Heading>Babbling On</Heading>
      </Box>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
