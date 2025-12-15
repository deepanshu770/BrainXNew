import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  AppState,
  ScrollView, 
  Platform
} from 'react-native';
import Slider from '@react-native-community/slider';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from '@react-navigation/native';
import beatsData from '../data/BeatsData';
import { AudioContext } from 'react-native-audio-api';

const width = Dimensions.get("window").width;

const formatTime = (secs: number) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const Player = () => {
  const navigation = useNavigation();
  const { params: { index } } = useRoute();
  const item = beatsData.at(index as number) || beatsData[0];

  // --- REFS ---
  const audioCtx = useRef<AudioContext | null>(null);
  const gainNode = useRef<any>(null);
  // We need to store oscillators to update frequency dynamically
  const oscillatorsRef = useRef<{ left: any, right: any } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration] = useState(900); 
  const [currentTime, setCurrentTime] = useState(0);
  const [isRepeatOn, setIsRepeatOn] = useState(true);
  
  // NEW: Track selected sub-category (Default to 0)
  const [subIndex, setSubIndex] = useState(0);

  // Get current active data
  const activeSub = item.subCategories[subIndex || 0];

  // --- AUDIO ENGINE ---
  const setupAudioGraph = useCallback(() => {
    if (audioCtx.current) return;

    // Use currently selected sub-category or fallback
    const targetData = activeSub;

    const ctx = new AudioContext();
    audioCtx.current = ctx;

    const oscLeft = ctx.createOscillator();
    const oscRight = ctx.createOscillator();
    const pannerLeft = ctx.createStereoPanner();
    const pannerRight = ctx.createStereoPanner();
    const mainGain = ctx.createGain();

    oscLeft.type = 'sine';
    oscRight.type = 'sine';
    
    // Set Initial Frequencies
    oscLeft.frequency.value = targetData.baseFreq;
    oscRight.frequency.value = targetData.baseFreq + targetData.beatFreq;

    pannerLeft.pan.value = -1;
    pannerRight.pan.value = 1;
    mainGain.gain.value = 0.5;

    // Connect
    oscLeft.connect(pannerLeft);
    pannerLeft.connect(mainGain);
    oscRight.connect(pannerRight);
    pannerRight.connect(mainGain);
    mainGain.connect(ctx.destination);

    // Save Refs
    gainNode.current = mainGain;
    oscillatorsRef.current = { left: oscLeft, right: oscRight };

    const now = ctx.currentTime;
    oscLeft.start(now);
    oscRight.start(now);
  }, [item, activeSub]); // Re-create if item changes, but usually we just update freq

  // --- DYNAMIC FREQUENCY UPDATE ---
  // This effect runs when user taps a different pill
  useEffect(() => {
    if (audioCtx.current && oscillatorsRef.current && activeSub) {
      const { baseFreq, beatFreq } = activeSub;
      const now = audioCtx.current.currentTime;
      
      // Smoothly transition frequency over 0.2 seconds to avoid "clicks"
      // Note: react-native-audio-api might prefer setValueAtTime or direct assignment
      try {
        oscillatorsRef.current.left.frequency.setValueAtTime(baseFreq, now);
        oscillatorsRef.current.right.frequency.setValueAtTime(baseFreq + beatFreq, now);
      } catch (e) {
        // Fallback if timing is off
        oscillatorsRef.current.left.frequency.value = baseFreq;
        oscillatorsRef.current.right.frequency.value = baseFreq + beatFreq;
      }
    }
  }, [activeSub]);

  // --- CLEANUP ---
  const cleanupAudio = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioCtx.current) {
      try {
        gainNode.current?.gain.setValueAtTime(0, audioCtx.current.currentTime);
        audioCtx.current.close();
      } catch (e) { console.log(e); }
      audioCtx.current = null;
      oscillatorsRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => cleanupAudio();
  }, [cleanupAudio]);

  // App State handling... (Same as before)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && isPlaying) {
        audioCtx.current?.resume();
      } else if (nextAppState.match(/inactive|background/) && !isPlaying) {
        audioCtx.current?.suspend();
      }
    });
    return () => subscription.remove();
  }, [isPlaying]);

  // --- CONTROLS ---
  const togglePlay = async () => {
    if (!audioCtx.current) setupAudioGraph();

    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
      await audioCtx.current?.suspend();
    } else {
      setIsPlaying(true);
      await audioCtx.current?.resume();
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => (prev >= duration ? (isRepeatOn ? 0 : duration) : prev + 1));
      }, 1000);
    }
  };

  const handleSeek = (value: number) => setCurrentTime(value);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: item.bgColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={item.bgColor} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="chevron-down" size={30} color={item.color} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: item.color }]}>{item.title} Session</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ARTWORK */}
      <View style={styles.artworkContainer}>
        <View style={styles.artworkWrapper}>
          <Animated.Image
            sharedTransitionTag='image'
            style={styles.artwork}
            source={item.image}
          />
        </View>
        <Text style={[styles.helperText, { color: item.color }]}>
          <Ionicons name="headset" size={14} /> Headphones Required
        </Text>
      </View>

      {/* --- NEW: SUB-CATEGORY SELECTOR --- */}
      {item.subCategories && (
        <View style={styles.selectorContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectorContent}
          >
            {item.subCategories.map((sub, idx) => {
              const isActive = idx === subIndex;
              return (
                <TouchableOpacity
                  key={sub.id}
                  onPress={() => setSubIndex(idx)}
                  style={[
                    styles.pill,
                    { 
                      backgroundColor: isActive ? item.color : 'transparent',
                      borderColor: item.color,
                    }
                  ]}
                >
                  <Text style={[
                    styles.pillText,
                    { color: isActive ? item.bgColor : item.color }
                  ]}>
                    {sub.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* INFO */}
      <View style={styles.infoContainer}>
        {/* Animated Key to force refresh animation when text changes */}
        <Animated.View key={subIndex} entering={FadeInDown.duration(300)}>
            <Text style={[styles.songTitle, { color: item.color }]}>
            {activeSub?.title || item.title}
            </Text>
            <Text style={[styles.artistName, { color: item.color }]}>
            {activeSub?.description || item.frequency_gap}
            </Text>
        </Animated.View>
      </View>

      {/* PROGRESS */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          value={currentTime}
          minimumValue={0}
          maximumValue={duration}
          minimumTrackTintColor={item.color}
          maximumTrackTintColor="rgba(0,0,0,0.1)"
          thumbTintColor={item.color}
          onSlidingComplete={handleSeek}
        />
        <View style={styles.timeLabels}>
          <Text style={[styles.timeText, { color: item.color }]}>{formatTime(currentTime)}</Text>
          <Text style={[styles.timeText, { color: item.color }]}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* CONTROLS */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={() => setCurrentTime(t => Math.max(0, t - 15))}>
          <Ionicons name="play-back-outline" size={30} color={item.color} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={togglePlay}
          activeOpacity={0.8}
          style={[styles.playButton, { backgroundColor: item.color }]}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={40}
            color={item.bgColor}
            style={{ marginLeft: isPlaying ? 0 : 4 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRepeatOn(!isRepeatOn)}>
          <Ionicons
            name={isRepeatOn ? "infinite" : "stop-circle-outline"}
            size={30}
            color={item.color}
            style={{ opacity: isRepeatOn ? 1 : 0.5 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    opacity: 0.8,
    textTransform: 'uppercase'
  },
  iconButton: {
    padding: 10,
  },
  artworkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    // Reduced padding to make room for selector
    paddingVertical: 10, 
  },
  artworkWrapper: {
    width: width * 0.7, 
    height: width * 0.7,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  artwork: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  helperText: {
    marginTop: 15,
    opacity: 0.6,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5
  },
  // --- NEW STYLES FOR SELECTOR ---
  selectorContainer: {
    height: 50,
    marginTop: 10,
    marginBottom: 10,
  },
  selectorContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 10, // Space between pills
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // -------------------------------
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    height: 70, // Fixed height to prevent jumpiness
    justifyContent: 'center'
  },
  songTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 5,
    textAlign: 'center',
  },
  artistName: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 20
  },
  progressContainer: {
    width: width,
    alignItems: 'center',
    marginBottom: 10,
  },
  slider: {
    width: width * 0.85,
    height: 40,
  },
  timeLabels: {
    width: width * 0.85,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
    width: width,
    marginBottom: 20,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default Player;