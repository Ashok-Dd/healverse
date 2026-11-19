import { WheelColumn } from "@/components/ui/WheelColumn";
import React from "react";
import { View } from "react-native";

interface WheelPickerProps {
  data: number[];
  value: number;
  onChange: (value: number) => void;
  itemHeight?: number;
}

const toKey = (item: number) => item.toString();
const toLabel = (item: number) => item.toString();

/** Vertical number wheel with a highlighted centre row. `value` is read once, when it mounts. */
export function WheelPicker({ data, value, onChange, itemHeight = 64 }: WheelPickerProps) {
  return (
    <View className="items-center justify-center">
      <WheelColumn
        data={data}
        value={value}
        onChange={onChange}
        renderLabel={toLabel}
        keyExtractor={toKey}
        itemHeight={itemHeight}
        className="w-40"
        textClassName="font-display-bold text-3xl text-foreground"
      />
    </View>
  );
}
