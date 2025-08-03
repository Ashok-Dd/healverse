
export const convertWeight = (weight : number, fromUnit : string | "kg" | "lbs", toUnit : "kg" | "lbs" ) => {
    if (fromUnit === toUnit) return weight;
    if (fromUnit === "kg" && toUnit === "lbs")
        return Math.round(weight * 2.205 * 10) / 10;
    if (fromUnit === "lbs" && toUnit === "kg")
        return Math.round((weight / 2.205) * 10) / 10;
    return weight;
};

export const generateWeekDates = (weekStart: Date): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        dates.push(date);
    }
    return dates;
};