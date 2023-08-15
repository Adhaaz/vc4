import { StyleSheet, View, FlatList, Pressable } from 'react-native'
import React from 'react'
import { Media } from '../../types/media'
import { Card, Divider, Menu, Text } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TV } from '../../types/tv';
import { Movie } from '../../types/movie';
import { Anime } from '../../types/anime';
import { router } from 'expo-router';

type Props = {
    data: Array<Media | Anime>
    name?: string
}

const List = ({ data, name }: Props) => {
    return (
        <View>
            <Text variant='labelLarge'>{name ?? "Trending"}</Text>
            <Divider style={{ marginVertical: 6, }} bold />
            <FlatList data={data} renderItem={({ item }) =>
                !isAnime(item) ? <ItemView item={item as Media} /> : <AnimeItemView item={item as Anime} />
            } />
        </View>
    )
}

export default List



function ItemView({ item }: { item: Media }) {
    const { title, name, poster_path, media_type, release_date, first_air_date, id } = item
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    function _onPress() {
        console.log(id, title ?? name ?? '')
        if (media_type === 'movie') {
            router.push('movie/' + id)
        } else if (media_type === 'tv') {
            router.push({
                params : { id : id },
                pathname : 'tv'
            })
        }
    }

    return (
        // Flat List Item
        <>
            <Card style={{ margin: 5 }}>
                <Pressable onLongPress={(e) => {
                    console.log(item)
                }} onPress={_onPress} >
                    <Card.Cover source={{ uri: `https://image.tmdb.org/t/p/w500${poster_path}` }} />
                </Pressable>
                <Card.Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 4 }}>
                                <MaterialIcons name={media_type} size={20} color={'white'} />
                                <Text>  {title ?? name ?? ''} </Text>
                            </View>
                            <Text>{getYear(release_date ?? first_air_date)}</Text>
                        </View>
                        <Menu visible={visible} onDismiss={closeMenu} anchor={
                            <MaterialCommunityIcons onPress={openMenu} name="dots-vertical" size={24} color="#fff" />
                        }>
                            <Menu.Item onPress={() => {

                            }} title="Add to Favorites" />
                            <Menu.Item onPress={() => { }} title="Watched Already" />
                        </Menu>
                    </View>
                </Card.Content>
            </Card>
        </>


    );
}

function AnimeItemView({ item }: { item: Anime }) {
    const { id, title, year, bannerImage, coverImage, slug, currentEpisode } = item
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    function _onPress() {
        console.log(id, title.userPreferred)
        router.push({
            params : { id : slug },
            pathname : 'anime'
        })
    }

    return (
        <>
            <Card style={{ margin: 5 }}>
                <Pressable onLongPress={(e) => {
                    console.log(item)
                }} onPress={_onPress} >
                    <Card.Cover source={{ uri: coverImage ?? bannerImage}} />
                </Pressable>
                <Card.Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 4 }}>
                                <MaterialIcons name={'tv'} size={20} color={'white'} />
                                <Text>  {title.english ?? title.userPreferred} </Text>
                            </View>
                            <Text>{year} ({currentEpisode})</Text>
                        </View>
                        <Menu visible={visible} onDismiss={closeMenu} anchor={
                            <MaterialCommunityIcons onPress={openMenu} name="dots-vertical" size={24} color="#fff" />
                        }>
                            <Menu.Item onPress={() => {

                            }} title="Add to Favorites" />
                            <Menu.Item onPress={() => { }} title="Watched Already" />
                        </Menu>
                    </View>
                </Card.Content>
            </Card>
        </>
    );
}


function getYear(date: Date | undefined) {
    if (!date) return ''
    return new Date(date).getFullYear() ?? ''
}

function isAnime(item: Media | Anime): item is Anime {
    return (item as Anime).slug !== undefined;
}