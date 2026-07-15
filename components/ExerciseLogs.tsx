import { useExerciseLogs } from "@/store/healthStore";
import { ExerciseLog } from "@/types/type";
import { router } from "expo-router";
import ErrorCard from "./cards/ErrorCard";
import LogCard from "./LogCard";
import { ExerciseLogHolder } from "./LogHolders";
import { SkeletonLogCard } from "./skeleton/LoggingSkeleton";

interface ExerciseLogsProps {
    date: string;
}

const ExerciseLogs = ({ date }: ExerciseLogsProps) => {

    const {
        data: exerciseLogs,
        isLoading,
        error
    } = useExerciseLogs.ByDate(date);


    return isLoading ? (
        <SkeletonLogCard/>
    ) : error ? (
        <ErrorCard message={error.message} />
    ) : (
        <LogCard<ExerciseLog>
            icon="🏃"
            title="Exercise"
            description="Move more, feel better!"
            buttonText="+ Log Exercise"
            Link={() => router.push("/(root)/add-exercise-log")}
            showArrow={true}
            emojiIcon="👥"
            backgroundStyle="bg-green-50"
            items={exerciseLogs as ExerciseLog[]}
            component={ExerciseLogHolder}
            moveTo={() => router.push("/(root)/all-logs/exercise" as any)}
        />
    );
};


export default ExerciseLogs;