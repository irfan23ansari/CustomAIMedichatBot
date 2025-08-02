import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Images } from './src/Assets/Images';

const DoctorChat = () => {

  // OpenRouter API key for authentication
  const OPENROUTER_API_KEY = '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';

  // State to manage chat messages, input text, loading state, and medical keywords
  const [messages, setMessages] = useState([
    {
      role: 'Doctor',
      content: `You are a Doctor and you know everything about the human body symptoms the
                medicine and a caring and intelligent health assistant.You will only answer 
                clear and valid medical questions.If the user tricky, vague, double meaning 
                language, puzzle or any medical or nonmedical joke , do not attempt to guess. Instead, respond:"Please ask your medical question 
                more clearly. I am trained only for health and medical topics."
                You should not answer personal, adult, technical, entertainment, or service-related topics. 
                only respond to medical queries.only provide medical information.Your job is to provide:
                - talk like a real doctor,
                - Always respond on  in short, conversational, natural language like a doctor would,
                If a user mentions symptoms (e.g., fever, headache, stomach pain, dizziness), ask smart follow-up questions.
                Give diagnose or prescribe. Always add: "Please consult a healthcare provider for serious issues.`,
    },
    {
      role: 'assistant',
      content: 'Hello! I am MediBot. What is your name?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [medicalKeywords, setMedicalKeywords] = useState([
    'fever',
    'cold',
    'cough',
    'pain',
    'headache',
    'stomach',
    'health',
    'symptom',
    'treatment',
    'infection',
    'diagnosis',
    'doctor',
    'hospital',
    'clinic',
    'illness',
    'emergency',
    'checkup',
    'appointment',
    'prescription',
    'bp',
    'blood pressure',
    'heart rate',
    'oxygen level',
    'body temperature',
    'injury',
    'wound',
    'swelling',
    'burn',
    'fracture',
    'bruise',
    'cut',
    'scratch',
    'bleeding',
    'vomit',
    'nausea',
    'fatigue',
    'dizzy',
    'fainting',
    'chills',
    'sweating',
    'dehydration',
    'immunity',
    'hydration',
    'sore throat',
    'difficulty breathing',
    'shortness of breath',
    'earache',
    'eye pain',
    'blurred vision',
    'joint pain',
    'muscle ache',

    // Vital systems & organs
    'heart',
    'lungs',
    'liver',
    'kidney',
    'brain',
    'spine',
    'nervous system',
    'respiratory system',
    'digestive system',
    'urinary system',
    'reproductive system',
    'circulatory system',

    // Diseases and conditions
    'diabetes',
    'cancer',
    'tumor',
    'hypertension',
    'cholesterol',
    'asthma',
    'pneumonia',
    'arthritis',
    'bronchitis',
    'eczema',
    'dermatitis',
    'anemia',
    'stroke',
    'epilepsy',
    'paralysis',
    'migraine',
    'insomnia',
    'covid',
    'flu',
    'tuberculosis',
    'hepatitis',
    'dengue',
    'malaria',
    'chickenpox',
    'measles',
    'mumps',
    'typhoid',
    'ulcer',
    'gastritis',
    'constipation',
    'diarrhea',
    'acidity',
    'obesity',
    'overweight',
    'underweight',
    'depression',
    'anxiety',
    'mental illness',
    'bipolar disorder',
    'OCD',
    'PTSD',
    'autism',
    'ADHD',
    'dementia',
    'alzheimer',
    'insulin resistance',
    'thyroid',
    'hypothyroidism',
    'hyperthyroidism',
    'pcos',
    'pcod',

    // Medications and treatments
    'medicine',
    'tablet',
    'pill',
    'syrup',
    'dose',
    'injection',
    'vaccination',
    'vaccine',
    'therapy',
    'physiotherapy',
    'radiation',
    'chemotherapy',
    'surgery',
    'operation',
    'bandage',
    'plaster',
    'ointment',
    'antibiotic',
    'antiviral',
    'painkiller',
    'analgesic',
    'sedative',
    'anesthetic',
    'antacid',
    'antidepressant',

    // Medical diagnostics
    'x-ray',
    'mri',
    'ct scan',
    'ultrasound',
    'ecg',
    'ekg',
    'blood test',
    'urine test',
    'biopsy',
    'screening',
    'monitoring',
    'imaging',
    'lab test',
    'scan',
    'checkup',
    'physical exam',
    'pathology',
    'lab report',

    // Lifestyle and wellness
    'diet',
    'nutrition',
    'weight loss',
    'weight gain',
    'obesity',
    'exercise',
    'yoga',
    'meditation',
    'stress',
    'relaxation',
    'wellbeing',
    'fitness',
    'hydration',
    'vitamins',
    'supplement',
    'protein',
    'calories',
    'cholesterol',
    'carbohydrate',
    'sugar',
    'fiber',
    'healthy food',
    'junk food',
    'balanced diet',

    // Pregnancy and reproductive health
    'pregnancy',
    'pregnant',
    'labour pain',
    'contractions',
    'delivery',
    'baby',
    'fertility',
    'infertility',
    'contraception',
    'birth control',
    'abortion',
    'menstruation',
    'period',
    'cycle',
    'ovulation',
    'ivf',
    'gynecologist',
    'obstetrician',
    'midwife',
    'ultrasound',
    'prenatal',
    'postnatal',
    'breastfeeding',

    // Pediatrics
    'child health',
    'baby health',
    'pediatrician',
    'vaccination',
    'baby fever',
    'infant cough',
    'child rash',

    // Geriatrics / elderly health
    'elder care',
    'geriatric',
    'arthritis',
    'bone density',
    'osteoporosis',
    'mobility',
    'joint pain',
    'hearing loss',
    'cataract',
    'blood thinner',
    'urinary incontinence',
    'dementia',
    'memory loss',

    // Mental health and counseling
    'mental health',
    'stress',
    'anxiety',
    'depression',
    'counseling',
    'therapy',
    'psychiatrist',
    'psychologist',
    'psychotherapy',
    'mental illness',
    'panic attack',
    'emotional distress',
  ]);


  // Function to handle sending messages
  // This function checks if the input is a medical keyword and adds it to the list if not already present.
  // It then sends the message to the bot and updates the chat.
  // If the input is a medical keyword, it sends the input directly.
  // If the input is not a medical keyword, it sends the input as a regular message
  // and adds the keyword to the medical keywords list.
  // It also handles the loading state while waiting for the bot's response.
  // The function also ensures that the input field is cleared after sending the message.
  // The messages state is updated with the new user message and the bot's reply.
  // The function also scrolls to the end of the chat list after sending a message.
  // It uses the OpenRouter API to send the messages and get the bot's reply.
  // The API key is stored in the OPENROUTER_API_KEY constant
  const handleSend = async () => {
    if (!input.trim()) return;
    const keyword = input.trim().toLowerCase();
    if (keyword && !medicalKeywords.includes(keyword)) {
      setMedicalKeywords(prev => [...prev, keyword]);
      setInput(''); // Clear input after adding
    }
    const userMessage = {
      role: 'user',
      content: medicalKeywords.includes(keyword) ? input : `${input}`,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    const botReply = await sendMessageToBot(newMessages);
    setMessages([...newMessages, { role: 'assistant', content: botReply }]);
    setLoading(false);
  };
  // Function to send messages to the bot using the OpenRouter API
  // It handles the response and returns the bot's reply or an error message.
  // If there is an error, it logs the error and returns a generic error message.
  // The function uses the fetch API to make the POST request to the OpenRouter API endpoint
  // and expects a JSON response containing the bot's reply.
  // The API key is included in the Authorization header for authentication.
  // The function also includes a referer and title in the headers for additional context.
  // The model used for the chat completion is 'meta-llama/llama-3-70b-instruct'.
  // The messages are sent in the body of the request as a JSON string.
  // The function returns the content of the first choice in the response or a default error message
  // if the response does not contain a valid reply.
  // If the response is not successful, it logs the error and returns a generic error message
  // to the user.
  // The function is used to handle the chat interactions with the bot in the DoctorChat component
  // and is called when the user sends a message.
  // The function is used to send the user's messages to the bot and receive the bot's reply.
  // It is an essential part of the chat functionality in the DoctorChat component.
  // The function is called when the user presses the send button in the chat input.
  const sendMessageToBot = async messages => {
    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://yourapp.com',
            'X-Title': 'MediBot',
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3-70b-instruct',
            messages,
          }),
        },
      );

      const data = await response.json();
      return (
        data.choices?.[0]?.message?.content ||
        "Sorry, I couldn't understand that."
      );
    } catch (error) {
      console.error('Error:', error);
      return 'There was an error. Please try again.';
    }
  };

  // Function to render each chat message in the FlatList
  // It styles the message bubble based on the role of the message (user or assistant).
  // The user messages are aligned to the right with a green background,
  // while the assistant messages are aligned to the left with a blue background.
  // The message text is displayed in white color for better readability.
  // The function is used in the FlatList to render each item in the chat.
  // It takes an item from the data array and returns a styled View component
  // containing the message text.
  // The styles are applied conditionally based on the role of the message.
  // The function is used to display the chat messages in the DoctorChat component.
  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.messageBubble,
        item.role === 'user' ? styles.user : styles.assistant,
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  // useEffect hook to scroll to the end of the chat list when messages change
  // This ensures that the latest messages are always visible to the user.
  // It uses the flatListRef to access the FlatList component and calls scrollToEnd
  // with animated set to true for a smooth scrolling effect.
  // The useEffect hook is triggered whenever the messages state changes,
  // ensuring that the chat view updates correctly as new messages are added.
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Render the main chat interface
  // It includes a KeyboardAvoidingView to handle keyboard appearance on iOS,
  // a TouchableOpacity for the back button, a FlatList to display chat messages,
  // and a TextInput for user input.
  // The FlatList uses the renderItem function to display each message,
  // and the input field allows users to type their messages.
  // The send button triggers the handleSend function to process the input and send it to the bot.
  // The loading state is displayed as a text message when the bot is processing the input

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >

      <FlatList
        showsVerticalScrollIndicator={false}
        ref={flatListRef}
        data={messages.slice(1)}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.chatList}
      />

      {loading && <Text style={styles.typing}>MediBot is thinking...</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask your health question..."
          placeholderTextColor="#aaa"
          value={input}
          onChangeText={setInput}
        // multiline
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default DoctorChat;

// Styles for the DoctorChat component
// The styles are defined using StyleSheet.create for better performance.
// The styles include container, chat list, input container, input field, send button,
// message bubble, user and assistant styles, message text, and typing indicator.
// Each style is defined with appropriate properties to achieve the desired layout and appearance.

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101010' },
  chatList: { padding: 10, paddingBottom: 70, paddingTop: 25 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#2c2c2c',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 10,
    borderRadius: 20,
  },
  sendText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  messageBubble: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 14,
    maxWidth: '80%',
  },
  user: { alignSelf: 'flex-end', backgroundColor: '#4CAF50' },
  assistant: { alignSelf: 'flex-start', backgroundColor: '#303F9F' },
  messageText: { fontSize: 16, color: '#fff' },
  typing: { textAlign: 'center', color: '#aaa', marginBottom: 8, bottom: 60 },
});
