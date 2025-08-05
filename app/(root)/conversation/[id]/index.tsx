import {KeyboardAvoidingView, Platform, StyleSheet, Text, View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import ChatScreen from "@/components/ChatScreen";

const Conversation = () => {
    const { id } = useLocalSearchParams();

    return (
        <KeyboardAvoidingView   style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ChatScreen conversationId={id as string} isExistingConversation={true}/>
        </KeyboardAvoidingView>
    )
};

export default Conversation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});