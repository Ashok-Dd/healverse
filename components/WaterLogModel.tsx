import { WaterAmountSheet } from "@/components/WaterAmountSheet";
import { logWater } from "@/lib/outboxActions";
import React from "react";

interface WaterLogModalProps {
  visible: boolean;
  onClose: () => void;
  /** Water already logged today, in mL. */
  currentIntake?: number;
  /** Daily goal in mL. */
  dailyGoal?: number;
}

/** Adds a water entry. It is queued and shown at once, like every other log. */
export const WaterLogModal: React.FC<WaterLogModalProps> = (props) => (
  <WaterAmountSheet {...props} title="Log water" submitLabel="Log water" onSubmit={logWater} />
);
