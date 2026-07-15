import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#4ade80', // Green color for active tab
                tabBarInactiveTintColor: '#9ca3af', // Gray color for inactive tabs
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#e5e7eb',
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                headerShown: false,
            }}>

            <Tabs.Screen
                name="dietitian"
                options={{
                    title: 'Dietitian',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="sparkles" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="diet"
                options={{
                    title: 'Diet',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="nutrition" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="tracker"
                options={{
                    title: 'Tracker',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="logging"
                options={{
                    title: 'Logging',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="scan" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="account"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-circle" size={size} color={color} />
                    ),
                }}
            />

        </Tabs>
    );
}