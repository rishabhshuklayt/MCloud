import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
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

const sampleFiles = [
  { id: 'f1', name: 'Vacation-photo.jpg', type: 'image', sizeKB: 2345, modifiedAt: '2025-11-12T10:00:00Z' },
  { id: 'f2', name: 'Invoice-0423.pdf', type: 'pdf', sizeKB: 145, modifiedAt: '2025-11-10T14:30:00Z' },
  { id: 'f3', name: 'Promo_clip.mp4', type: 'video', sizeKB: 12450, modifiedAt: '2025-11-08T09:20:00Z' },
  { id: 'f4', name: 'Project-plan.docx', type: 'doc', sizeKB: 98, modifiedAt: '2025-11-01T12:00:00Z' },
  { id: 'f5', name: 'Notes.txt', type: 'txt', sizeKB: 12, modifiedAt: '2025-10-21T08:12:00Z' },
  { id: 'f6', name: 'Presentation.pptx', type: 'ppt', sizeKB: 5600, modifiedAt: '2025-11-02T16:30:00Z' },
];

export default function FileListScreen({ route }) {
  // route.params.folderName can be used when wired to navigation
  const folderName = route?.params?.folderName ?? 'My Folder';

  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [sortBy, setSortBy] = useState('modifiedAt');
  const [ascending, setAscending] = useState(false);

  const files = useMemo(() => sampleFiles, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = files.filter((f) => f.name.toLowerCase().includes(q));
    out.sort((a, b) => {
      if (sortBy === 'name') {
        return ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortBy === 'size') {
        return ascending ? a.sizeKB - b.sizeKB : b.sizeKB - a.sizeKB;
      }
      // modifiedAt
      return ascending ? new Date(a.modifiedAt) - new Date(b.modifiedAt) : new Date(b.modifiedAt) - new Date(a.modifiedAt);
    });
    return out;
  }, [files, query, sortBy, ascending]);

  function formatSize(kb) {
    if (kb >= 1024) return (kb / 1024).toFixed(1) + ' MB';
    return kb + ' KB';
  }

  function onItemAction(item) {
    Alert.alert(item.name, 'Actions', [
      { text: 'Share', onPress: () => Alert.alert('Share', 'Mock share: ' + item.name) },
      { text: 'Move', onPress: () => Alert.alert('Move', 'Mock move: ' + item.name) },
      { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Deleted', item.name) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  function renderListItem({ item }) {
    return (
      <View style={styles.fileRow}>
        <View style={styles.fileLeft}>
          <View style={styles.iconWrap}>{renderIcon(item.type)}</View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.fileMeta}>{new Date(item.modifiedAt).toLocaleString()} • {formatSize(item.sizeKB)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => onItemAction(item)} style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={18} color={COLORS.soft} />
        </TouchableOpacity>
      </View>
    );
  }

  function renderGridItem({ item }) {
    return (
      <View style={styles.gridCard}>
        <View style={styles.gridIcon}>{renderIcon(item.type)}</View>
        <Text style={styles.gridName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.gridMeta}>{formatSize(item.sizeKB)}</Text>
        <TouchableOpacity style={styles.gridAction} onPress={() => onItemAction(item)}>
          <Ionicons name="ellipsis-vertical" size={16} color={COLORS.soft} />
        </TouchableOpacity>
      </View>
    );
  }

  function renderIcon(type) {
    switch (type) {
      case 'image': return <Ionicons name="image-outline" size={22} color={COLORS.mid} />;
      case 'pdf': return <Ionicons name="document-text-outline" size={22} color={COLORS.mid} />;
      case 'video': return <Ionicons name="play-circle-outline" size={22} color={COLORS.mid} />;
      case 'doc': return <Ionicons name="document-outline" size={22} color={COLORS.mid} />;
      default: return <Ionicons name="document-outline" size={22} color={COLORS.mid} />;
    }
  }

  function openSortMenu() {
    Alert.alert('Sort by', null, [
      { text: 'Name', onPress: () => setSortBy('name') },
      { text: 'Date', onPress: () => setSortBy('modifiedAt') },
      { text: 'Size', onPress: () => setSortBy('size') },
      { text: ascending ? 'Descending' : 'Ascending', onPress: () => setAscending(!ascending) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  const numColumns = viewMode === 'grid' ? 2 : 1;
  const { width } = Dimensions.get('window');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.folderTitle}>{folderName}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} style={styles.iconBtn}>
              <Ionicons name={viewMode === 'list' ? 'grid-outline' : 'list-outline'} size={18} color={COLORS.dark} />
            </TouchableOpacity>
            <TouchableOpacity onPress={openSortMenu} style={[styles.iconBtn, { marginLeft: 8 }]}> 
              <Ionicons name="funnel-outline" size={18} color={COLORS.dark} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchSlim}>
          <Ionicons name="search" size={16} color={COLORS.deep} style={{ marginRight: 8 }} />
          <TextInput placeholder="Search files..." value={query} onChangeText={setQuery} placeholderTextColor={COLORS.deep} style={styles.searchInputSlim} />
          {query.length > 0 ? (
            <TouchableOpacity onPress={() => setQuery('')} style={{ padding: 6 }}>
              <Ionicons name="close" size={16} color={COLORS.soft} />
            </TouchableOpacity>
          ) : null}
        </View>

        {viewMode === 'list' ? (
          <FlatList data={filtered} keyExtractor={(i) => i.id} renderItem={renderListItem} ItemSeparatorComponent={() => <View style={{ height: 10 }} />} contentContainerStyle={{ paddingVertical: 12, paddingBottom: 120 }} />
        ) : (
          <FlatList data={filtered} keyExtractor={(i) => i.id} renderItem={renderGridItem} numColumns={numColumns} columnWrapperStyle={{ justifyContent: 'space-between' }} contentContainerStyle={{ paddingVertical: 12, paddingBottom: 120 }} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  folderTitle: { color: COLORS.dark, fontSize: 20, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { backgroundColor: COLORS.soft, padding: 8, borderRadius: 12 },

  searchSlim: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(208,180,159,0.18)', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, marginBottom: 12 },
  searchInputSlim: { flex: 1, color: COLORS.dark, fontSize: 14 },

  // list
  fileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(228,212,200,0.04)', padding: 12, borderRadius: 12 },
  fileLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconWrap: { width: 46, height: 46, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  fileName: { color: COLORS.deep, fontWeight: '600' },
  fileMeta: { color: COLORS.soft, marginTop: 6, fontSize: 12 },
  moreBtn: { paddingLeft: 12 },

  // grid
  gridCard: { backgroundColor: 'rgba(228,212,200,0.04)', borderRadius: 14, padding: 12, width: (Dimensions.get('window').width - 48) / 2, marginBottom: 12, position: 'relative' },
  gridIcon: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  gridName: { color: COLORS.deep, marginTop: 8, fontWeight: '600' },
  gridMeta: { color: COLORS.soft, marginTop: 6, fontSize: 12 },
  gridAction: { position: 'absolute', top: 8, right: 8 },
});
