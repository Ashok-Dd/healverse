  export const convertWeight = (weight : number, fromUnit : string | "kg" | "lbs", toUnit : "kg" | "lbs" ) => {
    if (fromUnit === toUnit) return weight;
    if (fromUnit === "kg" && toUnit === "lbs")
      return Math.round(weight * 2.205 * 10) / 10;
    if (fromUnit === "lbs" && toUnit === "kg")
      return Math.round((weight / 2.205) * 10) / 10;
    return weight;
  };