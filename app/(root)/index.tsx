import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Types
interface FeatureCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string[];
  badge: string;
  stats: string;
  premium?: boolean;
  link: string;
}

interface HealthTip {
  icon: string;
  category: string;
  tip: string;
  color: string[];
}

// Reusable Components
const AnimatedView = ({ children, delay = 0, className = "" }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      className={className}
      style={{
        opacity: animValue,
        transform: [{
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          })
        }]
      }}
    >
      {children}
    </Animated.View>
  );
};

const GradientButton = ({ 
  colors, 
  onPress, 
  children, 
  className = "",
  textClassName = "text-white font-bold text-lg"
}: {
  colors: string[];
  onPress?: () => void;
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
}) => (
  <TouchableOpacity 
    onPress={onPress} 
    className={`rounded-3xl overflow-hidden ${className}`}
    activeOpacity={0.9}
  >
    <LinearGradient colors={colors as any} className="px-6 py-4 items-center justify-center">
      {typeof children === 'string' ? (
        <Text className={textClassName}>{children}</Text>
      ) : children}
    </LinearGradient>
  </TouchableOpacity>
);

const StatItem = ({ number, label }: { number: string; label: string }) => (
  <View className="flex-1 items-center">
    <Text className="text-xl font-extrabold text-white">{number}</Text>
    <Text className="text-xs text-white/80 font-medium mt-0.5">{label}</Text>
  </View>
);

const PremiumFeature = ({ 
  emoji, 
  title, 
  description 
}: { 
  emoji: string; 
  title: string; 
  description: string; 
}) => (
  <View className="w-[48%] bg-slate-50 rounded-2xl p-5 mb-4 items-center">
    <View className="w-15 h-15 bg-white rounded-full items-center justify-center mb-3 shadow-sm">
      <Text className="text-2xl">{emoji}</Text>
    </View>
    <Text className="text-base font-bold text-slate-800 text-center mb-1.5">{title}</Text>
    <Text className="text-sm text-slate-600 text-center leading-5">{description}</Text>
  </View>
);

const StepItem = ({ 
  number, 
  title, 
  description 
}: { 
  number: string; 
  title: string; 
  description: string; 
}) => (
  <View className="flex-row items-start mb-5">
    <View className="mr-5">
      <LinearGradient 
        colors={['#667eea', '#764ba2']} 
        className="w-11 h-11 rounded-full items-center justify-center"
      >
        <Text className="text-lg font-extrabold text-white">{number}</Text>
      </LinearGradient>
    </View>
    <View className="flex-1 pt-1">
      <Text className="text-lg font-bold text-slate-800 mb-1.5">{title}</Text>
      <Text className="text-base text-slate-600 leading-5">{description}</Text>
    </View>
  </View>
);

const FloatingElements = ({ animValue }: { animValue: Animated.Value }) => (
  <>
    <Animated.View
      className="absolute -top-6 -right-6 w-25 h-25 rounded-full bg-white/15"
      style={{
        transform: [{
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -20]
          })
        }]
      }}
    />
    <Animated.View
      className="absolute -bottom-5 -left-5 w-15 h-15 rounded-full bg-white/10"
      style={{
        transform: [{
          translateX: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 15]
          })
        }]
      }}
    />
    <Animated.View
      className="absolute top-1/2 -right-2.5 w-10 h-10 rounded-full bg-white/8"
      style={{
        transform: [{
          scale: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.1]
          })
        }]
      }}
    />
  </>
);

