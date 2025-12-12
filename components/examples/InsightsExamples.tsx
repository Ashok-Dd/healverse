// Example usage of InsightsCard and CompactInsights components

import CompactInsights from '@/components/CompactInsights';
import InsightsCard from '@/components/InsightsCard';
import React from 'react';
import { ScrollView, View } from 'react-native';

// Example 1: Full InsightsCard components
export const FullInsightsExample = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Health Insights */}
      <InsightsCard 
        type="health" 
        title="Your Health Insights" 
        maxItems={5}
        showIcon={true}
      />
      
      {/* Diet Insights */}
      <InsightsCard 
        type="diet" 
        title="Nutrition Tips" 
        maxItems={4}
      />
      
      {/* Medication Insights */}
      <InsightsCard 
        type="medication" 
        title="Medication Reminders" 
        maxItems={3}
      />
    </ScrollView>
  );
};

// Example 2: Compact insights for dashboard
export const DashboardInsightsExample = () => {
  return (
    <View className="bg-gray-50 p-4">
      {/* Row of compact insights */}
      <View className="flex-row space-x-2 mb-4">
        <View className="flex-1">
          <CompactInsights 
            type="health" 
            maxItems={2}
            onPress={() => {
              // Navigate to full health insights
              console.log('Navigate to health insights');
            }}
          />
        </View>
        <View className="flex-1">
          <CompactInsights 
            type="diet" 
            maxItems={2}
            onPress={() => {
              // Navigate to full diet insights
              console.log('Navigate to diet insights');
            }}
          />
        </View>
      </View>
      
      {/* Single wide compact insight */}
      <CompactInsights 
        type="medication" 
        maxItems={3}
        onPress={() => {
          // Navigate to full medication insights
          console.log('Navigate to medication insights');
        }}
      />
    </View>
  );
};

// Example 3: Mixed layout
export const MixedInsightsExample = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Featured insight */}
      <InsightsCard 
        type="health" 
        title="Today's Health Focus"
        maxItems={1}
      />
      
      {/* Quick overview row */}
      <View className="flex-row space-x-2 mb-4">
        <View className="flex-1">
          <CompactInsights type="diet" maxItems={1} />
        </View>
        <View className="flex-1">
          <CompactInsights type="medication" maxItems={1} />
        </View>
      </View>
      
      {/* Detailed diet insights */}
      <InsightsCard 
        type="diet" 
        title="Detailed Nutrition Guide"
        maxItems={4}
      />
    </ScrollView>
  );
};

// Example 4: Single type focus page
export const SingleTypeInsightsPage = ({ type }: { type: "health" | "diet" | "medication" }) => {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <InsightsCard 
        type={type}
        maxItems={10} // Show more items on dedicated page
        showIcon={true}
      />
    </ScrollView>
  );
};
