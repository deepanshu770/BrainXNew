import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Reanimated, {
  useSharedValue,
  withTiming,
  interpolate,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import beatsData from '../data/BeatsData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ANIMATION_CONFIG = { duration: 300 };

export default function SharedTransitionScreen() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const animated = useSharedValue(0);

  const navigation = useNavigation();
  const {
    params: {
      item: { index, mediaSpecs },
    },
  } = useRoute();

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: interpolate(animated.value, [0, 1], [mediaSpecs.pageY - y.value, 0]),
    left: interpolate(animated.value, [0, 1], [mediaSpecs.pageX - x.value, 0]),
    width: interpolate(animated.value, [0, 1], [mediaSpecs.width, SCREEN_WIDTH]),
    height: interpolate(animated.value, [0, 1], [mediaSpecs.height, SCREEN_HEIGHT]),
    borderRadius: interpolate(animated.value, [0, 1], [mediaSpecs.borderRadius, 0]),
    transform: [{ translateX: x.value }, { translateY: y.value }],
    overflow: 'hidden',
  }));

  const handleGoBack = () => {
    animated.value = withTiming(0, ANIMATION_CONFIG, () => {
      runOnJS(navigation.goBack)();
    });
  };

  useEffect(() => {
    animated.value = withTiming(1, ANIMATION_CONFIG);
  }, []);

  return (
    <Reanimated.View style={[StyleSheet.absoluteFill,{backgroundColor:'white',justifyContent:'center',alignItems:'center'}]}>
      <Reanimated.View style={animatedStyle} >
        <Image
          source={beatsData[index].image}
          style={{ width: '50%', height: '50%' }}
          resizeMode="cover"
        />
      </Reanimated.View>
    </Reanimated.View>
  );
}