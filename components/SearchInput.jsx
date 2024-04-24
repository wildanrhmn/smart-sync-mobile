import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import { icons } from "../constants";

import Toast from "react-native-root-toast";

const SearchInput = ({ initialQuery, placeholder }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");
  return (
    <View className="flex flex-row items-center space-x-4 px-4 w-full h-16 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
      <TextInput
        className="text-base mt-0.5 text-white font-pregular flex-1"
        value={query}
        placeholder={placeholder}
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (!pathname.startsWith("/bookmark")) {
            if (query === "")
              return Toast.show("Please enter a search query", {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
              });
          }
          if (pathname.startsWith("/search")) router.setParams({ query });
          if (pathname.startsWith("/bookmark")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Image source={icons.search} className="w-6 h-6" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
