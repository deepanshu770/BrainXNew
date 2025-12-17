import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KEYS, storage } from '../utils/Storage';



const onboardingData = [
  {
    id:1,
    title: 'Welcome to Binaural Beats',
    description: 'Beats that can improve your brain thinking power and ability to learn',
    image: require('../img/onboard-img-1.png'),
  },
  {
    id:2,
    title: 'Use Good Quality Earphones',
    description: 'For best experience, use good quality earphones to listen to the beats. Please keep volume at moderate level (40-60%)',
    image: require('../img/onboard-img-2.png'),
  },
  {
    id:3,
    title: 'Mental Peace',
    description: 'Listening only 10-15 minutes can relax your mind and enhance your mood',
    image: require('../img/onboard-img-3.png'),
  },
];


type OnboardingItem = typeof onboardingData[number];

type OnboardingSlideProps = {
  item: OnboardingItem;
  index: number;
  translateX: SharedValue<number>;
};

const OnboardingSlide = ({ item, index, translateX }: OnboardingSlideProps) => {
  const imageStyle = useAnimatedStyle(() => {
    const slidePosition = -translateX.value / SCREEN_WIDTH;

    const translateY = interpolate(
      slidePosition,
      [index - 1, index, index + 1],
      [100, 0, 100],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      slidePosition,
      [index - 1, index, index + 1],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      slidePosition,
      [index - 1, index, index + 1],
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  return (
    <View style={styles.slide}>
      <Animated.Image source={item.image} style={[styles.image, imageStyle]} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
};

type OnboardingDotProps = {
  index: number;
  translateX: SharedValue<number>;
  onPress: () => void;
};

const OnboardingDot = ({ index, translateX, onPress }: OnboardingDotProps) => {
  const dotStyle = useAnimatedStyle(() => {
    const slidePosition = -translateX.value / SCREEN_WIDTH;

    const opacity = interpolate(
      slidePosition,
      [index - 1, index, index + 1],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      slidePosition,
      [index - 1, index, index + 1],
      [0.8, 1.2, 0.8],
      Extrapolation.CLAMP
    );

    const backgroundColor = interpolateColor(
      slidePosition,
      [index - 0.5, index, index + 0.5],
      ['#007AFF80', '#007AFF', '#007AFF80']
    );

    return {
      opacity,
      transform: [{ scale }],
      backgroundColor,
    };
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Animated.View style={[styles.dot, dotStyle]} />
    </TouchableOpacity>
  );
};



const { width: SCREEN_WIDTH } = Dimensions.get('window');



const OnBoard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const isSliding = useSharedValue(false);
  const isLastSlide = currentIndex === onboardingData.length - 1;


  // Smooth transition to specific index
  const goToIndex = (index:number) => {
    const targetIndex = Math.min(
      Math.max(index, 0),
      onboardingData.length - 1
    );

    if (isSliding.value || targetIndex === currentIndex) {
      return;
    }

    isSliding.value = true;
    translateX.value = withTiming(-targetIndex * SCREEN_WIDTH, {
      duration: 500,
    }, (finished) => {
      if (finished) {
        runOnJS(setCurrentIndex)(targetIndex);
        isSliding.value = false;
      }
    });
  };

  const getStarted = useCallback(() => {
    storage.set(KEYS.OLD_USER, true);
  
  }, []);

  // Skip to last slide
  const skipToEnd = () => {
    goToIndex(onboardingData.length - 1);
  };

  // Updated gesture handler using new API
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      if (isSliding.value) {return;}
    })
    .onUpdate((e) => {
      if (isSliding.value) {return;}
      translateX.value = -currentIndex * SCREEN_WIDTH + e.translationX;
    })
    .onEnd((e) => {
      if (isSliding.value) {return;}

      if (e.velocityX > 800) {
        // Fast swipe right
        runOnJS(goToIndex)(Math.max(0, currentIndex - 1));
      } else if (e.velocityX < -800) {
        // Fast swipe left
        runOnJS(goToIndex)(Math.min(onboardingData.length - 1, currentIndex + 1));
      } else if (e.translationX < -SCREEN_WIDTH * 0.25) {
        // Swipe left beyond threshold
        runOnJS(goToIndex)(Math.min(onboardingData.length - 1, currentIndex + 1));
      } else if (e.translationX > SCREEN_WIDTH * 0.25) {
        // Swipe right beyond threshold
        runOnJS(goToIndex)(Math.max(0, currentIndex - 1));
      } else {
        // Return to current position
        translateX.value = withSpring(-currentIndex * SCREEN_WIDTH, {
          damping: 20,
          stiffness: 200,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={skipToEnd}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.carousel, animatedStyle]}>
          {onboardingData.map((item, index) => (
            <OnboardingSlide
              key={item.id}
              item={item}
              index={index}
              translateX={translateX}
            />
          ))}
        </Animated.View>
      </GestureDetector>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <OnboardingDot
              key={index}
              index={index}
              translateX={translateX}
              onPress={() => goToIndex(index)}
            />
          ))}
        </View>

        <View style={styles.ctaWrapper}>
          {isLastSlide ? (
            <TouchableOpacity onPress={getStarted} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => goToIndex(currentIndex + 1)}
            >
              <Text style={styles.secondaryButtonText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  carousel: {
    flex: 1,
    flexDirection: 'row',
  },
  slide: {
    width: SCREEN_WIDTH,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    color: '#666',
    lineHeight: 24,
  },
  footer: {
    width: '100%',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginHorizontal: 5,
  },
  ctaWrapper: {
    width: '100%',
    minHeight: 64,
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnBoard;




