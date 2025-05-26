import { View, Text, Button } from 'react-native'
import React from 'react'
import { AudioPro, AudioProState, AudioProTrack, useAudioPro } from 'react-native-audio-pro'

const track: AudioProTrack = {

  id: '1',
  artwork: 'https://example.com/artwork.jpg',
  title: 'Title',
  url: require('../data/music/song.mp3')

}
const Audio = () => {
  const { state, position, duration, playingTrack, playbackSpeed, volume, error } = useAudioPro();
  const onPressHandler = () => {
    if (state == AudioProState.PLAYING) {
      AudioPro.pause();
    } else {
      AudioPro.play(track);
    }

  }
  return (
    <View>
      <Text>{position}</Text>
      <Text>{duration}</Text>
      <Text>{playingTrack?.title}</Text>
      <Text>{playbackSpeed}</Text>
      <Text>{volume}</Text>
      <Text>{error?.error}</Text>
      <Button title={state} onPress={onPressHandler} />

    </View>
  )
}

export default Audio