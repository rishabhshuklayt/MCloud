import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useMemo, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    Modal,
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

const initialFolders = [
  { id: 'f1', name: 'GOVIDs' },
  { id: 'f2', name: 'Educations' },
  { id: 'f3', name: 'WorkDocs' },
  { id: 'f4', name: 'Recent Folder' },
];

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function getIconForName(name) {
  const ext = (name || '').split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image-outline';
  if (['pdf'].includes(ext)) return 'document-text-outline';
  if (['mp4', 'mov', 'mkv'].includes(ext)) return 'play-circle-outline';
  if (['doc', 'docx'].includes(ext)) return 'document-outline';
  if (['ppt', 'pptx'].includes(ext)) return 'code-slash-outline';
  return 'document-outline';
}

export default function UploadScreen() {
  const [folders, setFolders] = useState(initialFolders);
  const [selectedFolder, setSelectedFolder] = useState(folders[0].id);
  const [modalOpen, setModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [pickedFile, setPickedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
      if (res.type === 'success') {
        setPickedFile(res);
      }
    } catch (e) {
      console.warn('document pick error', e);
    }
  };

  const startUpload = () => {
    if (!pickedFile) return;
    setUploading(true);
    progress.setValue(0);
    // Simulate upload progress
    let pct = 0;
    const id = setInterval(() => {
      pct += Math.random() * 12 + 6; // progress random
      if (pct >= 100) pct = 100;
      Animated.timing(progress, { toValue: pct, duration: 300, useNativeDriver: false }).start();
      if (pct >= 100) {
        clearInterval(id);
        setTimeout(() => {
          // finalize
          const fileObj = {
            id: Date.now().toString(),
            name: pickedFile.name || 'file',
            size: pickedFile.size || 0,
            folderId: selectedFolder,
            icon: getIconForName(pickedFile.name),
            uploadedAt: new Date().toISOString(),
          };
          setUploadedFiles((u) => [fileObj, ...u]);
          setPickedFile(null);
          setUploading(false);
        }, 500);
      }
    }, 500);
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const id = Date.now().toString();
    const f = { id, name: newFolderName.trim() };
    setFolders((s) => [f, ...s]);
    setSelectedFolder(id);
    setNewFolderName('');
    setModalOpen(false);
  };

  const folderList = useMemo(() => folders, [folders]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Upload File</Text>
          <Text style={styles.sub}>Select file and destination</Text>
        </View>

        <View style={styles.pickerRow}>
          <TouchableOpacity style={styles.pickBtn} onPress={pickFile} disabled={uploading}>
            <Ionicons name="cloud-upload-outline" size={18} color={COLORS.dark} />
            <Text style={styles.pickTxt}>{pickedFile ? 'Change file' : 'Choose file'}</Text>
          </TouchableOpacity>

          <View style={styles.folderSelect}>
            <TouchableOpacity style={styles.dropdownSelect} onPress={() => setDropdownOpen((s) => !s)}>
              <Ionicons name="folder" size={16} color={COLORS.dark} />
              <Text style={styles.dropdownText}>{folders.find(f => f.id === selectedFolder)?.name ?? 'Select folder'}</Text>
              <Ionicons name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.dark} style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            {dropdownOpen && (
              <View style={styles.dropdownBox}>
                {folderList.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.dropdownItem} onPress={() => { setSelectedFolder(item.id); setDropdownOpen(false); }}>
                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                    {selectedFolder === item.id && <Ionicons name="checkmark" size={16} color={COLORS.mid} />}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={[styles.dropdownItem, { borderTopWidth: 1, borderTopColor: 'rgba(41,25,14,0.04)' }]} onPress={() => { setModalOpen(true); setDropdownOpen(false); }}>
                  <Ionicons name="add" size={16} color={COLORS.dark} />
                  <Text style={[styles.dropdownItemText, { marginLeft: 8 }]}>Create new folder</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.fileInfo}>
          {pickedFile ? (
            <>
              <View style={styles.fileLeft}>
                <View style={styles.fileIconWrap}><Ionicons name={getIconForName(pickedFile.name)} size={20} color={COLORS.mid} /></View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.fileName}>{pickedFile.name}</Text>
                  <Text style={styles.fileMeta}>{formatBytes(pickedFile.size)}</Text>
                </View>
              </View>

              <View style={styles.uploadActions}>
                <TouchableOpacity style={[styles.uploadBtn, !pickedFile || uploading ? { opacity: 0.6 } : null]} onPress={startUpload} disabled={!pickedFile || uploading}>
                  <Text style={styles.uploadTxt}>{uploading ? 'Uploading...' : 'Upload'}</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.hint}>No file chosen yet. Tap "Choose file" to pick a file from your device.</Text>
          )}
        </View>

        {uploading ? (
          <View style={styles.progressWrap}>
            <Animated.View style={[styles.progressBar, { width: progress.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
            <Text style={styles.progressTxt}>{Math.round(progress.__getValue ? progress.__getValue() : 0)}%</Text>
          </View>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Uploaded</Text>
        </View>

        <FlatList data={uploadedFiles} keyExtractor={(i) => i.id} renderItem={({ item }) => (
          <View style={styles.uploadedRow}>
            <View style={styles.fileLeft}>
              <View style={styles.fileIconWrap}><Ionicons name={item.icon} size={20} color={COLORS.mid} /></View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.fileName}>{item.name}</Text>
                <Text style={styles.fileMeta}>Saved to {folders.find(f=>f.id===item.folderId)?.name || '—'} • {new Date(item.uploadedAt).toLocaleString()}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.actionBtn}><Ionicons name="ellipsis-vertical" size={18} color={COLORS.soft} /></TouchableOpacity>
          </View>
        )} ItemSeparatorComponent={() => <View style={{ height: 10 }} />} contentContainerStyle={{ paddingVertical: 12 }} />

        {/* Create folder modal */}
        <Modal visible={modalOpen} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Create new folder</Text>
              <TextInput placeholder="Folder name" value={newFolderName} onChangeText={setNewFolderName} placeholderTextColor={COLORS.soft} style={styles.modalInput} />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                <TouchableOpacity style={[styles.modalBtn, { marginRight: 8 }]} onPress={() => { setModalOpen(false); setNewFolderName(''); }}>
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: COLORS.mid }]} onPress={createFolder}>
                  <Text style={[styles.modalBtnText, { color: COLORS.cream }]}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  container: { flex: 1, padding: 16 },
  headerRow: { marginBottom: 6 },
  title: { color: COLORS.dark, fontSize: 22, fontWeight: '700' },
  sub: { color: COLORS.soft, marginTop: 6 },

  pickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  pickBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.soft, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12 },
  pickTxt: { marginLeft: 8, color: COLORS.dark, fontWeight: '600' },

  folderSelect: { flex: 1, marginLeft: 12, flexDirection: 'row', alignItems: 'center', position: 'relative' },
  dropdownSelect: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(41,25,14,0.03)', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, flex: 1 },
  dropdownText: { marginLeft: 8, color: COLORS.dark, fontWeight: '600', flex: 1 },
  dropdownBox: { position: 'absolute', top: 54, left: 0, right: 0, backgroundColor: COLORS.cream, borderRadius: 12, paddingVertical: 8, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 6, zIndex: 50 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
  dropdownItemText: { color: COLORS.dark, marginLeft: 8, fontWeight: '600' },

  fileInfo: { marginTop: 16, padding: 14, backgroundColor: 'rgba(228,212,200,0.03)', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fileLeft: { flexDirection: 'row', alignItems: 'center' },
  fileIconWrap: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  fileName: { color: COLORS.deep, fontWeight: '700' },
  fileMeta: { color: COLORS.soft, marginTop: 6 },
  uploadActions: {},
  uploadBtn: { backgroundColor: COLORS.mid, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  uploadTxt: { color: COLORS.cream, fontWeight: '700' },
  hint: { color: COLORS.soft },

  progressWrap: { marginTop: 12, height: 18, backgroundColor: 'rgba(41,25,14,0.06)', borderRadius: 10, overflow: 'hidden', justifyContent: 'center' },
  progressBar: { height: '100%', backgroundColor: COLORS.mid },
  progressTxt: { position: 'absolute', alignSelf: 'center', color: COLORS.cream, fontWeight: '700' },

  sectionHeader: { marginTop: 18, marginBottom: 8 },
  sectionTitle: { color: COLORS.dark, fontWeight: '700' },

  uploadedRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(228,212,200,0.04)', padding: 12, borderRadius: 12 },
  actionBtn: { padding: 6 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { width: '88%', backgroundColor: COLORS.cream, padding: 16, borderRadius: 16 },
  modalTitle: { color: COLORS.dark, fontWeight: '700', fontSize: 16 },
  modalInput: { marginTop: 12, paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 12 : 8, backgroundColor: 'rgba(208,180,159,0.08)', borderRadius: 12, color: COLORS.dark },
  modalBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  modalBtnText: { color: COLORS.dark, fontWeight: '700' },
});
