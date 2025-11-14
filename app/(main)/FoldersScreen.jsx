import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const COLORS = {
	dark: '#29190e', // Dark Brown
	deep: '#523a28', // Deep Brown
	mid: '#a47551', // Light Brown
	soft: '#d0b49f', // Soft Beige
	cream: '#e4d4c8', // Light Cream
};

const initialFolders = [
	{ id: '1', name: 'GOVIDs', createdAt: '2025-11-01T10:24:00Z', synced: true },
	{ id: '2', name: 'Educations', createdAt: '2025-10-21T08:12:00Z', synced: true },
	{ id: '3', name: 'WorkDocs', createdAt: '2025-09-30T14:00:00Z', synced: false },
	{ id: '4', name: 'Recent Folder', createdAt: '2025-11-10T09:45:00Z', synced: true },
	{ id: '5', name: 'Personal', createdAt: '2025-08-02T16:30:00Z', synced: false },
];

function formatDate(iso) {
	try {
		const d = new Date(iso);
		return d.toLocaleDateString();
	} catch (e) {
		return iso;
	}
}

export default function FoldersScreen() {
	const [folders, setFolders] = useState(initialFolders);
	const [query, setQuery] = useState('');

	function onFolderAction(folder) {
		Alert.alert(folder.name, 'Choose action', [
			{ text: 'Rename', onPress: () => renameFolder(folder) },
			{ text: folder.synced ? 'Unsync' : 'Sync', onPress: () => toggleSync(folder.id) },
			{ text: 'Delete', style: 'destructive', onPress: () => deleteFolder(folder.id) },
			{ text: 'Cancel', style: 'cancel' },
		]);
	}

	function renameFolder(folder) {
		Alert.prompt(
			'Rename folder',
			'Enter a new name',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'OK',
					onPress: (text) => {
						if (!text) return;
						setFolders((f) => f.map((it) => (it.id === folder.id ? { ...it, name: text } : it)));
					},
				},
			],
			'plain-text',
			folder.name
		);
	}

	function toggleSync(id) {
		setFolders((f) => f.map((it) => (it.id === id ? { ...it, synced: !it.synced } : it)));
	}

	function deleteFolder(id) {
		Alert.alert('Delete folder', 'Are you sure you want to delete this folder?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', style: 'destructive', onPress: () => setFolders((f) => f.filter((it) => it.id !== id)) },
		]);
	}

	function createFolder() {
		Alert.prompt('New folder', 'Enter folder name', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Create', onPress: (text) => {
				if (!text) return;
				const id = Date.now().toString();
				setFolders((f) => [{ id, name: text, createdAt: new Date().toISOString(), synced: false }, ...f]);
			} },
		]);
	}

	const filtered = folders.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

	function renderItem({ item }) {
		return (
			<View style={styles.folderCard}>
				<View style={styles.left}>
					<View style={styles.folderIconWrap}>
						<Ionicons name="folder" size={20} color={COLORS.mid} />
					</View>
					<View style={styles.meta}>
						<Text style={styles.folderName}>{item.name}</Text>
						<Text style={styles.folderMeta}>Created {formatDate(item.createdAt)}</Text>
					</View>
				</View>

				<View style={styles.right}>
					<View style={styles.syncWrap}>
						<Ionicons name={item.synced ? 'cloud-done' : 'cloud-offline'} size={18} color={item.synced ? '#2ecc71' : COLORS.soft} />
					</View>
					<TouchableOpacity onPress={() => onFolderAction(item)} style={styles.actionBtn}>
						<Ionicons name="ellipsis-vertical" size={18} color={COLORS.soft} />
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<View style={styles.headerRow}>
					<Text style={styles.title}>Folders</Text>
					<TouchableOpacity style={styles.createBtn} onPress={createFolder}>
						<Ionicons name="add" size={18} color={COLORS.cream} />
						<Text style={styles.createTxt}>New</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.searchRow}>
					<Ionicons name="search" size={18} color={COLORS.deep} style={{ marginRight: 8 }} />
					<TextInput
						placeholder="Search folders..."
						placeholderTextColor={COLORS.soft}
						style={styles.searchInput}
						value={query}
						onChangeText={setQuery}
					/>
				</View>

				<FlatList
					data={filtered}
					keyExtractor={(i) => i.id}
					renderItem={renderItem}
					ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
					contentContainerStyle={{ paddingVertical: 12, paddingBottom: 120 }}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: COLORS.cream },
	container: { flex: 1, padding: 16 },
	headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
	title: { color: COLORS.dark, fontSize: 22, fontWeight: '700' },
	createBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.mid, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
	createTxt: { color: COLORS.cream, marginLeft: 8, fontWeight: '700' },

	searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.soft, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, marginBottom: 12 },
	searchInput: { flex: 1, color: COLORS.dark },

	folderCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(228,212,200,0.06)', padding: 12, borderRadius: 14 },
	left: { flexDirection: 'row', alignItems: 'center' },
	folderIconWrap: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
	meta: { maxWidth: '70%' },
	folderName: { color: COLORS.deep, fontWeight: '700', fontSize: 16 },
	folderMeta: { color: COLORS.soft, marginTop: 6, fontSize: 12 },

	right: { flexDirection: 'row', alignItems: 'center' },
	syncWrap: { marginRight: 12 },
	actionBtn: { padding: 6 },
});

