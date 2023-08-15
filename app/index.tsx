import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { theme } from '../style/theme'
import { Image, ScrollView } from 'react-native'
import { useAppSelector } from '../store/hooks'
import List from '../components/Shared/List'
import { Text } from 'react-native-paper';
import { Media } from '../types/media'


const Home = () => {
  const { all , movies , tv, anime } = useAppSelector(state => state.home.trending)
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{
        title : 'xpWatch',
        headerTitle : props => <LogoTitle /> ,
      }} />
     <View>
     <List data={all} />
      <List data={movies as Media[]} name='Movies' />
      <List data={tv as Media[]} name='TV Shows' />
      <List data={anime} name='Anime' />
     </View>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {  
        flex: 1,
        backgroundColor: theme.colors.background,
        padding : 10
    },
})


export function LogoTitle() {
  return (
    <>
    <Image
      style={{ width: 40, height: 30 }}
      source={{ uri: 'https://xpwatch.vercel.app/logo.png' }}
    />
    <Text> xpWatch</Text>
    </>
  );
}