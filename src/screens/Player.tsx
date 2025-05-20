import { View, Text, Dimensions, Image, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Slider from '@react-native-community/slider';
import Animated from 'react-native-reanimated';
// import Title from '../prev_screens/components of Player/Title';
import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import Icon from 'react-native-vector-icons/FontAwesome';
const { width, height } = Dimensions.get("window");

const Player = () => {
    const item = {
    id: '1',
    title: 'Delta',
    // url:require('./music/song1.mp3'),
    image: require('../img/mediation.jpg'),
    frequency_gap: '0.1Hz - 4Hz',

    benefits: [

      'Deep Sleep',
      'Pain Relief',
    'Healing',
    ],
    icon: 'sleep',
    color: '#142B2E',
    bgColor: '#BCD5EB',
  }
  return (
   <SafeAreaView style={{ flex: 1, backgroundColor: item.bgColor }}>
       <StatusBar backgroundColor={item.bgColor}/>
         <View>
           {/* <Title
             title={item.title}
             id={item.id}
             frequency_gap={item.frequency_gap}
             color={item.color}
           /> */}
         </View>
   
         <View style={styles.main_container}>
           <View style={styles.image_container}>
             {/* <SharedElement id={item.id}> */}
               <Animated.Image sharedTransitionTag='image' style={styles.image} source={item.image} />
             {/* </SharedElement> */}
           </View>
         </View>
         <View >
         <View
        
       
           style={{
             marginTop: 35,
             justifyContent: "center",
             alignItems: "center",
             overflow: "hidden",
           }}
         >
           <Slider
             style={{
               width: "93%",
             }}
             value={0}
            //  maximumValue={progress.duration}
             minimumValue={0}
             minimumTrackTintColor={item.color}
             maximumTrackTintColor="black"
            //  thumbTintColor={item.color363}
             // onValueChange={(value) => console.log(value)}
            //  onSlidingComplete={changeHandler}
           />
         </View>
         </View>
         <View
           style={{
             justifyContent: "center",
             alignItems: "center",
           }}
         >
           <View
            //  animation={timeAnimation}
            //  duration={2000}
            //  delay={800}
            //  useNativeDriver
             style={{
               height: 30,
               marginTop: 12,
               width: width * 0.9,
               flexDirection: "row",
               justifyContent: "space-between",
             }}
           >
             <Text
               style={{
                 fontSize: 20,
                 fontWeight: "500",
                 color: item.color,
               }}
             >
               {/* {new Date(progress.position * 1000).toISOString().substr(14, 5)} */}
             </Text>
             <Text
               style={{
                 fontSize: 20,
                 fontWeight: "500",
                 color: item.color,
               }}
             >
               {/* {new Date(progress.duration * 1000).toISOString().substr(14, 5)} */}
             </Text>
           </View>
         </View>
         <View
        //    animation={iconAnimaton}
        //    delay={300}
        //    useNativeDriver
        //    duration={700}
           style={{
             justifyContent: "center",
             alignItems: "center",
             marginTop: 30,
           }}
         >
           <TouchableOpacity >
             <Ionicons
               color="black"
               size={45}
               name={
                 "play"
                  
               }
             />
           </TouchableOpacity>
           <View
            
             style={{
               alignItems: "center",
               justifyContent: "center",
               position: "absolute",
               right: 30,
             }}
           >
             <TouchableOpacity
            //    onPress={() => {
            //      toggleRepeat();
            //    }}
             >
               {/* <MaterialCommunityIcons
                 style={{
                   left: 17,
                 }}
                //  color={repeat?item.color:"grey"}
                 size={25}
                 name={"repeat"}
               /> */}

               <Text style={{
                 color:'black'
               }}>{'Repeat Off'}</Text>
             </TouchableOpacity>
           </View>
         </View>
       </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    right: 15,
    top:40,
    zIndex: 34,
  },
  main_container: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:'blue',
    marginTop: 40,
  },
  image_container: {
    width: width,
    height: height * 0.5,

    overflow: "hidden",
    // backgroundColor:'red'
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
export default Player