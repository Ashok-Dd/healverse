import { images } from "@/constants";
import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

interface PlaceHolderProps {
  message: string;
  image?: ImageSourcePropType;
}

const PlaceHolder = ({ message, image = images.emptyState }: PlaceHolderProps) => {
  return (
    <View className="flex-1 items-center justify-center py-6">
      <View className="items-center gap-5 justify-center">
        <Image
          source={image}
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
