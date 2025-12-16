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
import { AudioEngine } from '../services/AudioEngine';
import { UserStats } from '../services/UserStats';

const width = Dimensions.get("window").width;

const formatTime = (secs: number) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const PlayerHeader = ({ title, color, onBack }: { title: string, color: string, onBack: () => void }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.iconButton}>
      <Ionicons name="chevron-down" size={30} color={color} />
    </TouchableOpacity>
    <Text style={[styles.headerTitle, { color: color }]}>{title} Session</Text>
    <View style={{ width: 40 }} />
  </View>
);

const PlayerArtwork = ({ image, color }: { image: any, color: string }) => (
  <View style={styles.artworkContainer}>
    <View style={styles.artworkWrapper}>
      <Animated.Image
        sharedTransitionTag='image'
        style={styles.artwork}
        source={image}
      />
    </View>
    <Text style={[styles.helperText, { color: color }]}>
      <Ionicons name="headset" size={14} /> Headphones Required
    </Text>
  </View>
);

const SubCategorySelector = ({ subCategories, selectedIndex, onSelect, color, bgColor }: any) => {
  if (!subCategories) return null;
  return (
    <View style={styles.selectorContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selectorContent}
      >
        {subCategories.map((sub: any, idx: number) => {
          const isActive = idx === selectedIndex;
          return (
            <TouchableOpacity
              key={sub.id}
              onPress={() => onSelect(idx)}
              style={[
                styles.pill,
                {
                  backgroundColor: isActive ? color : 'transparent',
                  borderColor: color,
                }
              ]}
            >
              <Text style={[
                styles.pillText,
                { color: isActive ? bgColor : color }
              ]}>
                {sub.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const PlayerInfo = ({ title, description, frequency, color, enteringKey }: any) => (
  <View style={styles.infoContainer}>
    <Animated.View key={enteringKey} entering={FadeInDown.duration(300)} style={{ alignItems: 'center' }}>
      <Text style={[styles.songTitle, { color: color }]}>
        {title}
      </Text>
      <Text style={[styles.artistName, { color: color }]}>
        {description}
      </Text>
      <Text style={[styles.frequencyText, { color: color }]}>
        {frequency}
      </Text>
    </Animated.View>
  </View>
);

const PlayerProgress = ({ currentTime, duration, color, onSeek }: any) => (
  <View style={styles.progressContainer}>
    <Slider
      style={styles.slider}
      value={currentTime}
      minimumValue={0}
      maximumValue={duration}
      minimumTrackTintColor={color}
      maximumTrackTintColor="rgba(0,0,0,0.1)"
      thumbTintColor={color}
      onSlidingComplete={onSeek}
    />
    <View style={styles.timeLabels}>
      <Text style={[styles.timeText, { color: color }]}>{formatTime(currentTime)}</Text>
      <Text style={[styles.timeText, { color: color }]}>{formatTime(duration)}</Text>
    </View>
  </View>
);

const PlayerControls = ({ isPlaying, isRepeatOn, color, bgColor, onTogglePlay, onToggleRepeat, onSeekBack }: any) => (
  <View style={styles.controlsContainer}>
    <TouchableOpacity onPress={onSeekBack}>
      <Ionicons name="play-back-outline" size={30} color={color} />
    </TouchableOpacity>

    <TouchableOpacity
      onPress={onTogglePlay}
      activeOpacity={0.8}
      style={[styles.playButton, { backgroundColor: color }]}
    >
      <Ionicons
        name={isPlaying ? "pause" : "play"}
        size={40}
        color={bgColor}
        style={{ marginLeft: isPlaying ? 0 : 4 }}
      />
    </TouchableOpacity>

    <TouchableOpacity onPress={onToggleRepeat}>
      <Ionicons
        name={isRepeatOn ? "infinite" : "stop-circle-outline"}
        size={30}
        color={color}
        style={{ opacity: isRepeatOn ? 1 : 0.5 }}
      />
    </TouchableOpacity>
  </View>
);

const Player = () => {
  const navigation = useNavigation();
  const { params: { index } } = useRoute();

  const item = beatsData.at(index as number) || beatsData[0];
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration] = useState(900);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [subIndex, setSubIndex] = useState(0);
  const activeSub = item.subCategories[subIndex || 0];

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isRepeatOnRef = useRef(isRepeatOn);

  useEffect(() => {
    isRepeatOnRef.current = isRepeatOn;
  }, [isRepeatOn]);

  // --- DYNAMIC FREQUENCY UPDATE ---
  useEffect(() => {
    if (activeSub) {
      AudioEngine.updateFrequency(activeSub.baseFreq, activeSub.beatFreq);
    }
  }, [activeSub]);

  // --- SESSION RECORDING & AUTO STOP ---
  useEffect(() => {
    if (currentTime > 0 && currentTime >= duration) {
      if (currentTime === duration) {
        UserStats.recordSession();
      }
      if (!isRepeatOn) {
        setIsPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
        AudioEngine.pause();
      }
    }
  }, [currentTime, duration, isRepeatOn]);

  // --- CLEANUP ---
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      AudioEngine.pause();
    };
  }, []);

  // App State handling
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && isPlaying) {
        AudioEngine.resume();
      } else if (nextAppState.match(/inactive|background/)) {
        AudioEngine.suspend();
      }
    });
    return () => subscription.remove();
  }, [isPlaying]);

  // --- CONTROLS ---
  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
      await AudioEngine.pause();
    } else {
      setCurrentTime(prev => {
        if (prev >= duration) {
          return 0;
        }
        return prev;
      })
      setIsPlaying(true);
      await AudioEngine.play(activeSub.baseFreq, activeSub.beatFreq);
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            return isRepeatOnRef.current ? 0 : duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
  }, [isPlaying, activeSub, duration]); // Removed isRepeatOn from dependency, using ref

  const handleSeek = useCallback((value: number) => setCurrentTime(value), []);
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleSubSelect = useCallback((idx: number) => setSubIndex(idx), []);
  const handleSeekBack = useCallback(() => setCurrentTime(t => Math.max(0, t - 15)), []);
  const handleToggleRepeat = useCallback(() => setIsRepeatOn(r => !r), []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: item.bgColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={item.bgColor} />

      <PlayerHeader 
        title={item.title} 
        color={item.color} 
        onBack={handleBack} 
      />

      <PlayerArtwork 
        image={item.image} 
        color={item.color} 
      />

      <SubCategorySelector
        subCategories={item.subCategories}
        selectedIndex={subIndex}
        onSelect={(idx:number)=>setSubIndex(idx)}
        color={item.color}
        bgColor={item.bgColor}
      />

      <PlayerInfo
        title={activeSub?.title || item.title}
        description={activeSub?.description || item.frequency_gap}
        frequency={activeSub ? `${activeSub.beatFreq} Hz` : item.frequency_gap}
        color={item.color}
        enteringKey={subIndex}
      />

      <PlayerProgress
        currentTime={currentTime}
        duration={duration}
        color={item.color}
        onSeek={handleSeek}
      />

      <PlayerControls
        isPlaying={isPlaying}
        isRepeatOn={isRepeatOn}
        color={item.color}
        bgColor={item.bgColor}
        onTogglePlay={togglePlay}
        onToggleRepeat={handleToggleRepeat}
        onSeekBack={handleSeekBack}
      />
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
    minHeight: 90, 
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
  frequencyText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    opacity: 0.9,
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