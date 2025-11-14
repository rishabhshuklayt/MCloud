import { Fontisto, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    Dimensions,
    FlatList,
    Platform,
    // SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  dark: '#29190e', // Dark Brown
  deep: '#523a28', // Deep Brown
  mid: '#a47551', // Light Brown
  soft: '#d0b49f', // Soft Beige
  cream: '#e4d4c8', // Light Cream
};

const sampleFiles = [
  { id: '1', type: 'image', name: 'Vacation-photo.jpg', time: '2 hours ago' },
  { id: '2', type: 'pdf', name: 'Invoice-0423.pdf', time: 'Yesterday' },
  { id: '3', type: 'video', name: 'Promo_clip.mp4', time: '2 days ago' },
  { id: '4', type: 'doc', name: 'Project-plan.docx', time: 'Mar 3' },
];

const sampleFolders = [
  { id: 'f1', name: 'GOVIDs', icon: 'folder' },
  { id: 'f2', name: 'Educations', icon: 'folder' },
  { id: 'f3', name: 'WorkDocs', icon: 'folder' },
  { id: 'f4', name: 'Recent Folder', icon: 'folder' },
  { id: 'f5', name: 'See All', icon: 'layers' },
];

export default function DashboardScreen() {
  const renderFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <Ionicons name="image-outline" size={22} color={COLORS.deep} />;
      case 'pdf':
        return <Ionicons name="document-text-outline" size={22} color={COLORS.deep} />;
      case 'video':
        return <Ionicons name="play-circle-outline" size={22} color={COLORS.deep} />;
      default:
        return <Ionicons name="document-outline" size={22} color={COLORS.deep} />;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>Hello Rishabh <Text style={styles.wave}>👋</Text></Text>
          <Text style={styles.title}>Your Cloud Files</Text>
        </View>
        <View style={{flexDirection:'row', gap: 20}}>
            <Fontisto name="circle-o-notch" color="#000" size={24} /> 
            <TouchableOpacity onPress={()=>router.push('/ScannerScreen')}>       
          <Ionicons name="scan-sharp" color="#000" size={24} />
          </TouchableOpacity>
        </View>
        </View>
        {/* SEARCH */}
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color={COLORS.dark} style={styles.searchIcon} />
          <TextInput
            placeholder="Search files..."
            placeholderTextColor={COLORS.dark}
            style={styles.searchInput}
            accessible
            accessibilityLabel="Search files"
          />
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard}
          onPress={()=>router.push('/UploadScreen')} activeOpacity={0.8}>
            <View style={styles.actionInner}>
              <Ionicons name="cloud-upload-outline" size={20} color={COLORS.cream} />
              <Text style={styles.actionText}>Upload File</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
            <View style={styles.actionInner}>
              <Ionicons name="camera-outline" size={20} color={COLORS.cream} />
              <Text style={styles.actionText}>Capture Photo</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* FOLDERS (horizontal) */}
        <View style={styles.foldersHeader}>
          <Text style={styles.sectionTitle}>Folders</Text>
        </View>
        <FlatList
          data={sampleFolders}
          keyExtractor={(i) => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.foldersList}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.folderCard} activeOpacity={0.85} onPress={()=>router.push('/FileListScreen')}>
              <Ionicons name={item.icon === 'layers' ? 'layers-outline' : 'folder-outline'} size={20} color={COLORS.dark} />
              <Text style={styles.folderText} numberOfLines={1}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        {/* RECENT FILES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Files</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={sampleFiles}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.fileCard}>
              <View style={styles.fileLeft}>
                <View style={styles.iconWrap}>{renderFileIcon(item.type)}</View>
                <View style={styles.fileMeta}>
                  <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.fileTime}>{item.time}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.moreButton} >
                <Ionicons name="ellipsis-vertical" size={18} color={COLORS.soft} />
              </TouchableOpacity>
            </View>
          )}
        />

        {/* BOTTOM NAV */}
        <View style={styles.bottomNavWrap}>
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="home" size={22} color={COLORS.cream} />
              <Text style={[styles.navText, { color: COLORS.cream }]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItemCenter}>
              <View style={styles.plusWrap}>
                <Ionicons name="add" size={28} color={COLORS.deep} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <Ionicons name="settings-outline" size={22} color={COLORS.soft} />
              <Text style={[styles.navText, { color: COLORS.soft }]}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  container: { flex: 1, padding: 16 },

  headerRow: { marginTop: 2, marginBottom: 8 },
  greeting: { color: COLORS.dark, fontSize: 14 },
  wave: { fontSize: 14 },
  title: { color: COLORS.dark, fontSize: 28, fontWeight: '700', marginTop: 4 },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.soft,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: COLORS.dark, fontSize: 15 },

  // Actions
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  actionCard: {
    backgroundColor: COLORS.mid,
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  actionText: { color: COLORS.cream, marginLeft: 10, fontWeight: '600' },

  // Recent files
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  sectionTitle: { color: COLORS.dark, fontSize: 16, fontWeight: '700' },
  viewAll: { color: COLORS.soft, fontSize: 13 },

  // Folders
  foldersHeader: { marginTop: 14, marginBottom: 8 },
  foldersList: { paddingVertical: 6, paddingRight: 12 },
  folderCard: {
    backgroundColor: COLORS.soft,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 110,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  folderText: { color: COLORS.dark, marginTop: 8, fontWeight: '600' },

  list: { paddingTop: 10, paddingBottom: 90 },
  fileCard: {
    backgroundColor: 'rgba(228,212,200,0.06)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  fileLeft: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileMeta: { maxWidth: width - 200 },
  fileName: { color: COLORS.deep, fontWeight: '600' },
  fileTime: { color: COLORS.soft, marginTop: 4, fontSize: 12 },
  moreButton: { padding: 6 },

  // Bottom nav
  bottomNavWrap: { position: 'absolute', left: 0, right: 0, bottom: 12, alignItems: 'center' },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.deep,
    width: width - 36,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 6,
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { marginTop: 4, fontSize: 12 },
  navItemCenter: { alignItems: 'center', justifyContent: 'center' },
  plusWrap: {
    backgroundColor: COLORS.cream,
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
});
