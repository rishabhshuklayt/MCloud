import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  dark: '#29190e',
  deep: '#523a28',
  mid: '#a47551',
  soft: '#d0b49f',
  cream: '#e4d4c8',
};

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back'); // CameraType 'back' | 'front'
  const [photoUri, setPhotoUri] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const cameraRef = useRef(null);
  const pulse = useRef(new Animated.Value(1)).current;

  // Pulse animation
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
    ])
  ).start();

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.helpText}>We need camera permission</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Allow Camera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Capture photo using new API
  async function takePicture() {
    try {
      if (!cameraRef.current) return;
      setIsProcessing(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });

      setPhotoUri(photo.uri);
      setIsProcessing(false);

    } catch (err) {
      console.warn("Error taking photo:", err);
      setIsProcessing(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <Text style={styles.headerTitle}>Scan Document</Text>
        <Text style={styles.headerSub}>Align inside the frame</Text>

        <View style={styles.cameraWrap}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
          />

          {/* Frame Overlay */}
          <View style={styles.overlay} pointerEvents="none">
            <Animated.View style={[styles.frame, { transform: [{ scale: pulse }] }]} />
          </View>
        </View>

        {/* Camera Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
            style={styles.iconButton}
          >
            <Ionicons name="camera-reverse" size={26} color={COLORS.cream} />
          </TouchableOpacity>

          <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
            {isProcessing ? (
              <ActivityIndicator color={COLORS.deep} />
            ) : (
              <View style={styles.captureInner} />
            )}
          </TouchableOpacity>
        </View>

        {/* Preview */}
        {photoUri && (
          <View style={styles.previewRow}>
            <Image source={{ uri: photoUri }} style={styles.previewImage} />

            <View style={styles.previewActions}>
              <TouchableOpacity style={styles.smallBtn} onPress={() => setPhotoUri(null)}>
                <Text style={styles.smallBtnText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.smallBtn, { backgroundColor: COLORS.mid }]}
                onPress={() => alert('Scan saved (placeholder)')}
              >
                <Text style={[styles.smallBtnText, { color: COLORS.cream }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  container: { flex: 1, padding: 16 },

  headerTitle: { fontSize: 22, fontWeight: '700', color: COLORS.dark },
  headerSub: { color: COLORS.soft, marginBottom: 10 },

  cameraWrap: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: COLORS.deep,
  },

  camera: { width: '100%', height: '100%' },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center'
  },

  frame: {
    width: '80%',
    aspectRatio: 1.4,
    borderWidth: 3,
    borderColor: COLORS.cream,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },

  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingVertical: 14,
  },

  iconButton: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: COLORS.deep,
    alignItems: 'center',
    justifyContent: 'center',
  },

  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  captureInner: {
    width: 70,
    height: 70,
    backgroundColor: COLORS.cream,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: COLORS.mid,
  },

  previewRow: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },

  previewImage: {
    width: 120,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
  },

  previewActions: {
    flexDirection: 'row',
    gap: 12,
  },

  smallBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: COLORS.soft,
  },

  smallBtnText: {
    fontWeight: '700',
    color: COLORS.dark,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  helpText: { color: COLORS.deep, marginBottom: 10 },

  button: {
    backgroundColor: COLORS.mid,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 12,
  },

  buttonText: { color: COLORS.cream, fontWeight: '700' },
});
