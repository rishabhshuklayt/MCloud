import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
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

const COLORS = {
  dark: '#29190e',
  deep: '#523a28',
  mid: '#a47551',
  soft: '#d0b49f',
  cream: '#e4d4c8',
};

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!firstName.trim()) e.firstName = 'Enter first name';
    if (!lastName.trim()) e.lastName = 'Enter last name';

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) e.email = 'Enter email';
    else if (!emailRe.test(email)) e.email = 'Invalid email';

    const phoneRe = /^[+]?\d{7,15}$/; // simple international-ish
    if (!phone.trim()) e.phone = 'Enter phone number';
    else if (!phoneRe.test(phone.replace(/\s+/g, ''))) e.phone = 'Invalid phone';

    if (!password) e.password = 'Enter password';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';

    if (!confirm) e.confirm = 'Confirm password';
    else if (confirm !== password) e.confirm = 'Passwords do not match';

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit() {
    if (!validate()) return;
    // Mock register
    Alert.alert('Registered', `Welcome ${firstName} — registration successful (mock).`, [
      { text: 'OK', onPress: () => navigation?.navigate?.('Home') },
    ]);
  }

  const isValid = () => {
    return (
      firstName.trim() &&
      lastName.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      /^[+]?\d{7,15}$/.test(phone.replace(/\s+/g, '')) &&
      password.length >= 8 &&
      password === confirm
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.brand}>Create account</Text>
        <Text style={styles.subtitle}>Create your M Cloud account</Text>

        <View style={styles.form}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            value={firstName}
            onChangeText={(t) => { setFirstName(t); setErrors((s) => ({ ...s, firstName: undefined })); }}
            placeholder="First name"
            placeholderTextColor={COLORS.soft}
            style={styles.input}
            returnKeyType="next"
          />
          {errors.firstName ? <Text style={styles.error}>{errors.firstName}</Text> : null}

          <Text style={[styles.label, { marginTop: 12 }]}>Last name</Text>
          <TextInput
            value={lastName}
            onChangeText={(t) => { setLastName(t); setErrors((s) => ({ ...s, lastName: undefined })); }}
            placeholder="Last name"
            placeholderTextColor={COLORS.soft}
            style={styles.input}
            returnKeyType="next"
          />
          {errors.lastName ? <Text style={styles.error}>{errors.lastName}</Text> : null}

          <Text style={[styles.label, { marginTop: 12 }]}>Email</Text>
          <TextInput
            value={email}
            onChangeText={(t) => { setEmail(t); setErrors((s) => ({ ...s, email: undefined })); }}
            placeholder="you@example.com"
            placeholderTextColor={COLORS.soft}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            returnKeyType="next"
          />
          {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

          <Text style={[styles.label, { marginTop: 12 }]}>Phone number</Text>
          <TextInput
            value={phone}
            onChangeText={(t) => { setPhone(t); setErrors((s) => ({ ...s, phone: undefined })); }}
            placeholder="e.g. +1234567890"
            placeholderTextColor={COLORS.soft}
            keyboardType="phone-pad"
            style={styles.input}
            returnKeyType="next"
          />
          {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}

          <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              value={password}
              onChangeText={(t) => { setPassword(t); setErrors((s) => ({ ...s, password: undefined })); }}
              placeholder="Create password"
              placeholderTextColor={COLORS.soft}
              secureTextEntry={!showPassword}
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword((s) => !s)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color={COLORS.soft} />
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

          <Text style={[styles.label, { marginTop: 12 }]}>Confirm password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              value={confirm}
              onChangeText={(t) => { setConfirm(t); setErrors((s) => ({ ...s, confirm: undefined })); }}
              placeholder="Confirm password"
              placeholderTextColor={COLORS.soft}
              secureTextEntry={!showConfirm}
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm((s) => !s)}>
              <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={18} color={COLORS.soft} />
            </TouchableOpacity>
          </View>
          {errors.confirm ? <Text style={styles.error}>{errors.confirm}</Text> : null}

          <TouchableOpacity style={[styles.registerBtn, !isValid() ? { opacity: 0.6 } : null]} onPress={onSubmit} disabled={!isValid()}>
            <Text style={styles.registerTxt}>Create account</Text>
          </TouchableOpacity>

          <View style={styles.rowCenter}>
            <Text style={styles.small}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation?.goBack?.()}>
              <Text style={styles.link}> Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  brand: { color: COLORS.dark, fontSize: 28, fontWeight: '700' },
  subtitle: { color: COLORS.soft, marginTop: 6, marginBottom: 16 },
  form: { backgroundColor: 'transparent' },
  label: { color: COLORS.dark, fontSize: 12, marginBottom: 6 },
  input: { color: COLORS.dark, paddingVertical: 10, borderBottomWidth: 1, borderColor: 'rgba(228,212,200,0.18)', fontSize: 16 },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { padding: 8, marginLeft: 8 },
  registerBtn: { marginTop: 20, backgroundColor: COLORS.mid, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  registerTxt: { color: COLORS.cream, fontWeight: '700' },
  small: { color: COLORS.soft, marginTop: 12 },
  link: { color: COLORS.deep, fontWeight: '700', marginTop: 12 },
  rowCenter: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  error: { color: '#ff6b6b', marginTop: 6, fontSize: 12 },
});
