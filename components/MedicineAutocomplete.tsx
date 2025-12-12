import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Comprehensive medicine list for autocomplete
const COMMON_MEDICINES = [
  'Aspirin', 'Ibuprofen', 'Acetaminophen', 'Paracetamol', 'Naproxen',
  'Lisinopril', 'Metformin', 'Amlodipine', 'Omeprazole', 'Simvastatin',
  'Losartan', 'Hydrochlorothiazide', 'Atorvastatin', 'Levothyroxine', 'Albuterol',
  'Metoprolol', 'Furosemide', 'Prednisone', 'Amoxicillin', 'Azithromycin',
  'Cephalexin', 'Ciprofloxacin', 'Doxycycline', 'Clindamycin', 'Penicillin',
  'Insulin', 'Gabapentin', 'Tramadol', 'Oxycodone', 'Hydrocodone',
  'Alprazolam', 'Lorazepam', 'Clonazepam', 'Sertraline', 'Fluoxetine',
  'Escitalopram', 'Venlafaxine', 'Bupropion', 'Trazodone', 'Zolpidem',
  'Warfarin', 'Clopidogrel', 'Digoxin', 'Carvedilol', 'Spironolactone',
  'Vitamin D', 'Vitamin D3', 'Vitamin C', 'Vitamin B12', 'Multivitamin',
  'Calcium', 'Magnesium', 'Iron', 'Omega-3', 'Fish Oil', 'Probiotics' , 'DOLO 650' , 'Cetrizine', 'Levocetirizine', 'Montelukast', 'Salbutamol', 'Ranitidine',
  'Famotidine', 'Glimepiride', 'Sitagliptin', 'Pioglitazone', 'Rosiglitazone',
  'Allopurinol', 'Colchicine', 'Methotrexate', 'Hydroxychloroquine', 'Etanercept',
  
];

interface MedicineItem {
  name: string;
  type: 'medicine' | 'supplement';
}

interface MedicineAutocompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelect: (medicine: MedicineItem) => void;
  placeholder?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
}

const MedicineAutocomplete: React.FC<MedicineAutocompleteProps> = ({
  value,
  onChangeText,
  onSelect,
  placeholder = "e.g., Lisinopril, Aspirin",
  autoCapitalize = "words",
  returnKeyType = "next"
}) => {
  const [suggestions, setSuggestions] = useState<MedicineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Search local medicine list
  const searchMedicines = (term: string): MedicineItem[] => {
    const termLower = term.toLowerCase();
    return COMMON_MEDICINES
      .filter(med => med.toLowerCase().includes(termLower))
      .map(med => ({
        name: med,
        type: ['Vitamin D', 'Vitamin D3', 'Vitamin C', 'Vitamin B12', 'Multivitamin', 
               'Calcium', 'Magnesium', 'Iron', 'Omega-3', 'Fish Oil', 'Probiotics']
               .includes(med) ? 'supplement' as const : 'medicine' as const
      }))
      .slice(0, 8); // Limit to 8 suggestions
  };

  // Perform search
  const performSearch = async (term: string) => {
    if (term.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    
    // Simulate API delay for better UX
    setTimeout(() => {
      const results = searchMedicines(term);
      setSuggestions(results);
      setShowDropdown(results.length > 0);
      setLoading(false);
    }, 200);
  };

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.trim()) {
      debounceTimer.current = setTimeout(() => {
        performSearch(value.trim());
      }, 300);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
      setLoading(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value]);

  const handleSelect = (item: MedicineItem) => {
    onSelect(item);
    onChangeText(item.name);
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleInputChange = (text: string) => {
    onChangeText(text);
    if (text.length >= 2) {
      setShowDropdown(true);
    }
  };

  const renderSuggestionItem = ({ item }: { item: MedicineItem }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      className="flex-row items-center px-4 py-3 border-b border-gray-100"
      activeOpacity={0.7}
    >
      <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
        item.type === 'medicine' ? 'bg-blue-100' : 'bg-green-100'
      }`}>
        <Ionicons 
          name={item.type === 'medicine' ? 'medical' : 'leaf'} 
          size={16} 
          color={item.type === 'medicine' ? '#3B82F6' : '#10B981'} 
        />
      </View>
      <View className="flex-1">
        <Text className="text-gray-800 font-medium text-base">{item.name}</Text>
        <Text className="text-gray-500 text-xs capitalize">{item.type}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <View className="relative">
      {/* Input Field */}
      <View className="relative">
        <TextInput
          className="bg-white rounded-xl px-4 py-3 pr-12 text-gray-800 text-base border border-gray-200"
          placeholder={placeholder}
          value={value}
          onChangeText={handleInputChange}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onFocus={() => {
            if (value.length >= 2 && suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        
        {/* Search Icon or Loading Indicator */}
        <View className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <ActivityIndicator size="small" color="#6B7280" />
          ) : (
            <Ionicons name="search" size={20} color="#6B7280" />
          )}
        </View>
      </View>

      {/* Dropdown Suggestions */}
      {showDropdown && suggestions.length > 0 && (
        <View className="absolute top-full left-0 right-0 z-10 bg-white rounded-xl border border-gray-200 shadow-lg mt-1 max-h-64">
          <FlatList
            data={suggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {/* No Results Message */}
      {showDropdown && !loading && value.length >= 2 && suggestions.length === 0 && (
        <View className="absolute top-full left-0 right-0 z-10 bg-white rounded-xl border border-gray-200 shadow-lg mt-1">
          <View className="px-4 py-6 items-center">
            <Ionicons name="search" size={32} color="#D1D5DB" />
            <Text className="text-gray-500 text-sm mt-2 text-center">
              No medicines found for "{value}"
            </Text>
            <Text className="text-gray-400 text-xs mt-1 text-center">
              You can still proceed with this name
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default MedicineAutocomplete;
