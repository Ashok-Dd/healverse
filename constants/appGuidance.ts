// Predefined app guidance content

export interface GuidanceContent {
  title: string;
  content: string;
  type?: 'info' | 'tip' | 'warning' | 'feature';
  icon?: string;
}

export const APP_GUIDANCE = {
  // Tracker Page Guidance
  TRACKER_OVERVIEW: {
    title: "📊 Tracker Overview",
    content: `# Welcome to Your Health Tracker!

This is your central hub for monitoring your daily health journey. Here's what you can do:

## Food Logging
• Tap the camera button to log meals instantly with AI recognition
• View your daily nutrition breakdown in real-time
• Track calories, protein, carbs, and fats automatically

## Nutrition Overview
• See your daily progress with interactive charts
• Monitor if you're meeting your health goals
• Get insights on your eating patterns

## AI Health Insights
• Receive personalized recommendations based on your data
• Get tips for better nutrition and health habits
• See warnings if you're off track with your goals

## Quick Actions
• Use the floating action button for quick food logging
• Switch between different dates to view historical data
• Access detailed logs by tapping the arrow buttons

Remember: Consistency is key to achieving your health goals. Log your meals regularly for the best insights!`,
    type: 'feature'
  },

  FOOD_LOGGING: {
    title: "📸 Smart Food Logging",
    content: `# How to Log Your Meals

## Camera Recognition
• Point your camera at any meal or food item
• Our AI will automatically identify the food and estimate nutrition
• Review and confirm the details before saving

## Manual Entry
• Tap "Manual Entry" if the AI recognition isn't accurate
• Search from our extensive food database
• Adjust portions and quantities as needed

## Best Practices
• Take clear, well-lit photos for better recognition
• Include all items in your meal for accurate tracking
• Log meals right after eating for consistency

## Tips for Better Results
• Capture the entire meal from above when possible
• Separate different food items if they're mixed together
• Use standard serving sizes when possible

The more you use it, the better our AI becomes at recognizing your favorite foods!`,
    type: 'tip'
  },

  AI_INSIGHTS: {
    title: "🤖 AI Health Insights",
    content: `# Understanding Your AI Health Coach

## What Are Insights?
Your personal AI analyzes your daily health data to provide customized recommendations and feedback.

## Types of Insights

### Health Insights ❤️
• Exercise recommendations based on your activity level
• Sleep and stress management tips
• Overall wellness suggestions

### Diet Insights 🥗
• Nutritional balance feedback
• Hydration reminders
• Meal timing and portion suggestions

## How It Works
• Your AI learns from your daily logging patterns
• Insights are updated daily based on new data
• Recommendations become more personalized over time

## Acting on Insights
• Tap on any insight to get more detailed information
• Use the suggestions to improve your health habits
• Track your progress as you implement changes

Your AI coach is here to help you make sustainable, healthy choices every day!`,
    type: 'info'
  },

  NUTRITION_TRACKING: {
    title: "📈 Nutrition Tracking Guide",
    content: `# Master Your Nutrition Tracking

## Understanding the Charts
• **Calories**: Your daily energy intake vs. your goal
• **Protein**: Essential for muscle health and recovery
• **Carbs**: Your body's primary energy source
• **Fats**: Important for hormone production and vitamin absorption

## Color-Coded Progress
• **Green**: You're on track or exceeded your goal healthily
• **Orange**: You're close to your goal, keep going!
• **Red**: You're significantly over or under your target

## Daily Targets
Your targets are calculated based on:
• Your age, gender, and activity level
• Your health goals (lose, maintain, or gain weight)
• Any medical conditions or dietary restrictions

## Pro Tips
• Aim to hit your protein target first
• Don't fear healthy fats - they're essential
• Balance your carbs throughout the day
• Stay within 10% of your calorie goal for best results

## Weekly Patterns
• Review your weekly trends to identify patterns
• Adjust your meal planning based on insights
• Celebrate consistent days - they add up to big results!

Remember: It's about progress, not perfection. Small consistent improvements lead to lasting change.`,
    type: 'tip'
  },

  GAMIFICATION_SYSTEM: {
    title: "🎮 Your Health Journey Rewards",
    content: `# Earn Points and Build Streaks!

## How Points Work
• **Food Logging**: 10 points per meal logged
• **Exercise Tracking**: 15 points per workout
• **Daily Goals**: 25 bonus points for hitting all targets

## Streak System
• **Daily Streak**: Log at least one activity each day
• **Weekly Streak**: Meet your weekly goals consistently
• **Monthly Challenges**: Special achievements for long-term success

## Achievement Badges
• **Consistency Champion**: 30-day logging streak
• **Nutrition Master**: Hit nutrition goals 7 days in a row
• **Workout Warrior**: Complete 10 exercise sessions

## Leaderboards & Challenges
• Compare your progress with friends (anonymously)
• Join monthly community challenges
• Compete in seasonal health competitions

## Rewards & Benefits
• Unlock premium features with points
• Get access to exclusive health content
• Earn discounts on health products
• Celebrate milestones with virtual rewards

## Tips for Maximum Points
• Log everything consistently
• Set realistic, achievable goals
• Use the app's reminder features
• Celebrate small wins along the way

Remember: The real reward is your improved health, but points make the journey more fun!`,
    type: 'feature'
  },

  GETTING_STARTED: {
    title: "🚀 Getting Started with HealVerse",
    content: `# Welcome to Your Health Journey!

## First Steps
1. **Complete Your Profile**: Add your basic information, health goals, and any medical conditions
2. **Set Your Targets**: Let us calculate your daily nutrition and activity goals
3. **Take Your First Photo**: Log your next meal to see our AI in action
4. **Explore Insights**: Check out your personalized recommendations

## Daily Routine
### Morning
• Log your breakfast
• Check your daily insights and goals
• Plan your meals and activities for the day

### Throughout the Day
• Log meals as you eat them
• Track water intake and exercise
• Log your lunch and snacks

### Evening
• Review your daily progress
• Plan tomorrow's meals
• Check your streaks and achievements

## Making the Most of HealVerse
• **Be Consistent**: Regular logging provides better insights
• **Stay Curious**: Explore all features and learn from your data
• **Set Realistic Goals**: Small, achievable changes lead to lasting results
• **Celebrate Progress**: Acknowledge your wins, no matter how small

## Getting Help
• Use the guidance modals throughout the app
• Check the insights section for personalized tips
• Contact support if you have technical issues

## Privacy & Data
• Your health data is encrypted and secure
• You control what information you share
• Data is used only to improve your personal experience

Ready to transform your health? Let's start this journey together!`,
    type: 'feature'
  },

  EXERCISE_TRACKING: {
    title: "🏃‍♀️ Exercise & Activity Tracking",
    content: `# Track Your Fitness Journey

## Logging Workouts
• Choose from hundreds of exercise types
• Set duration and intensity levels
• Get automatic calorie burn calculations

## Activity Types
• **Cardio**: Running, cycling, swimming, dancing
• **Strength**: Weight lifting, resistance training, bodyweight exercises
• **Sports**: Tennis, basketball, soccer, martial arts
• **Everyday**: Walking, cleaning, gardening, playing with kids

## Intensity Levels
• **Low**: Light activity, easy conversation possible
• **Moderate**: Slightly out of breath, can still talk
• **High**: Challenging, difficult to maintain conversation

## Smart Features
• **GPS Tracking**: For outdoor activities like running or cycling
• **Heart Rate Integration**: Connect fitness trackers for accurate data
• **Workout Plans**: Follow structured exercise programs
• **Rest Day Reminders**: Balance activity with recovery

## Progress Tracking
• Monitor calories burned over time
• Track improvements in duration and intensity
• See how exercise affects your overall health metrics
• Get insights on optimal workout timing

## Exercise Insights
• Recommendations for exercise types based on your goals
• Suggestions for activity levels to support weight management
• Tips for incorporating more movement into your day
• Recovery and rest day guidance

## Integration Benefits
• Exercise data improves nutrition recommendations
• Activity levels affect your daily calorie targets
• Comprehensive health picture for better insights

Start where you are, use what you have, do what you can. Every step counts!`,
    type: 'tip'
  }
} as const;

// Helper function to get guidance by key
export const getGuidanceContent = (key: keyof typeof APP_GUIDANCE): GuidanceContent => {
  return APP_GUIDANCE[key];
};
