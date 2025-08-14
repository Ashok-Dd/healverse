import { questions } from "@/constants/data";
import { CheckupSchedule, MessageMedical } from "@/types/type";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ==================== INTERFACES ====================

// ==================== DATA ====================

// ==================== TYPING INDICATOR COMPONENT ====================
const TypingIndicator: React.FC = () => {
  const typingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(typingAnimation, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => typingAnimation.stopAnimation();
  }, []);

  return (
    <View className="items-start mb-6">
      <View className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl rounded-bl-md flex-row items-center shadow-lg border border-gray-100">
        <Text className="text-gray-500 mr-2 text-sm">Dr. Alex is typing</Text>
        <Animated.View
          className="w-2 h-2 rounded-full bg-blue-400 mx-0.5"
          style={{ opacity: typingAnimation }}
        />
        <Animated.View
          className="w-2 h-2 rounded-full bg-blue-400 mx-0.5"
          style={{
            opacity: typingAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          }}
        />
        <Animated.View
          className="w-2 h-2 rounded-full bg-blue-400 mx-0.5"
          style={{
            opacity: typingAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.3],
            }),
          }}
        />
      </View>
    </View>
  );
};

// ==================== MESSAGE BUBBLE COMPONENT ====================
const MessageBubble: React.FC<{ message: MessageMedical }> = ({ message }) => {
  const slideAnimation = useRef(new Animated.Value(-50)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isBot = message.isBot;

  return (
    <Animated.View
      className={`mb-6 ${isBot ? "items-start" : "items-end"}`}
      style={{
        opacity: opacityAnimation,
        transform: [{ translateX: slideAnimation }],
      }}
    >
      {isBot && (
        <View className="flex-row items-center mb-2">
          <View className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full items-center justify-center mr-2">
            <Text className="text-white text-xs font-bold">AI</Text>
          </View>
          <Text className="text-gray-500 text-xs font-medium">Dr. Alex</Text>
        </View>
      )}
      <View
        className={`max-w-[85%] p-4 ${
          isBot
            ? "bg-white/95 backdrop-blur-sm rounded-2xl rounded-bl-md shadow-lg border border-gray-100"
            : "bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl rounded-br-md shadow-lg"
        }`}
      >
        <Text
          className={`text-base leading-6 ${
            isBot ? "text-gray-800" : "text-white"
          }`}
        >
          {message.text}
        </Text>
      </View>
      {!isBot && (
        <Text className="text-gray-400 text-xs mt-1 mr-2">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      )}
    </Animated.View>
  );
};

// ==================== CALENDAR COMPONENT ====================
const CalendarComponent: React.FC<{
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}> = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = [];
  const today = new Date();

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(<View key={`empty-${i}`} className="w-10 h-10 m-1" />);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = selectedDay === day;
    const currentDayDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const isToday = today.toDateString() === currentDayDate.toDateString();
    const isPast = currentDayDate < today && !isToday;
    const isWeekend =
      currentDayDate.getDay() === 0 || currentDayDate.getDay() === 6;

    days.push(
      <TouchableOpacity
        key={day}
        disabled={isPast}
        className={`w-10 h-10 m-1 rounded-xl justify-center items-center ${
          isSelected
            ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg transform scale-110"
            : isToday
            ? "border-2 border-blue-500 bg-blue-50"
            : isPast
            ? "bg-gray-100"
            : isWeekend
            ? "bg-orange-50 border border-orange-200"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
        onPress={() => {
          if (!isPast) {
            setSelectedDay(day);
            const dateString = `${
              monthNames[currentDate.getMonth()]
            } ${day}, ${currentDate.getFullYear()}`;
            onDateSelect(dateString);
          }
        }}
      >
        <Text
          className={`text-sm font-medium ${
            isSelected
              ? "text-white font-bold"
              : isToday
              ? "text-blue-600 font-bold"
              : isPast
              ? "text-gray-400"
              : isWeekend
              ? "text-orange-600"
              : "text-gray-800"
          }`}
        >
          {day}
        </Text>
      </TouchableOpacity>
    );
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
    setSelectedDay(null);
  };

  return (
    <View className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100">
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity
          onPress={() => navigateMonth("prev")}
          className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-12 h-12 justify-center items-center shadow-md"
        >
          <Text className="text-xl text-gray-600 font-bold">‹</Text>
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-xl font-bold text-gray-800">
            {monthNames[currentDate.getMonth()]}
          </Text>
          <Text className="text-lg font-semibold text-gray-600">
            {currentDate.getFullYear()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigateMonth("next")}
          className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-12 h-12 justify-center items-center shadow-md"
        >
          <Text className="text-xl text-gray-600 font-bold">›</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-around mb-4 py-3 border-b border-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <Text
            key={day}
            className={`text-xs font-bold w-10 text-center ${
              index === 0 || index === 6 ? "text-orange-500" : "text-gray-500"
            }`}
          >
            {day}
          </Text>
        ))}
      </View>

      <View className="flex-row flex-wrap justify-center">{days}</View>

      <View className="mt-4 p-3 bg-blue-50 rounded-xl">
        <Text className="text-xs text-blue-600 text-center">
          💡 Weekends are highlighted in orange. Past dates are disabled.
        </Text>
      </View>
    </View>
  );
};

// ==================== TIME SELECTOR COMPONENT ====================
const TimeSelector: React.FC<{
  onTimeSelect: (time: string) => void;
  selectedTime?: string;
}> = ({ onTimeSelect, selectedTime }) => {
  const timeSlots = [
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
  ];

  return (
    <View className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100">
      <View className="items-center mb-6">
        <View className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full items-center justify-center mb-3">
          <Text className="text-2xl">⏰</Text>
        </View>
        <Text className="text-xl font-bold text-gray-800 mb-1">
          Select Appointment Time
        </Text>
        <Text className="text-sm text-gray-600">
          Choose your preferred time slot
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-center">
        {timeSlots.map((time, index) => (
          <TouchableOpacity
            key={index}
            className={`m-1 px-4 py-3 rounded-2xl border-2 shadow-sm ${
              selectedTime === time
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-500 transform scale-105 shadow-lg"
                : "bg-white border-gray-200 hover:border-blue-300"
            }`}
            onPress={() => onTimeSelect(time)}
          >
            <Text
              className={`text-sm font-semibold ${
                selectedTime === time ? "text-white" : "text-gray-700"
              }`}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="mt-6 p-3 bg-green-50 rounded-xl">
        <Text className="text-xs text-green-600 text-center">
          🏥 All appointments are 30-minute slots. Early morning slots
          recommended for fasting tests.
        </Text>
      </View>
    </View>
  );
};

// ==================== APPOINTMENT SUMMARY COMPONENT ====================
const AppointmentSummary: React.FC<{
  scheduleData: CheckupSchedule;
  onCreate: () => void;
}> = ({ scheduleData, onCreate }) => {
  const summaryItems = [
    {
      icon: "🏥",
      label: "Checkup Type",
      value: scheduleData.checkupType,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: "📅",
      label: "Date",
      value: scheduleData.selectedDate,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: "⏰",
      label: "Time",
      value: scheduleData.selectedTime,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: "🔔",
      label: "Reminder",
      value: scheduleData.reminderTime,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <View className="mt-8">
      <View className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-6 border border-green-100 shadow-xl">
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full items-center justify-center mb-4 shadow-lg">
            <Text className="text-3xl">🎉</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Appointment Summary
          </Text>
          <Text className="text-gray-600 text-center text-base">
            Review your scheduled appointment details
          </Text>
        </View>

        <View className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50 mb-6">
          <View className="space-y-4">
            {summaryItems.map((item, index) => (
              <View key={index} className="flex-row items-center">
                <View
                  className={`w-12 h-12 ${item.bgColor} rounded-full items-center justify-center mr-4 shadow-sm`}
                >
                  <Text className={`text-xl ${item.iconColor}`}>
                    {item.icon}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-500 font-medium mb-1">
                    {item.label}
                  </Text>
                  <Text className="text-base font-semibold text-gray-800">
                    {item.value}
                  </Text>
                </View>
              </View>
            ))}

            {scheduleData.notes && (
              <View className="flex-row items-start pt-2 border-t border-gray-200">
                <View className="w-12 h-12 bg-yellow-100 rounded-full items-center justify-center mr-4 shadow-sm">
                  <Text className="text-xl text-yellow-600">📝</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-500 font-medium mb-1">
                    Special Notes
                  </Text>
                  <Text className="text-base text-gray-800 leading-5">
                    {scheduleData.notes}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          className="bg-gradient-to-r from-green-500 to-blue-600 p-5 rounded-2xl shadow-xl active:scale-95"
          onPress={onCreate}
        >
          <View className="flex-row items-center justify-center">
            <Text className="text-white text-lg font-bold mr-2">
              Create Appointment
            </Text>
            <Text className="text-xl">✨</Text>
          </View>
        </TouchableOpacity>

        <View className="mt-4 p-3 bg-blue-50 rounded-xl">
          <Text className="text-xs text-blue-600 text-center">
            📱 You'll receive SMS and email confirmations after creation
          </Text>
        </View>
      </View>
    </View>
  );
};

// ==================== MAIN COMPONENT ====================
const MedicalChatForm: React.FC = () => {
  const [messages, setMessages] = useState<MessageMedical[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scheduleData, setScheduleData] = useState<CheckupSchedule>({
    checkupType: "",
    selectedDate: "",
    selectedTime: "",
    reminderTime: "",
    notes: "",
  });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [tempSelection, setTempSelection] = useState<string>("");

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      askQuestion(0);
    }, 1000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, [messages]);

  const askQuestion = (questionIndex: number) => {
    if (questionIndex >= questions.length) {
      completeForm();
      return;
    }

    const question = questions[questionIndex];
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          text: question.botMessage,
          isBot: true,
          timestamp: new Date(),
          type: question.type,
        },
      ]);
      setIsTyping(false);
      setShowCalendar(question.type === "calendar");
      setShowTimeSelector(question.type === "time");
      setShowTextInput(
        question.type === "textarea" || question.type === "input"
      );
    }, 1800);
  };

  const handleResponse = (response: string) => {
    const currentQuestion = questions[currentQuestionIndex];

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        text: response || "No additional notes",
        isBot: false,
        timestamp: new Date(),
      },
    ]);

    setScheduleData((prev) => ({
      ...prev,
      [currentQuestion.id]: response,
    }));

    setShowCalendar(false);
    setShowTimeSelector(false);
    setShowTextInput(false);
    setTempSelection("");
    setInputValue("");

    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1);
      askQuestion(currentQuestionIndex + 1);
    }, 1000);
  };

  const confirmSelection = () => {
    if (tempSelection) {
      handleResponse(tempSelection);
    } else {
      Alert.alert(
        "Selection Required",
        "Please choose an option to continue.",
        [{ text: "OK", style: "default" }]
      );
    }
  };

  const handleTextSubmit = () => {
    handleResponse(inputValue.trim());
  };

  const skipOptionalQuestion = () => {
    handleResponse("");
  };

  const completeForm = () => {
    setIsCompleted(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `summary-${Date.now()}`,
          text: "Perfect! 🎉 Let me prepare your comprehensive appointment summary. Everything looks great!",
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const createAppointment = () => {
    Alert.alert(
      "Appointment Created Successfully! ✅",
      `Your ${scheduleData.checkupType} has been scheduled for ${scheduleData.selectedDate} at ${scheduleData.selectedTime}.\n\n🔔 You will receive a reminder ${scheduleData.reminderTime}.\n\n📧 Confirmation details have been sent to your email.`,
      [
        {
          text: "View Calendar",
          style: "default",
          onPress: () => console.log("Open calendar view"),
        },
        {
          text: "Done",
          style: "default",
          onPress: () => {
            console.log("Appointment Data:", scheduleData);
            // Reset form or navigate away
          },
        },
      ]
    );
  };

  const renderCurrentQuestionOptions = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion || currentQuestion.type !== "options") return null;

    return (
      <View className="mt-6 space-y-3">
        {currentQuestion.options?.map((option: string, index: number) => (
          <TouchableOpacity
            key={index}
            className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border-2 border-gray-100 shadow-lg active:bg-gray-50 active:scale-95"
            onPress={() => handleResponse(option)}
          >
            <Text className="text-blue-600 text-base text-center font-semibold">
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 pt-12 pb-6 shadow-2xl">
        <View className="px-6">
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center mr-4 shadow-lg">
              <Text className="text-2xl">🩺</Text>
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white">
                HealthCare AI
              </Text>
              <Text className="text-blue-100 text-sm font-medium">
                Smart Medical Scheduling
              </Text>
            </View>
          </View>
          <Text className="text-blue-100 text-base leading-5">
            Let's schedule your health appointment with our intelligent
            assistant
          </Text>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}
        {!isCompleted && !isTyping && renderCurrentQuestionOptions()}

        {/* Calendar */}
        {showCalendar && (
          <View className="mt-6">
            <CalendarComponent
              onDateSelect={setTempSelection}
              selectedDate={tempSelection}
            />
            <TouchableOpacity
              className={`p-4 rounded-2xl mt-6 shadow-xl ${
                tempSelection
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 active:from-blue-600 active:to-indigo-700"
                  : "bg-gray-300"
              }`}
              onPress={confirmSelection}
              disabled={!tempSelection}
            >
              <Text
                className={`text-lg font-bold text-center ${
                  tempSelection ? "text-white" : "text-gray-500"
                }`}
              >
                {tempSelection ? `Confirm ${tempSelection}` : "Select a Date"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Time Selector */}
        {showTimeSelector && (
          <View className="mt-6">
            <TimeSelector
              onTimeSelect={setTempSelection}
              selectedTime={tempSelection}
            />
            <TouchableOpacity
              className={`p-4 rounded-2xl mt-6 shadow-xl ${
                tempSelection
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 active:from-purple-600 active:to-pink-700"
                  : "bg-gray-300"
              }`}
              onPress={confirmSelection}
              disabled={!tempSelection}
            >
              <Text
                className={`text-lg font-bold text-center ${
                  tempSelection ? "text-white" : "text-gray-500"
                }`}
              >
                {tempSelection ? `Confirm ${tempSelection}` : "Select a Time"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Text Input */}
        {showTextInput && (
          <View className="mt-6 bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100">
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Additional Notes
              </Text>
              <Text className="text-sm text-gray-600">
                Share any relevant information about your appointment
              </Text>
            </View>

            <TextInput
              className="border border-gray-200 rounded-2xl p-4 text-base text-gray-800 min-h-[120px] bg-white shadow-sm"
              placeholder={
                questions[currentQuestionIndex]?.placeholder ||
                "Enter your notes here..."
              }
              placeholderTextColor="#9CA3AF"
              value={inputValue}
              onChangeText={setInputValue}
              multiline
              textAlignVertical="top"
            />

            <View className="flex-row mt-6 space-x-4">
              <TouchableOpacity
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg active:scale-95"
                onPress={handleTextSubmit}
              >
                <Text className="text-white text-base font-bold text-center">
                  Continue
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-8 bg-gray-200 p-4 rounded-2xl shadow-lg active:scale-95"
                onPress={skipOptionalQuestion}
              >
                <Text className="text-gray-600 text-base font-semibold text-center">
                  Skip
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Appointment Summary */}
        {isCompleted && (
          <AppointmentSummary
            scheduleData={scheduleData}
            onCreate={createAppointment}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default MedicalChatForm;
