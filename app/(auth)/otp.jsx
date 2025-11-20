import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    AccessibilityInfo,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';

export default function OTPScreen({ navigation }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [resending, setResending] = useState(false);
  const [info, setInfo] = useState('We sent a 6‑digit code to +1 ••• ••• •123');

  useEffect(() => {
    // start countdown
    setSecondsLeft(30);
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [resending]);

  useEffect(() => {
    // announce for accessibility when resend becomes available
    if (secondsLeft === 0) {
      AccessibilityInfo.announceForAccessibility('You can resend the code now');
    }
  }, [secondsLeft]);

  function focusInput(idx) {
    const ref = inputs.current[idx];
    if (ref && ref.focus) ref.focus();
  }

  function handleChange(text, idx) {
    // only digits
    const digit = text.replace(/\D/g, '');
    if (!digit) return setSingle('', idx);
    // if user pasted whole code (multi-digit)
    if (digit.length > 1) {
      const arr = digit.split('').slice(0, 6);
      const next = [...code];
      for (let i = 0; i < arr.length; i++) next[i] = arr[i];
      setCode(next);
      const nextIndex = Math.min(5, arr.length - 1);
      focusInput(nextIndex + 1 <= 5 ? nextIndex + 1 : nextIndex);
      return;
    }
    setSingle(digit, idx);
    if (digit && idx < 5) focusInput(idx + 1);
  }

  function setSingle(val, idx) {
    setCode((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  }

  function handleKeyPress({ nativeEvent }, idx) {
    if (nativeEvent.key === 'Backspace' && !code[idx] && idx > 0) {
      focusInput(idx - 1);
      setSingle('', idx - 1);
    }
  }

  async function pasteFromClipboard() {
    try {
      const txt = await Clipboard.getStringAsync();
      if (!txt) return Alert.alert('Clipboard empty');
      const digits = txt.replace(/\D/g, '');
      if (digits.length >= 6) {
        const arr = digits.slice(0, 6).split('');
        setCode(arr);
        focusInput(5);
      } else {
        Alert.alert('No valid code found in clipboard');
      }
    } catch (err) {
      console.warn('Clipboard error', err);
      Alert.alert('Paste failed');
    }
  }

  function onResend() {
    if (secondsLeft > 0) return;
    setResending(true);
    setInfo('Resending code…');
    // simulate network
    setTimeout(() => {
      setResending(false);
      setInfo('A new code was sent to +1 ••• ••• •123');
      setSecondsLeft(30);
    }, 1200);
  }

  function onVerify() {
    const joined = code.join('');
    if (joined.length < 6) return Alert.alert('Enter the 6-digit code');
    // mock verify
    if (joined === '123456') {
      Alert.alert('Verified', 'OTP verified (demo).', [{ text: 'Continue', onPress: () => router.replace('home') }]);
    } else {
      Alert.alert('Invalid code', 'The code you entered is incorrect.');
    }
  }

  const isComplete = code.every((c) => c !== '');

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={22} color={COLORS.pale} />
          </TouchableOpacity>
          <Text style={styles.title}>Enter code</Text>
        </View>

        <Text style={styles.subtitle}>{info}</Text>

        <View style={styles.otpRow} accessible accessibilityLabel="OTP input">
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              value={digit}
              onChangeText={(t) => handleChange(t, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="number-pad"
              returnKeyType="next"
              maxLength={1}
              style={styles.otpCell}
              textContentType="oneTimeCode"
              placeholder={"•"}
              placeholderTextColor={COLORS.soft}
              selectionColor={COLORS.mid}
              accessible
              accessibilityLabel={`Digit ${i + 1}`}
            />
          ))}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={pasteFromClipboard} style={styles.actionBtn} accessibilityLabel="Paste code from clipboard">
            <Ionicons name="clipboard" size={18} color={COLORS.light} />
            <Text style={styles.actionTxt}>Paste code</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.timerTxt}>{secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'No code yet?'}</Text>
            <TouchableOpacity onPress={onResend} disabled={secondsLeft > 0 || resending} style={[styles.resendBtn, secondsLeft > 0 ? { opacity: 0.5 } : null]}>
              <Text style={styles.resendTxt}>{resending ? 'Sending…' : 'Resend'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity accessible accessibilityRole="button" style={[styles.verifyBtn, !isComplete ? { opacity: 0.6 } : null]} onPress={onVerify} disabled={!isComplete}>
          <Text style={styles.verifyTxt}>Verify</Text>
        </TouchableOpacity>

        <View style={styles.noteRow}>
          <Text style={styles.note}>Didn’t receive it? Check spam or try again.</Text>
          <TouchableOpacity onPress={() => router.replace('auth/register')}>
            <Text style={styles.changeLink}>Change number</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.dark },
  container: { flex: 1, padding: 20, justifyContent: 'flex-start' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  backBtn: { padding: 6, marginRight: 6 },
  title: { color: COLORS.pale, fontSize: 22, fontWeight: '700' },
  subtitle: { color: COLORS.light, marginTop: 14, marginBottom: 22, lineHeight: 20 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 8, marginBottom: 18 },
  otpCell: {
    width: 48,
    height: 62,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(228,212,200,0.08)',
    textAlign: 'center',
    fontSize: 24,
    color: COLORS.pale,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  actionTxt: { color: COLORS.light, marginLeft: 8 },
  timerTxt: { color: COLORS.soft, marginRight: 10 },
  resendBtn: { paddingVertical: 6, paddingHorizontal: 8 },
  resendTxt: { color: COLORS.mid, fontWeight: '700' },
  verifyBtn: { marginTop: 8, backgroundColor: COLORS.mid, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  verifyTxt: { color: COLORS.dark, fontWeight: '800' },
  noteRow: { marginTop: 16, alignItems: 'center' },
  note: { color: COLORS.soft, marginBottom: 8 },
  changeLink: { color: COLORS.pale, fontWeight: '700' },
});
