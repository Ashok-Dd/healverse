import Skeleton from "@/components/skeleton/Skeleton";
import InlineError from "@/components/ui/InlineError";
import { SyncBadge } from "@/components/ui/SyncBadge";
import { parseServerTime } from "@/lib/day";
import { WaterAmountSheet } from "@/components/WaterAmountSheet";
import { useIsOnline } from "@/lib/network";
import { useWaterLogMutations, useWaterLogs } from "@/store/healthStore";
import { WaterLog } from "@/types/type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

/** Every water entry of one day, with edit and delete (both need a connection). */
const AllWaterLogs = ({ date }: { date: string }) => {
  const isOnline = useIsOnline();
  const { isLoading, error, data: waterLogs, refetch } = useWaterLogs.ByDate(date);
  const { updateWaterLog, deleteWaterLog } = useWaterLogMutations(date);
  const [editing, setEditing] = useState<WaterLog | null>(null);

  const confirmDelete = (log: WaterLog) => {
    Alert.alert("Delete this entry?", `${log.amountMl} mL`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        // A failure is reported by the global mutation error toast (lib/react-query-client.ts).
        onPress: () => deleteWaterLog.mutate(log.id),
      },
    ]);
  };

  if (isLoading) {
    return (
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Skeleton height={56} radius={16} width="100%" className="mb-2" />
        <Skeleton height={56} radius={16} width="100%" />
      </View>
    );
  }

  if (error && !waterLogs) {
    return <InlineError message="Couldn't load your water logs." onRetry={() => refetch()} />;
  }

  if (!waterLogs?.length) {
    return (
      <View className="min-h-[72px] items-center justify-center rounded-2xl border border-dashed border-border px-4 py-3">
        <Text className="text-center font-body text-sm text-muted-foreground">
          No water logged on this day.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-2">
      {!isOnline && (
        <Text className="px-1 font-body text-xs text-muted-foreground">
          Editing and deleting need an internet connection.
        </Text>
      )}
      {waterLogs.map((log) => {
        const deleting = deleteWaterLog.isPending && deleteWaterLog.variables === log.id;
        const canChange = isOnline && !deleteWaterLog.isPending;
        return (
        <View
          key={log.id}
          className={`flex-row items-center gap-3 rounded-2xl bg-muted p-3 ${
            deleting ? "opacity-50" : ""
          }`}
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <MaterialCommunityIcons name="cup-water" size={20} className="text-info" />
          </View>
          <View className="flex-1">
            <Text className="font-body-bold text-base text-foreground">{log.amountMl} mL</Text>
            <Text className="font-body text-xs text-muted-foreground">
              {parseServerTime(log.loggedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <SyncBadge status={log.outboxStatus} />
          </View>
          {!log.outboxStatus && (
            <View className="flex-row">
              <Pressable
                onPress={() => setEditing(log)}
                disabled={!canChange}
                hitSlop={4}
                accessibilityRole="button"
                accessibilityLabel={`Edit ${log.amountMl} millilitres`}
                className={`h-11 w-11 items-center justify-center rounded-full active:opacity-70 ${
                  canChange ? "" : "opacity-40"
                }`}
              >
                <MaterialCommunityIcons name="pencil-outline" size={20} className="text-foreground" />
              </Pressable>
              <Pressable
                onPress={() => confirmDelete(log)}
                disabled={!canChange}
                hitSlop={4}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${log.amountMl} millilitres`}
                className={`h-11 w-11 items-center justify-center rounded-full active:opacity-70 ${
                  canChange ? "" : "opacity-40"
                }`}
              >
                {deleting ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <MaterialCommunityIcons name="trash-can-outline" size={20} className="text-destructive" />
                )}
              </Pressable>
            </View>
          )}
        </View>
        );
      })}

      {editing && (
        <WaterAmountSheet
          visible
          title="Edit water"
          submitLabel="Save"
          initialAmount={Number(editing.amountMl)}
          onClose={() => setEditing(null)}
          saving={updateWaterLog.isPending}
          closeOnSubmit={false}
          onSubmit={(amountMl) =>
            updateWaterLog.mutate(
              { id: editing.id, amountMl },
              { onSuccess: () => setEditing(null) }
            )
          }
        />
      )}
    </View>
  );
};

export default AllWaterLogs;
