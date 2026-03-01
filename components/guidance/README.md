# 📖 App Guidance System - Integration Guide

This comprehensive guidance system allows you to show helpful information to users throughout your app with long-form content, proper formatting, and beautiful UI.

## 🚀 Quick Setup

### 1. Add the Provider to Your App

```tsx
// In your main app file (e.g., _layout.tsx or App.tsx)
import AppGuidanceProvider from '@/components/providers/AppGuidanceProvider';

export default function RootLayout() {
  return (
    <AppGuidanceProvider>
      {/* Your existing app content */}
      <YourAppContent />
    </AppGuidanceProvider>
  );
}
```

### 2. Use in Any Component

```tsx
import { useAppGuidance } from '@/hooks/useAppGuidance';
import GuidanceButton from '@/components/ui/GuidanceButton';

export default function MyComponent() {
  const { showGuidance, showFeatureTip } = useAppGuidance();

  // Method 1: Use predefined content
  const showHelp = () => {
    showFeatureTip(
      "Feature Name",
      `# Long form content here
      
      You can use markdown-like formatting:
      • Bullet points
      • **Bold text**
      • Multiple paragraphs
      
      ## Subheadings
      More content here...`
    );
  };

  // Method 2: Use guidance button with predefined content
  return (
    <View>
      <GuidanceButton
        guidanceKey="TRACKER_OVERVIEW" // Uses predefined content
        variant="icon-only"
      />
      
      <GuidanceButton
        title="Custom Help"
        content="Your custom guidance content here..."
        variant="primary"
        buttonText="Help"
      />
    </View>
  );
}
```

## 🎨 Modal Features

### Content Formatting
- **Paragraphs**: Separated by double line breaks
- **Headings**: Start lines with `#` or `##`
- **Bullet Points**: Start lines with `•` or `-`
- **Styling**: Automatic color coding and spacing

### Modal Types
- `'info'` - General information (gray theme)
- `'tip'` - Helpful tips (blue theme)
- `'warning'` - Important warnings (orange theme)
- `'feature'` - New features (green theme)

### Button Variants
- `'primary'` - Blue button with white text
- `'secondary'` - Gray button with dark text
- `'icon-only'` - Circular help icon button

## 📋 Available Guidance Content

The system comes with predefined guidance for:

- `TRACKER_OVERVIEW` - Main dashboard help
- `FOOD_LOGGING` - Camera and food recognition
- `AI_INSIGHTS` - Understanding AI recommendations
- `NUTRITION_TRACKING` - Charts and progress
- `MEDICATION_MANAGEMENT` - Medication features
- `EXERCISE_TRACKING` - Workout logging
- `GAMIFICATION_SYSTEM` - Points and achievements
- `GETTING_STARTED` - Complete app overview

## 🎯 Hook Methods

### `useAppGuidance()`
```tsx
const {
  showGuidance,      // Generic method with full customization
  showFeatureTip,    // Blue tip modal
  showAppHelp,       // Gray info modal  
  showWarning,       // Orange warning modal
  showOnboarding     // Green feature modal
} = useAppGuidance();
```

### `useGuidanceModal()` (Advanced)
Direct access to the store for advanced use cases:
```tsx
const {
  visible,           // Current modal state
  title,             // Current modal title
  content,           // Current modal content
  hideGuidance       // Close modal function
} = useGuidanceModal();
```

## 💡 Best Practices

### Content Writing
- **Start with clear headings** using `#` markers
- **Use bullet points** for lists and key features  
- **Keep paragraphs short** for mobile reading
- **Include actionable tips** users can immediately apply

### When to Show Guidance
- **First time features** - Show onboarding guidance
- **Complex features** - Add help buttons near difficult UI
- **User confusion** - Proactive help for common issues
- **Feature updates** - Announce new capabilities

### Integration Tips
- Add help buttons to page headers for overview guidance
- Include contextual help near complex form fields
- Use different modal types to indicate content importance
- Show onboarding guidance automatically for new users

## 🔧 Customization

### Adding New Guidance Content
```tsx
// In constants/appGuidance.ts
export const APP_GUIDANCE = {
  // ... existing content
  YOUR_NEW_GUIDE: {
    title: "🎯 Your Feature Name",
    content: `# Your Long Form Content
    
    Multiple paragraphs with detailed explanations...
    
    ## Subheadings for organization
    • Bullet points for key features
    • Step-by-step instructions
    • Tips and best practices`,
    type: 'feature'
  }
};
```

### Custom Styling
The modal automatically adapts to your app's theme. Modify the modal component for custom colors or styling.

## 📱 Responsive Design
- Modal height adapts to content length (max 85% screen height)
- Scrollable content area for long guidance text
- Touch-friendly close buttons and actions
- Safe area handling for different device sizes

## 🚀 Advanced Usage

### Programmatic Control
```tsx
// Show guidance based on user actions
useEffect(() => {
  if (isFirstTimeUser) {
    showOnboarding("Welcome!", welcomeContent);
  }
}, [isFirstTimeUser]);

// Show contextual help based on current screen
useEffect(() => {
  if (currentScreen === 'tracker') {
    // Show tracker-specific guidance
  }
}, [currentScreen]);
```

### Dynamic Content
```tsx
// Generate guidance content dynamically
const showPersonalizedHelp = () => {
  const content = generateHelpContent(userProfile, currentFeature);
  showGuidance({
    title: "Personalized Help",
    content,
    type: 'tip'
  });
};
```

This system provides a comprehensive way to guide users through your app with rich, formatted content and beautiful presentation! 🎉
