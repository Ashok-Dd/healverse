import { useWaterLogs } from "@/store/healthStore";
import { DailySummary, WaterLog } from "@/types/type";
import { router } from "expo-router";
import ErrorCard from "./cards/ErrorCard";
import LogCard from "./LogCard";
import { WaterLogHolder } from "./LogHolders";
import { SkeletonLogCard } from "./skeleton/LoggingSkeleton";
import { useState } from "react";
import { WaterLogModal } from "./WaterLogModel";
import { useSummaryData } from "@/hooks/useSummaryData";

interface WaterLogsProps {
    date: string;
}

const WaterLogs = ({ date }: WaterLogsProps) => {
    const [openWaterModel, setOpenWaterModel] = useState(false);
    
    const {
        data: waterLogs,
        isLoading,
        error
    } = useWaterLogs.ByDate(date);

    const {data : summary } = useSummaryData(date);


    return isLoading ? (
        <SkeletonLogCard/>
    ) : error ? (
        <ErrorCard message={error.message} />
    ) : (

        <>
            <LogCard<WaterLog>
                icon="🚰"
                title="Water Intake"
                description="Stay hydrated!"
                buttonText="+ Log Water"
                Link={() => setOpenWaterModel(true)}
                showArrow={true}
                emojiIcon="👥"
                backgroundStyle="bg-green-50"
                items={waterLogs as WaterLog[]}
                component={WaterLogHolder}
                moveTo={() => router.push("/(root)/all-logs/water" as any)}
            />
            <WaterLogModal
                date={date}
                visible={openWaterModel}
                onClose={() => setOpenWaterModel(false)}
                currentIntake={(summary as DailySummary)?.waterConsumedMl || 0}
                dailyGoal={(summary as DailySummary)?.targetWaterMl || 0}
            />
        </>
        
    );
};


export default WaterLogs;