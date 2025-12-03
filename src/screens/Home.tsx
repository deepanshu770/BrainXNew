import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useDerivedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import beatsData from '../data/BeatsData';
import PlayNow from '../components/PlayNow';

const { width } = Dimensions.get('window');
const colors = beatsData.map((item) => item.color);
const bgColors = beatsData.map((item) => item.bgColor);
const inputRange = beatsData.map((_, idx) => idx);

type Beat = typeof beatsData[number];

type BeatCardProps = {
  item: Beat;
  index: number;
  scrollOffset: SharedValue<number>;
};

const BeatCardComponent = ({ item, index, scrollOffset }: BeatCardProps) => {
    const cardStyle = useAnimatedStyle(() => {
      const progress = scrollOffset.value / width - index;

      const scale = interpolate(
        progress,
        [-1, 0, 1],
        [0.92, 1, 0.92],
        Extrapolation.CLAMP
      );

      const translateY = interpolate(
        progress,
        [-1, 0, 1],
        [28, 0, 28],
        Extrapolation.CLAMP
      );

      const shadow = interpolate(
        Math.abs(progress),
        [0, 1],
        [12, 2],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ scale }, { translateY }],
        opacity: interpolate(
          Math.abs(progress),
          [0, 1],
          [1, 0.6],
          Extrapolation.CLAMP
        ),
        shadowOpacity: shadow / 30,
        shadowRadius: shadow,
        elevation: shadow,
      };
    }, [index, scrollOffset]);

    const softAccent = useMemo(() => `${item.color}26`, [item.color]);

    return (
      <Animated.View style={[styles.card, cardStyle, { backgroundColor: item.bgColor }]}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.cardTitle, { color: item.color }]}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>Guided {item.title} waves</Text>
          </View>
          <View style={[styles.rangeBadge, { backgroundColor: softAccent }]}>
            <Text style={[styles.rangeLabel, { color: item.color }]}>Frequency</Text>
            <Text style={styles.rangeValue}>{item.frequency_gap}</Text>
          </View>
        </View>

        <View style={[styles.imageWrapper, { backgroundColor: softAccent }]}>
          <Animated.Image
            style={styles.image}
            source={item.image}
            resizeMode="cover"
            sharedTransitionTag={`beat-${item.id}`}
          />
        </View>

        <View style={styles.benefitsWrapper}>
          {item.benefits.map((benefit, benefitIndex) => (
            <View
              key={`benefit-${item.id}-${benefitIndex}`}
              style={[styles.benefitChip, { borderColor: softAccent }]}
            >
              <Text style={[styles.benefitChipText, { color: item.color }]}>{benefit}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    );
};

const BeatCard = memo(
  BeatCardComponent,
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.index === next.index &&
    prev.scrollOffset === next.scrollOffset
);

type PaginationDotProps = {
  index: number;
  scrollOffset: SharedValue<number>;
};

const PaginationDotComponent = ({ index, scrollOffset }: PaginationDotProps) => {
  const dotStyle = useAnimatedStyle(() => {
    const progress = scrollOffset.value / width - index;
    return {
      width: interpolate(
        Math.abs(progress),
        [0, 1],
        [24, 8],
        Extrapolation.CLAMP
      ),
      opacity: interpolate(
        Math.abs(progress),
        [0, 1],
        [1, 0.4],
        Extrapolation.CLAMP
      ),
    };
  }, [index, scrollOffset]);

  return <Animated.View style={[styles.paginationDot, dotStyle]} />;
};

const PaginationDot = memo(
  PaginationDotComponent,
  (prev, next) => prev.index === next.index && prev.scrollOffset === next.scrollOffset
);

const quickStats = [
  { label: 'Sessions', value: '24' },
  { label: 'Weekly streak', value: '5 days' },
  { label: 'Focus level', value: 'High' },
];

const Home = () => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const navigation = useNavigation<any>();

  const scrollProgress = useDerivedValue(() => scrollOffset.value / width);
  const activeColor = useDerivedValue(() => interpolateColor(scrollProgress.value, inputRange, colors));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(scrollProgress.value,inputRange,bgColors),
  }), []);

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: activeColor.value,
  }), []);
  const animatedTitleStyles = useAnimatedStyle(() => ({
    color: activeColor.value,
  }), []);

  const playHandler = useCallback(() => {
    const currentIndex = Math.round(scrollProgress.value);
    navigation.navigate('Player', { beatId: beatsData[currentIndex]?.id });
  }, [navigation, scrollProgress]);

  const headerAccent = useMemo(() => `${colors[0]}33`, []);

  return (
    <Animated.View style={[styles.root, backgroundStyle]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi there 👋</Text>
            <Text style={styles.subHeading}>Let’s tune your mind today</Text>
          </View>
          <View style={[styles.progressPill, { backgroundColor: headerAccent }]}>
            <Text style={styles.progressPillLabel}>Daily goal</Text>
            <Text style={styles.progressPillValue}>2 / 3</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {quickStats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Animated.ScrollView
          horizontal
          ref={scrollRef}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        >
          {beatsData.map((item, index) => (
            <View key={item.id} style={styles.cardWrapper}>
              <BeatCard item={item} index={index} scrollOffset={scrollOffset} />
            </View>
          ))}
        </Animated.ScrollView>

        <View style={styles.paginationBar}>
          {beatsData.map((_, index) => (
            <PaginationDot key={`pagination-${index}`} index={index} scrollOffset={scrollOffset} />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <PlayNow onPress={playHandler} title="Play session" animatedStyles={animatedButtonStyle} animatedTitleStyles={animatedTitleStyles} />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

export default Home;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  subHeading: {
    fontSize: 14,
    color: '#f6f6f6',
    marginTop: 4,
  },
  progressPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  progressPillLabel: {
    fontSize: 12,
    color: '#ffffffb3',
  },
  progressPillValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffffcc',
    borderRadius: 14,
    marginHorizontal: 4,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2933',
  },
  statLabel: {
    fontSize: 12,
    color: '#52606d',
    marginTop: 2,
  },
  carousel: {
    flexGrow: 0,
  },

  cardWrapper: {
    width,
    paddingHorizontal: 12,

  },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0b1c26',
    minHeight: 475,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
  },
  rangeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  rangeLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rangeValue: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1.15,
    height:'60%',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  benefitsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  benefitChip: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffffcc',
    marginHorizontal: 4,
    marginBottom: 8,
  },
  benefitChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  paginationBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffffcc',
    marginHorizontal: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
  },
});