// Main Component
const Index: React.FC = () => {
  const [currentTip, setCurrentTip] = useState<number>(0);
  const [animatedStats, setAnimatedStats] = useState({ streak: 0, users: 0, success: 0 });
  
  const floatingAnim = useRef(new Animated.Value(0)).current;

  const healthTips: HealthTip[] = [
    {
      icon: "💧",
      category: "Hydration",
      tip: "Drink water first thing in the morning to kickstart your metabolism",
      color: ['#3B82F6', '#06B6D4', '#8B5CF6']
    },
    {
      icon: "🥗",
      category: "Nutrition", 
      tip: "Include 5 different colored vegetables for optimal nutrient absorption",
      color: ['#10B981', '#059669', '#047857']
    },
    {
      icon: "🏃‍♂️",
      category: "Fitness",
      tip: "Take 10-minute walks after meals to improve digestion and energy",
      color: ['#F59E0B', '#EF4444', '#EC4899']
    },
    {
      icon: "😴",
      category: "Sleep",
      tip: "Keep bedroom temperature 60-67°F for deeper, more restorative sleep",
      color: ['#8B5CF6', '#6366F1', '#3B82F6']
    }
  ];

  const navigationCards: FeatureCard[] = [
    {
      id: 'nutrition',
      title: 'AI Nutrition Tracker',
      subtitle: 'Smart meal logging with AI-powered insights, macro tracking, and personalized recommendations',
      icon: '🍎',
      gradient: ['#FF6B6B', '#FF8E53', '#FF6B9D'],
      badge: '🚀 AI Powered',
      stats: '2M+ foods in database',
      premium: false,
      link : "/(root)/(tabs)/tracker"
    },
    {
      id: 'medicine',
      title: 'Smart Medicine Hub', 
      subtitle: 'Never miss a dose with intelligent reminders, drug interactions, and health monitoring',
      icon: '💊',
      gradient: ['#4ECDC4', '#44A08D', '#096A2E'],
      badge: '⏰ Smart Alerts',
      stats: '99.9% reminder accuracy',
      link: "/(root)/(med-tabs)/home"
    },
    {
      id: 'meditation',
      title: 'Mindfulness Studio',
      subtitle: 'Guided meditation, breathing exercises, and stress management with expert-led sessions',
      icon: '🧘‍♀️',
      gradient: ['#667eea', '#764ba2', '#f093fb'],
      badge: '🧠 Expert Guided',
      stats: '15 min average session',
      premium: true,
      link: "/(root)/(meditation-tabs)/meditation"
    }
  ];

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Tips rotation
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % healthTips.length);
    }, 4000);

    // Animate stats
    const animateStats = () => {
      let streak = 0, users = 0, success = 0;
      const interval = setInterval(() => {
        if (streak < 7) streak++;
        if (users < 50000) users += 1250;
        if (success < 95) success += 2;

        setAnimatedStats({ streak, users, success });

        if (streak >= 7 && users >= 50000 && success >= 95) {
          clearInterval(interval);
        }
      }, 50);
    };

    setTimeout(animateStats, 1000);
    return () => clearInterval(tipInterval);
  }, []);

  const renderNavigationCard = (card: FeatureCard, index: number) => (
    <AnimatedView key={card.id} delay={index * 200} className="mb-5">
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => console.log(`Navigate to ${card.id}`)}
        className="rounded-3xl overflow-hidden shadow-lg"
      >
        <LinearGradient
          colors={card.gradient as any}
          className="p-6 min-h-[180px] relative"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FloatingElements animValue={floatingAnim} />
          
          {card.premium && (
            <View className="absolute top-4 right-4 bg-white/25 px-2.5 py-1 rounded-xl">
              <Text className="text-xs text-white font-bold">✨ PREMIUM</Text>
            </View>
          )}

          {/* Header */}
          <View className="flex-row items-start mb-4">
            <BlurView intensity={20} className="w-16 h-16 rounded-2xl items-center justify-center mr-4 overflow-hidden">
              <Text className="text-3xl">{card.icon}</Text>
            </BlurView>
            <View className="flex-1">
              <Text className="text-xl font-extrabold text-white mb-1.5">{card.title}</Text>
              <Text className="text-sm text-white/90 leading-5">{card.subtitle}</Text>
            </View>
          </View>

          {/* Footer */}
          <View className="flex-row justify-between items-center">
            <View className="bg-white/25 px-4 py-2.5 rounded-2xl">
              <Text className="text-sm text-white font-bold">{card.badge}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push(card.link as any)} className="w-12 h-12 bg-white/25 rounded-full items-center justify-center">
              <Text className="text-xl text-white font-bold">→</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </AnimatedView>
  );

  return (
    <ScrollView className="flex-1 bg-blue-50" showsVerticalScrollIndicator={false}>
      {/* Clean Header */}
      <BlurView intensity={95} className="px-5 pt-12 pb-5 rounded-b-3xl">
        <AnimatedView className="flex-row items-center justify-between">
          {/* User Info */}
          <View className="flex-1">
            <Text className="text-base text-slate-600 font-medium">Good morning,</Text>
            <Text className="text-3xl text-slate-800 font-extrabold mt-1">John Doe</Text>
            <View className="bg-red-100 px-3 py-1 rounded-2xl self-start mt-2">
              <Text className="text-xs text-red-600 font-semibold">🔥 Health Champion</Text>
            </View>
          </View>

          {/* Profile & Streak */}
          <View className="flex-row items-center gap-3">
            <LinearGradient 
              colors={['#FF6B6B', '#FF8E53']} 
              className="px-4 py-1 rounded-md items-center"
            >
              <Text className="text-white font-extrabold text-lg">{animatedStats.streak}</Text>
              <Text className="text-white/90 font-semibold text-xs">Streak</Text>
            </LinearGradient>
            
            <TouchableOpacity>
              <LinearGradient
                colors={['#4ECDC4', '#44A08D']}
                className="w-12 h-12 rounded-full items-center justify-center"
              >
                <Text className="text-white font-extrabold text-xl">J</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </AnimatedView>
      </BlurView>

      <View className="flex-1 px-5 pt-6">
        {/* Navigation Cards */}
        <View className="mb-8">
          <AnimatedView>
            <Text className="text-3xl font-extrabold text-slate-800 text-center mb-6">
              🌟 Choose Your Wellness Path
            </Text>
          </AnimatedView>
          {navigationCards.map((card, index) => renderNavigationCard(card, index))}
        </View>

        {/* Hero Section */}
        <AnimatedView delay={600} className="mb-8">
          <LinearGradient
            colors={['#667eea', '#764ba2', '#f093fb']}
            className="rounded-3xl p-6 shadow-2xl"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="items-center">
              <Text className="text-3xl font-black text-white text-center mb-2.5">
                HealthHub Premium
              </Text>
              <Text className="text-base text-white/90 text-center mb-6 leading-6">
                Transform your wellness journey with AI-powered insights and expert guidance
              </Text>

              {/* Live Stats */}
              <View className="flex-row bg-white/15 rounded-2xl p-5 mb-6 w-full">
                <StatItem number={`${animatedStats.users.toLocaleString()}+`} label="Active Users" />
                <View className="w-px bg-white/30 mx-2.5" />
                <StatItem number={`${animatedStats.success}%`} label="Success Rate" />
                <View className="w-px bg-white/30 mx-2.5" />
                <StatItem number="4.9★" label="Rating" />
              </View>

              <GradientButton 
                colors={['#FF6B6B', '#FF8E53']} 
                className="w-full shadow-lg"
              >
                <View className="flex-row items-center">
                  <Text className="text-white font-bold text-lg mr-2">Start Your Journey</Text>
                  <Text className="text-white font-bold text-lg">→</Text>
                </View>
              </GradientButton>
            </View>
          </LinearGradient>
        </AnimatedView>

        {/* Dynamic Health Tips */}
        <AnimatedView delay={800} className="mb-8">
          <Text className="text-2xl font-extrabold text-slate-800 text-center mb-5">
            💡 Daily Wellness Insights
          </Text>
          
          <LinearGradient
            colors={healthTips[currentTip].color as any}
            className="rounded-2xl p-5 h-40 justify-between shadow-lg"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-3xl">{healthTips[currentTip].icon}</Text>
              <View className="bg-white/25 px-3 py-1.5 rounded-2xl">
                <Text className="text-xs text-white font-semibold">
                  {healthTips[currentTip].category}
                </Text>
              </View>
            </View>
            
            <Text className="text-base text-white font-medium leading-5 text-center italic">
              "{healthTips[currentTip].tip}"
            </Text>

            <View className="flex-row justify-center items-center gap-2">
              {healthTips.map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full bg-white ${
                    index === currentTip ? 'opacity-100' : 'opacity-30'
                  }`}
                />
              ))}
            </View>
          </LinearGradient>
        </AnimatedView>

        {/* Premium Features */}
        <AnimatedView delay={1000} className="bg-white rounded-3xl p-6 mb-8 shadow-lg">
          <Text className="text-2xl font-extrabold text-slate-800 text-center mb-6">
            🎯 Why Choose HealthHub Premium?
          </Text>
          
          <View className="flex-row flex-wrap justify-between">
            <PremiumFeature 
              emoji="🤖" 
              title="AI Health Coach" 
              description="Personal AI assistant for 24/7 health guidance" 
            />
            <PremiumFeature 
              emoji="📊" 
              title="Advanced Analytics" 
              description="Detailed health trends and predictive insights" 
            />
            <PremiumFeature 
              emoji="👨‍⚕️" 
              title="Expert Support" 
              description="Direct access to certified health professionals" 
            />
            <PremiumFeature 
              emoji="🎯" 
              title="Smart Goals" 
              description="AI-optimized goal setting and achievement" 
            />
          </View>
        </AnimatedView>

        {/* Getting Started Guide */}
        <AnimatedView delay={1200} className="bg-white rounded-3xl p-6 mb-8 shadow-lg">
          <Text className="text-2xl font-extrabold text-slate-800 text-center mb-6">
            🚀 Your Wellness Journey in 3 Steps
          </Text>
          
          <View>
            <StepItem 
              number="1" 
              title="Choose Your Focus" 
              description="Select nutrition, medicine, or mindfulness to begin" 
            />
            <StepItem 
              number="2" 
              title="Set Smart Goals" 
              description="AI helps create achievable, personalized targets" 
            />
            <StepItem 
              number="3" 
              title="Track & Thrive" 
              description="Monitor progress with intelligent insights and celebrate wins" 
            />
          </View>
        </AnimatedView>

        {/* Bottom CTA */}
        <AnimatedView delay={1400} className="mb-8">
          <GradientButton 
            colors={['#FF6B6B', '#FF8E53', '#FF6B9D']} 
            className="shadow-2xl"
          >
            <View className="items-center py-2">
              <Text className="text-white font-extrabold text-xl mb-1">
                Unlock Premium Features
              </Text>
              <Text className="text-white/90 font-medium text-sm">
                7-day free trial • Cancel anytime
              </Text>
            </View>
          </GradientButton>
        </AnimatedView>
      </View>
    </ScrollView>
  );
};

export default Index;