import { StyleSheet, View } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';
import { Button, SegmentedButtons, Text } from 'react-native-paper';
import { useLocalSearchParams, Stack } from 'expo-router';
import { theme } from '../../style/theme';



const Player = () => {
    const { sources, title, poster } = useLocalSearchParams()
    console.log(sources)
    const srcs = JSON.parse(sources as string)
    const [src, setSrc] = React.useState(srcs[0].url)
    const video = React.useRef<WebView>(null);
    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <View style={styles.video}>
            <WebView
                ref={video}
                allowsFullscreenVideo={true}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                mediaCapturePermissionGrantType='grant'

                source={{
                    uri: src,
                }} />
            </View>

            <Button mode="contained" style={{ marginVertical: 10 }} onPress={() => {
                video.current?.reload()
            }}>Reload</Button>

            <Text variant='labelLarge'>{title}</Text>
            <Text variant='labelSmall'>Select Source</Text>

            <SegmentedButtons 
                value={src}
                onValueChange={(value) => {
                    setSrc(value)
                }}
                buttons={srcs.map((src : any) => {
                    return { label: src.server, value: src.url }
                })}
            />
            

        </View>
    )
}

export default Player
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 10
    },
    video: {
        height: 250,
        width: '100%',
        maxHeight: 250,
    },
    
})