import { StyleSheet, View, ImageBackground, Image } from 'react-native'
import { Stack } from 'expo-router'
import { Button, Card, Chip, Divider, Text } from 'react-native-paper'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { MovieSrc, MovieX, getMovieData, getMovieSources } from '../../utils/db'
import { ScrollView } from 'react-native-gesture-handler'
import { theme } from '../../style/theme'
import { router } from 'expo-router';
import Loading from '../../components/Loading'

const MoviePage = () => {
    const { id } = useLocalSearchParams()
    const [movieData, setMovieData] = React.useState({} as MovieX)
    const { cast, imdb, recommandations, result, similars } = movieData
    const [sources, setSources] = React.useState([] as MovieSrc)

    const [loading, setLoading] = React.useState(true)


    useEffect(() => {
        console.log(id)
        getMovieData(id as string).then((res) => {
            setMovieData(res)
            setLoading(false)
        })
    }, [id])

    useEffect(() => {
        const sources = getMovieSources(id as string, imdb)
        setSources(sources)
    }, [imdb, id])

    if (loading) {
        return <Loading />
    }

    return (
        <ScrollView style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            padding: 10
        }}>
            <Stack.Screen options={{
                title: 'xpWatch',
                headerTitle: result?.title ?? 'Movie',
            }} />
            <ImageBackground source={{ uri: `https://image.tmdb.org/t/p/original${result?.backdrop_path}` }} style={{ width: '100%', height: 500 }}>
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: "rgba(0,0,0,.6)" }}>
                    <Image source={{ uri: `https://image.tmdb.org/t/p/w500${result?.poster_path}` }} style={{ width: 200, height: 300 }} />
                    <Button mode="contained" style={{ marginVertical: 10 }} onPress={() => {
                        console.log(sources)
                        router.push({
                            pathname: 'player',
                            params: {
                                sources: JSON.stringify(sources),
                                title: result?.title ?? '',
                                poster: `https://image.tmdb.org/t/p/w500${result?.poster_path}`,
                            }
                        })
                    }}>
                        Watch Now
                    </Button>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
                    </View>
                </View>
            </ImageBackground>
            <Text variant='headlineMedium' >{result?.title}</Text>
            <Text variant='bodyLarge' >{result?.tagline}</Text>
            <Divider style={{ marginVertical: 6, }} bold />
            <Text variant='labelLarge' >{result?.release_date.toString() ?? ''} - {result?.runtime ?? 0} mins </Text>
            <Text variant='labelLarge' >{result?.vote_average ?? 0} / 10</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
                {result?.genres?.map((genre) => {
                    return <Chip mode='outlined' style={{ margin: 2 }}>{genre.name}</Chip>
                })}
            </View>
            <Text variant='bodySmall' >{result?.overview}</Text>

            <Text variant='labelLarge' >Cast</Text>
            <Divider style={{ marginVertical: 6, }} bold />
            <ScrollView horizontal style={{ flexDirection: 'row', marginVertical: 10, gap: 4 }}>
                {cast?.map((actor) => {
                    return <Card style={{ margin: 5, width: 180 }} onPress={() => {

                    }}>
                        <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w500${actor.profile_path}` }} />
                        <Card.Content>
                            <Text variant='labelLarge' >{actor.name}</Text>
                            <Text variant='bodySmall' >{actor.character}</Text>
                        </Card.Content>
                    </Card>
                })}
            </ScrollView>

            <Text variant='labelLarge' >Recommandations</Text>
            <Divider style={{ marginVertical: 6, }} bold />
            <ScrollView horizontal style={{ flexDirection: 'row', marginVertical: 10, gap: 4 }}>
                {recommandations?.sort((a, b) => b.vote_average - a.vote_average).map((movie) => {
                    return <Card style={{ margin: 5, width: 180, }} onPress={() => {
                        router.push('movie/' + movie.id)
                    }} >
                        <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} />
                        <Card.Content>
                            <Text variant='labelLarge' >{movie.title}</Text>
                        </Card.Content>
                    </Card>
                }
                )}
            </ScrollView>

            <Text variant='labelLarge' >Similar</Text>
            <Divider style={{ marginVertical: 6, }} bold />
            <ScrollView horizontal style={{ flexDirection: 'row', marginVertical: 10, gap: 4 }}>
                {similars?.sort((a, b) => b.vote_average - a.vote_average).map((movie) => {
                    return <Card style={{ margin: 5, width: 180, }} onPress={() => {
                        router.push('movie/' + movie.id)
                    }} >
                        <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} />
                        <Card.Content>
                            <Text variant='labelLarge' >{movie.title}</Text>
                        </Card.Content>
                    </Card>
                }
                )}
            </ScrollView>


        </ScrollView>
    )
}

export default MoviePage

const styles = StyleSheet.create({})