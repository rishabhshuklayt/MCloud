import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Color theme (user-provided)
const COLORS = {
  dark: '#29190e', // (41,25,14)
  deep: '#523a28', // (82,58,40)
  mid: '#a47551', // (164,117,81)
  light: '#d0b49f', // (208,180,159)
  pale: '#e4d4c8', // (228,212,200)
};

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [catUri, setCatUri] = useState(null);
  const [loadingCat, setLoadingCat] = useState(true);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchQuote();
    fetchCat();
  }, []);

  async function fetchQuote() {
    try {
      setLoadingQuote(true);
      const res = await fetch('https://api.quotable.io/random');
      const json = await res.json();
      setQuote(json);
    } catch (e) {
      console.warn('Quote fetch failed', e);
      setQuote({ content: 'Be deliberate. Keep your UI minimal.', author: '—' });
    } finally {
      setLoadingQuote(false);
    }
  }

  function fetchCat() {
    // Use cataas with timestamp to avoid caching.
    setLoadingCat(true);
    const uri = `https://cataas.com/cat?width=200&height=200&ts=${Date.now()}`;
    // Test loading by assigning URI (Image will fetch). We set it directly.
    setCatUri(uri);
    // small timeout to simulate loading state while image loads
    setTimeout(() => setLoadingCat(false), 600);
  }

  function onPressLogin() {
    // playful animation and refresh cat
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.96, duration: 90, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    fetchCat();

    // Simple validation and mock login
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter email and password.');
      return;
    }
    // Mock success
    Alert.alert('Logged in', `Welcome back, ${email.split('@')[0] || email}!`);
  }

  return (
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Text style={styles.brand}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@company.com"
              placeholderTextColor={COLORS.pale}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <Text style={[styles.label, { marginTop: 18 }]}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={COLORS.pale}
              secureTextEntry
              style={styles.input}
            />

            <Animated.View style={[styles.loginWrap, { transform: [{ scale }] }]}> 
              <TouchableOpacity style={styles.loginButton} activeOpacity={0.85} onPress={onPressLogin}>
                <View style={styles.catWrap}>
                  {loadingCat ? (
                    <ActivityIndicator size="small" color={COLORS.dark} />
                  ) : (
                    <Image source={{ uri: catUri }} style={styles.cat} />
                  )}
                </View>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={() => { fetchQuote(); fetchCat(); }} style={styles.secondary}>
              <Text style={styles.secondaryText}>Refresh quote & cat</Text>
            </TouchableOpacity>
          </View>

              <View style={styles.quoteBox}>
            {loadingQuote ? (
              <ActivityIndicator color={COLORS.pale} />
            ) : (
              <>
                <Text style={styles.quote} numberOfLines={3}>{quote?.content}</Text>
                <Text style={styles.quoteAuthor}>{quote?.author ? `— ${quote.author}` : ''}</Text>
              </>
            )}
          </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.dark },
  container: { flex: 1, justifyContent: 'center', padding: 20 },
    /* Removed card to keep form ultra-minimal and open */
    brand: { color: COLORS.pale, fontSize: 28, fontWeight: '700' },
    subtitle: { color: COLORS.light, marginTop: 6, marginBottom: 18 },
    form: { marginTop: 6, paddingHorizontal: 2 },
  
  label: { color: COLORS.pale, fontSize: 12, marginBottom: 6 },
  input: {
    color: COLORS.pale,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(228,212,200,0.18)',
    fontSize: 16,
  },
  loginWrap: { marginTop: 22 },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.mid,
    paddingVertical: 12,
    borderRadius: 12,
  },
  catWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
    backgroundColor: COLORS.pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cat: { width: 36, height: 36, resizeMode: 'cover' },
  loginText: { color: COLORS.dark, fontWeight: '700', fontSize: 16 },
  secondary: { alignSelf: 'center', marginTop: 12 },
  secondaryText: { color: COLORS.light, textDecorationLine: 'underline' },
  quoteBox: { marginTop: 18, padding: 12, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.04)' },
  quote: { color: COLORS.pale, fontStyle: 'italic' },
  quoteAuthor: { color: COLORS.light, marginTop: 6, textAlign: 'right' },
});

