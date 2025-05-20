


import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { interpolateColor, useAnimatedRef, useAnimatedStyle, useScrollViewOffset, } from 'react-native-reanimated';
import beatsData from '../data/BeatsData';

import PlayNow from '../components/PlayNow';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get("window");
const colors = beatsData.map((item) => item.color);
const inputRange = beatsData.map((_, idx) => idx);

const Home = () => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const navigation = useNavigation();

  const animatedButtonStyle = useAnimatedStyle(() => {
    const index = scrollOffset.value / width;
    return {
      backgroundColor: interpolateColor(
        index,
        inputRange,
        colors
      ),
    };
  },[]);
  const playHandler = useCallback(()=>{
    const index = Math.ceil(scrollOffset.value/width);
    console.log(index);
    navigation.navigate('Player');
  },[])

   const renderBeatItem = (item:any, index:number) => (
        <Animated.View key={`beat-${index}`} style={styles.beatContainer}>
          <Animated.Image 
            style={styles.image} 
            source={item.image} 
            resizeMode="contain"
            sharedTransitionTag='image'
          />
          
          <View style={styles.textContainer}>
            <Animated.Text style={[styles.title, { color: item.color }]}>
              {item.title}
            </Animated.Text>
            <Animated.Text style={styles.frequency}>
              {item.frequency_gap}
            </Animated.Text>
          </View>
    
          {item.benefits.map((benefit:string, benefitIndex:number) => (
            <View key={`benefit-${index}-${benefitIndex}`} style={styles.benefitItem}>
              <Text style={styles.benefitText}>
                {benefit}
              </Text>
            </View>
          ))}
        </Animated.View>
      );
    
  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        horizontal
        ref={scrollRef}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {beatsData.map(renderBeatItem)}
      
      </Animated.ScrollView>
      <View style={styles.buttonContainer}>

        <PlayNow onPress={playHandler} title='Play' animatedStyles={animatedButtonStyle} />
      </View>

    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({

  center: {
    justifyContent: "center",
    alignItems: "center",

  },
    container: {
    flex: 1,
    backgroundColor: 'rgb(240, 240, 240)',
  },
  beatContainer: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    height: 350,
    width: 350,
    borderRadius: 6,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontWeight: '600',
    fontSize: 30,
    marginBottom: 5,
  },
  frequency: {
    fontSize: 15,
    color: '#666',
  },
  benefitItem: {
    backgroundColor: 'white',
    borderRadius: 9,
    marginBottom: 6,
    width: '80%',
  },
  benefitText: {
    textAlign: 'center',
    fontSize: 20,
    letterSpacing: 2.5,
    padding: 6,
    color: 'black',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
})


// import { Dimensions, StyleSheet, Text, View } from 'react-native';
// import React, { useCallback } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Animated, {
//   interpolateColor,
//   useAnimatedRef,
//   useAnimatedStyle,
//   useScrollViewOffset,
// } from 'react-native-reanimated';
// import beatsData from '../data/BeatsData';
// import PlayNow from '../components/PlayNow';

// const { width } = Dimensions.get('window');
// const colors = beatsData.map((item) => item.color);
// const inputRange = beatsData.map((_, idx) => idx * width);

// const Home = () => {
//   const scrollRef = useAnimatedRef<Animated.ScrollView>();
//   const scrollOffset = useScrollViewOffset(scrollRef);

//   const animatedButtonStyle = useAnimatedStyle(() => {
//     const index = scrollOffset.value / width;
//     return {
//       backgroundColor: interpolateColor(
//         index,
//         inputRange,
//         colors
//       ),
//     };
//   }, []);

//   const playHandler = useCallback(() => {
//     const currentIndex = Math.round(scrollOffset.value / width);
//     console.log('Playing beat at index:', currentIndex);
//     // Add your play logic here
//   }, [scrollOffset.value]);

//   
//   return (
//     <SafeAreaView style={styles.container}>
//       <Animated.ScrollView
//         ref={scrollRef}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         snapToInterval={width}
//         decelerationRate="fast"
//       >
//         {beatsData.map(renderBeatItem)}
//       </Animated.ScrollView>

//       <View style={styles.buttonContainer}>
//         <PlayNow 
//           onPress={playHandler} 
//           title="Play" 
//           animatedStyles={animatedButtonStyle} 
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({

// });

// export default Home;