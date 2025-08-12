import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const features = [
    {
        icon: <FontAwesome5 name="user-md" size={32} color="#2563eb" />,
        title: "Find Doctors",
        description: "Search and connect with top medical professionals.",
    },
    {
        icon: <FontAwesome5 name="calendar-check" size={32} color="#16a34a" />,
        title: "Book Appointments",
        description: "Schedule visits with ease and manage your bookings.",
    },
    {
        icon: <FontAwesome5 name="notes-medical" size={32} color="#7c3aed" />,
        title: "Medical Records",
        description: "Access and manage your health records securely.",
    },
    {
        icon: <FontAwesome5 name="pills" size={32} color="#ec4899" />,
        title: "Prescriptions",
        description: "View and refill your prescriptions online.",
    },
];

const Home: React.FC = () => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Welcome to Healverse</Text>
            <Text style={styles.subtitle}>
                Your one-stop platform for managing your healthcare needs.
            </Text>
            <View style={styles.grid}>
                {features.map((feature) => (
                    <View key={feature.title} style={styles.card}>
                        {feature.icon}
                        <Text style={styles.cardTitle}>{feature.title}</Text>
                        <Text style={styles.cardDesc}>{feature.description}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },
    content: {
        padding: 24,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 4,
        textAlign: "center",
    },
    subtitle: {
        color: "#6b7280",
        marginBottom: 24,
        textAlign: "center",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
        padding: 20,
        alignItems: "center",
        width: 160,
        margin: 8,
    },
    cardTitle: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: "600",
        color: "#374151",
        textAlign: "center",
    },
    cardDesc: {
        marginTop: 6,
        color: "#6b7280",
        fontSize: 13,
        textAlign: "center",
    },
});

export default Home;