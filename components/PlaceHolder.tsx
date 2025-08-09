import { images } from "@/constants";
import React from "react";
import { Image, Text, View } from "react-native";

const PlaceHolder = ({ message }: { message: string }) => {
  return (
    <View className="flex-1 items-center justify-center ">
      <View className="items-center gap-5 justify-center">
        <Image
          source={images.emptyState}
          resizeMode="contain"
          className="h-52 "
        />
        <Text className="text-sm font-light leading-4  ">{message}</Text>
      </View>
    </View>
  );
};

export default PlaceHolder;
