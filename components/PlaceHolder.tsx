import { images } from "@/constants";
import React from "react";
import { Image, Text, View } from "react-native";

const PlaceHolder = ({ message }: { message: string }) => {
  return (
    <View className="flex-1 items-center justify-center py-6">
      <View className="items-center gap-5 justify-center">
        <Image
          source={images.emptyState}
          resizeMode="contain"
          className="h-52 w-full"
          accessible={false}
        />
        <Text className="px-6 text-center font-body text-sm text-muted-foreground">{message}</Text>
      </View>
    </View>
  );
};

export default PlaceHolder;
