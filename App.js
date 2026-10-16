import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView, 
  TextInput 
} from 'react-native';
import { Audio, ResizeMode, Video } from 'expo-av';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ==========================================
// 1. CALCULATOR SCREEN COMPONENT
// ==========================================
function CalculatorScreen({ navigation }) {
  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState('');

  const handleTapNumber = (num) => {
    if (displayValue === '0' || displayValue === 'Error') {
      setDisplayValue(num.toString());
    } else {
      setDisplayValue(displayValue + num);
    }
  };

  const handleTapOperator = (operator) => {
    setExpression(displayValue + ' ' + operator + ' ');
    setDisplayValue('0');
  };

  const handleClear = () => {
    setDisplayValue('0');
    setExpression('');
  };

  const handleEquals = () => {
    // Secret Passcode Code 1234
    if (displayValue === '1234') {
      setDisplayValue('0');
      setExpression('');
      navigation.navigate('Vault');
      return;
    }

    const fullEquation = expression + displayValue;
    try {
      const formattedEquation = fullEquation.replace(/×/g, '*').replace(/÷/g, '/');
      const result = eval(formattedEquation);
      setDisplayValue(String(result));
      setExpression('');
    } catch (e) {
      setDisplayValue('Error');
      setExpression('');
    }
  };

  const renderButton = (label, onPress, styleType = 'number') => {
    let buttonStyle = calcStyles.btnNumber;
    let textStyle = calcStyles.btnTextNumber;

    if (styleType === 'operator') {
      buttonStyle = calcStyles.btnOperator;
      textStyle = calcStyles.btnTextOperator;
    } else if (styleType === 'action') {
      buttonStyle = calcStyles.btnAction;
      textStyle = calcStyles.btnTextAction;
    }

    return (
      <TouchableOpacity style={[calcStyles.button, buttonStyle]} onPress={onPress}>
        <Text style={textStyle}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={calcStyles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Futuristic Header */}
      <View style={calcStyles.topHeader}>
        <Text style={calcStyles.brandTitle}>K I O' S // CALCU v.code.1234</Text>
      </View>

      {/* Futuristic Display */}
      <View style={calcStyles.displayContainer}>
        <Text style={calcStyles.expressionText}>{expression}</Text>
        <Text style={calcStyles.displayText} numberOfLines={1}>{displayValue}</Text>
      </View>

      {/* Keypad */}
      <View style={calcStyles.keypad}>
        <View style={calcStyles.row}>
          {renderButton('C', handleClear, 'action')}
          {renderButton('+/-', () => setDisplayValue(String(parseFloat(displayValue) * -1)), 'action')}
          {renderButton('%', () => setDisplayValue(String(parseFloat(displayValue) / 100)), 'action')}
          {renderButton('÷', () => handleTapOperator('÷'), 'operator')}
        </View>

        <View style={calcStyles.row}>
          {renderButton('7', () => handleTapNumber(7))}
          {renderButton('8', () => handleTapNumber(8))}
          {renderButton('9', () => handleTapNumber(9))}
          {renderButton('×', () => handleTapOperator('×'), 'operator')}
        </View>

        <View style={calcStyles.row}>
          {renderButton('4', () => handleTapNumber(4))}
          {renderButton('5', () => handleTapNumber(5))}
          {renderButton('6', () => handleTapNumber(6))}
          {renderButton('-', () => handleTapOperator('-'), 'operator')}
        </View>

        <View style={calcStyles.row}>
          {renderButton('1', () => handleTapNumber(1))}
          {renderButton('2', () => handleTapNumber(2))}
          {renderButton('3', () => handleTapNumber(3))}
          {renderButton('+', () => handleTapOperator('+'), 'operator')}
        </View>

        <View style={calcStyles.row}>
          <TouchableOpacity style={[calcStyles.button, calcStyles.btnNumber, calcStyles.zeroButton]} onPress={() => handleTapNumber(0)}>
            <Text style={calcStyles.btnTextNumber}>0</Text>
          </TouchableOpacity>
          {renderButton('.', () => handleTapNumber('.'))}
          {renderButton('=', handleEquals, 'operator')}
        </View>
      </View>
    </SafeAreaView>
  );
}

// ==========================================
// 2. VAULT SCREEN COMPONENT
// ==========================================
function VaultScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('videos');

  // Dynamic Notes State
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  // Active playing video state
  const [activeVideo, setActiveVideo] = useState(null);

  // Video List using local relapse.mp4 asset
  const [videoList, setVideoList] = useState([
    { id: '1', name: 'Relapse Video', source: require('./assets/relapse.mp4') }
  ]);

  // UI State for Hidden Apps
  const [appList, setAppList] = useState([]);

  // Enable sound playback on all devices
  useEffect(() => {
    async function enableAudio() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      } catch (e) {
        console.log('Audio mode error:', e);
      }
    }
    enableAudio();
  }, []);

  // Note Handlers
  const handleAddNote = () => {
    if (newNote.trim() !== '') {
      setNotes([...notes, { id: Date.now().toString(), text: newNote }]);
      setNewNote('');
    }
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Video Handlers
  const handleAddVideoSim = () => {
    const nextNum = videoList.length + 1;
    setVideoList([
      ...videoList, 
      { id: Date.now().toString(), name: `Relapse Video ${nextNum}`, source: require('./assets/relapse.mp4') }
    ]);
  };

  const handleDeleteVideoSim = (id) => {
    if (activeVideo?.id === id) setActiveVideo(null);
    setVideoList(videoList.filter(v => v.id !== id));
  };

  // App Handlers
  const handleAddAppSim = () => {
    const appName = `Hidden App ${appList.length + 1}`;
    setAppList([...appList, { id: Date.now().toString(), name: appName }]);
  };

  const handleDeleteAppSim = (id) => {
    setAppList(appList.filter(a => a.id !== id));
  };

  return (
    <SafeAreaView style={vaultStyles.container}>
      {/* OS Phone Top Header Bar */}
      <View style={vaultStyles.osHeader}>
        <View style={vaultStyles.statusBox}>
          <Text style={vaultStyles.phoneTime}>09:41</Text>
          <Text style={vaultStyles.vaultBadge}>⚡ SECURE OS VAULT</Text>
        </View>
        <TouchableOpacity 
          style={vaultStyles.lockBtn}
          onPress={() => navigation.navigate('Calculator')}
        >
          <Text style={vaultStyles.lockText}>🔒 LOCK</Text>
        </TouchableOpacity>
      </View>

      {/* Cyber Dock Tabs */}
      <View style={vaultStyles.dock}>
        <TouchableOpacity 
          style={[vaultStyles.dockItem, activeTab === 'videos' && vaultStyles.activeDockItem]}
          onPress={() => { setActiveTab('videos'); setActiveVideo(null); }}
        >
          <Text style={vaultStyles.dockEmoji}>🎬</Text>
          <Text style={vaultStyles.dockLabel}>Videos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[vaultStyles.dockItem, activeTab === 'apps' && vaultStyles.activeDockItem]}
          onPress={() => { setActiveTab('apps'); setActiveVideo(null); }}
        >
          <Text style={vaultStyles.dockEmoji}>📱</Text>
          <Text style={vaultStyles.dockLabel}>Apps</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[vaultStyles.dockItem, activeTab === 'notes' && vaultStyles.activeDockItem]}
          onPress={() => { setActiveTab('notes'); setActiveVideo(null); }}
        >
          <Text style={vaultStyles.dockEmoji}>📝</Text>
          <Text style={vaultStyles.dockLabel}>Notes</Text>
        </TouchableOpacity>
      </View>

      {/* Vault Body Content */}
      <ScrollView contentContainerStyle={vaultStyles.content}>
        
        {/* ================= VIDEOS TAB ================= */}
        {activeTab === 'videos' && (
          <View>
            <View style={vaultStyles.headerWithAction}>
              <Text style={vaultStyles.heading}>🎬 Video Vault</Text>
              <TouchableOpacity style={vaultStyles.actionBtn} onPress={handleAddVideoSim}>
                <Text style={vaultStyles.actionBtnText}>+ Add Video</Text>
              </TouchableOpacity>
            </View>

            {/* Embedded Active Video Player */}
            {activeVideo && (
              <View style={vaultStyles.playerContainer}>
                <Text style={vaultStyles.playingTitle}>▶ Playing: {activeVideo.name}</Text>
                <Video
                  source={activeVideo.source}
                  style={vaultStyles.videoPlayer}
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay
                  useNativeControls
                  isMuted={false}
                  volume={1.0}
                  isLooping
                />
                <TouchableOpacity 
                  style={vaultStyles.closePlayerBtn}
                  onPress={() => setActiveVideo(null)}
                >
                  <Text style={vaultStyles.closePlayerText}>✕ Close Player</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* List of Videos */}
            {videoList.length === 0 ? (
              <View style={vaultStyles.emptyBox}>
                <Text style={vaultStyles.emptyText}>No videos stored in vault.</Text>
              </View>
            ) : (
              videoList.map((v) => (
                <View key={v.id} style={vaultStyles.itemCard}>
                  <TouchableOpacity 
                    style={vaultStyles.itemInfoTouchable} 
                    onPress={() => setActiveVideo(v)}
                  >
                    <Text style={vaultStyles.itemEmoji}>▶️</Text>
                    <View style={vaultStyles.itemInfo}>
                      <Text style={vaultStyles.itemTitle}>{v.name}</Text>
                      <Text style={vaultStyles.itemSub}>Tap to play video</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteVideoSim(v.id)}>
                    <Text style={vaultStyles.deleteIconText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {/* ================= APPS TAB ================= */}
        {activeTab === 'apps' && (
          <View>
            <View style={vaultStyles.headerWithAction}>
              <Text style={vaultStyles.heading}>📱 Hidden Apps</Text>
              <TouchableOpacity style={vaultStyles.actionBtn} onPress={handleAddAppSim}>
                <Text style={vaultStyles.actionBtnText}>+ Hide App</Text>
              </TouchableOpacity>
            </View>

            {appList.length === 0 ? (
              <View style={vaultStyles.emptyBox}>
                <Text style={vaultStyles.emptyText}>No hidden applications installed.</Text>
              </View>
            ) : (
              appList.map((a) => (
                <View key={a.id} style={vaultStyles.itemCard}>
                  <Text style={vaultStyles.itemEmoji}>🔓</Text>
                  <View style={vaultStyles.itemInfo}>
                    <Text style={vaultStyles.itemTitle}>{a.name}</Text>
                    <Text style={vaultStyles.itemSub}>Sandboxed Environment</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteAppSim(a.id)}>
                    <Text style={vaultStyles.deleteIconText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {/* ================= NOTES TAB ================= */}
        {activeTab === 'notes' && (
          <View>
            <Text style={vaultStyles.heading}>📝 Encrypted Notes</Text>

            <View style={vaultStyles.inputRow}>
              <TextInput 
                style={vaultStyles.input}
                placeholder="Type a new secret note..."
                placeholderTextColor="#475569"
                value={newNote}
                onChangeText={setNewNote}
              />
              <TouchableOpacity style={vaultStyles.saveBtn} onPress={handleAddNote}>
                <Text style={vaultStyles.saveBtnText}>Add</Text>
              </TouchableOpacity>
            </View>

            {notes.length === 0 ? (
              <View style={vaultStyles.emptyBox}>
                <Text style={vaultStyles.emptyText}>No secret notes saved yet.</Text>
              </View>
            ) : (
              notes.map((item) => (
                <View key={item.id} style={vaultStyles.noteCard}>
                  <Text style={vaultStyles.noteText}>{item.text}</Text>
                  <TouchableOpacity 
                    style={vaultStyles.deleteIconBtn} 
                    onPress={() => handleDeleteNote(item.id)}
                  >
                    <Text style={vaultStyles.deleteIconText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// 3. MAIN APP ROUTER (NAVIGATION)
// ==========================================
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Calculator" 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
        <Stack.Screen name="Vault" component={VaultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ==========================================
// 4. STYLES
// ==========================================
const calcStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050B14',
  },
  topHeader: {
    paddingHorizontal: 24,
    paddingTop: 15,
    alignItems: 'center',
  },
  brandTitle: {
    color: '#00F0FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 24,
    marginHorizontal: 12,
    marginTop: 10,
    backgroundColor: 'rgba(0, 240, 255, 0.03)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.15)',
  },
  expressionText: {
    color: '#64748B',
    fontSize: 20,
    marginBottom: 8,
  },
  displayText: {
    color: '#00F0FF',
    fontSize: 64,
    fontWeight: '300',
    textShadowColor: 'rgba(0, 240, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  keypad: {
    paddingHorizontal: 14,
    paddingBottom: 20,
    marginTop: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    width: 76,
    height: 76,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zeroButton: {
    width: 162,
    alignItems: 'flex-start',
    paddingLeft: 32,
  },
  btnNumber: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  btnTextNumber: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '500',
  },
  btnAction: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnTextAction: {
    color: '#00F0FF',
    fontSize: 22,
    fontWeight: '600',
  },
  btnOperator: {
    backgroundColor: '#00F0FF',
  },
  btnTextOperator: {
    color: '#050B14',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

const vaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  osHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneTime: {
    color: '#F9FAFB',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 10,
  },
  vaultBadge: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  lockBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  lockText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  dock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    backgroundColor: '#0B0F19',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  dockItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 14,
    width: 80,
  },
  activeDockItem: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#00F0FF',
  },
  dockEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  dockLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  heading: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  headerWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionBtn: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00F0FF',
  },
  actionBtnText: {
    color: '#00F0FF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playerContainer: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#00F0FF',
    alignItems: 'center',
  },
  playingTitle: {
    color: '#00F0FF',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  videoPlayer: {
    width: '100%',
    height: 480,
    borderRadius: 12,
    backgroundColor: '#000000',
  },
  closePlayerBtn: {
    marginTop: 12,
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  closePlayerText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFF',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  saveBtn: {
    backgroundColor: '#00F0FF',
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  saveBtnText: {
    color: '#030712',
    fontWeight: 'bold',
  },
  noteCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#00F0FF',
  },
  noteText: {
    color: '#E5E7EB',
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  deleteIconBtn: {
    padding: 4,
  },
  deleteIconText: {
    fontSize: 16,
  },
  emptyBox: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#0B0F19',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 13,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  itemInfoTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    color: '#F9FAFB',
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemSub: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
});