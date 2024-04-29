import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Controller } from "react-hook-form";

import { icons } from "../constants";

const FormField = ({
  title,
  otherStyles,
  keyboardType,
  placeholder,
  control,
  name,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <Controller
        control={control}
        name={name}
        render={({
          field: { value, onChange, blur },
          fieldState: { error },
        }) => (
          <View className="flex flex-col space-y-3">
            <View className="flex-row w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary items-center">
              <TextInput
                className="flex-1 text-white font-psemibold text-base"
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#7b7b8b"
                onChangeText={onChange}
                onBlur={blur}
                secureTextEntry={title === "Password" && !showPassword}
                keyboardType={keyboardType}
              />
              {title === "Password" && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Image
                    source={!showPassword ? icons.eye : icons.eyeHide}
                    className="w-6 h-6"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </View>

            {error && (
              <Text className="text-red-500 text-sm">{error.message}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default FormField;
