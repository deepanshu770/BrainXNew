import React, {useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { KEYS, storage } from "../utils/Storage";
import { StackActions, useNavigation } from "@react-navigation/native";



const onboardingData = [
  {
    id:1,
    title: "Welcome to Binaural Beats",
    description: "Beats that can improve your brain thinking power and ability to learn",
    image: require("../img/onboard-img-1.png"),
  },
  {
    id:2,
    title: "Use Good Quality Earphones",
    description: "To get the best benefits of binaural beats",
    image: require("../img/onboard-img-2.png"),
  },
  {
    id:3,
    title: "Mental Peace",
    description: "Listening only 10 minutes can relax your mind and enhance you mood",
    image: require("../img/onboard-img-3.png"),
  },
];



const { width: SCREEN_WIDTH } = Dimensions.get('window');



const OnBoard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const isSliding = useSharedValue(false);
  const navigation = useNavigation();


  // Smooth transition to specific index
  const goToIndex = (index:number) => {
    if (isSliding.value || index === currentIndex) return;
    
    isSliding.value = true;
    translateX.value = withTiming(-index * SCREEN_WIDTH, {
      duration: 500,
    }, (finished) => {
      if (finished) {
        runOnJS(setCurrentIndex)(index);
        isSliding.value = false;
      }
    });
  };

  const getStarted = useCallback(()=>{
    storage.set(KEYS.NEW_USER,true);
    navigation.dispatch(
      StackActions.replace('Home')
    );
  },[])

  // Skip to last slide
  const skipToEnd = () => {
    goToIndex(onboardingData.length - 1);
  };

  // Updated gesture handler using new API
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      if (isSliding.value) return;
    })
    .onUpdate((e) => {
      if (isSliding.value) return;
      translateX.value = -currentIndex * SCREEN_WIDTH + e.translationX;
    })
    .onEnd((e) => {
      if (isSliding.value) return;
      
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

  // Parallax effect for images
  const parallaxStyle = (index:number) => {
    return useAnimatedStyle(() => {
      // Calculate the relative position of this slide
      const slidePosition = -translateX.value / SCREEN_WIDTH;
      
      // Parallax effect values
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
        transform: [
          { translateY },
          { scale },
        ],
        opacity
      }},[]);
  };

  const animatedDotStyle = (index:number) => {
    return useAnimatedStyle(() => {
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
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      {currentIndex < onboardingData.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={skipToEnd}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.carousel, animatedStyle]}>
          {onboardingData.map((item, index) => (
            <View key={item.id} style={styles.slide}>
              <Animated.Image 
                source={item.image} 
                style={[styles.image, parallaxStyle(index)]} 
              />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          ))}
        </Animated.View>
      </GestureDetector>

      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => goToIndex(index)}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[styles.dot, animatedDotStyle(index)]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {currentIndex === onboardingData.length - 1 ? (
        <TouchableOpacity onPress={getStarted} style={styles.buttonContainer}>
          <Text style={styles.button}>Get Started</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => goToIndex(currentIndex + 1)}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      )}
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
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginHorizontal: 5,
  },
  buttonContainer: {
    marginHorizontal: 40,
    marginBottom: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#007AFF',
    color: 'white',
    padding: 16,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButton: {
    alignSelf: 'center',
    marginBottom: 40,
    padding: 10,
  },
  nextText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnBoard;




