import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WebViewScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <View>
        <Text>Web View</Text>
      </View>
    </SafeAreaView>
  );
}
