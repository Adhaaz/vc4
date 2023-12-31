import { Anime, AnimeRes } from "../types/anime";
import { AnimeDetail } from "../types/animeDetail";
import { MovieDetail } from "../types/movieDetail";
import { animeAPI, animeX, m, movieAPI, t, tv, tvAPI } from "./constants"


export async function getAnimeData(id : string, episode = 1) {
    try {
        const res = await (await fetch(animeX.anime(id))).json() as AnimeDetail;
        const recents = await (await fetch(animeX.recent(1))).json() as AnimeRes;
        // const recommandation = recents.data.map(x => x.anime)

        // console.log('animeDB', res, recents);

        const { relations: similar, mappings: external_ids, episodes, mappings } = res;

        const sources = episodes?.find(ep => ep.number === episode)?.sources;

        delete res.lastChecks;
        delete res.relations;
        delete res.episodes;

        const similars = similar?.map(item => ({ ...item.anime, media_type: 'anime', type: item.type }));
        // const recommandations = recommandation.map(item => ({ ...item, media_type: 'anime' }))

        return {
            result: res,
            external_ids,
            episodes,
            mappings,
            similars,
            // recommandations,
            sources,
        }
    } catch (error) {
        console.error(error)
        return {
            result: testAnimeData,
            external_ids: {},
            episodes: testAnimeData.episodes,
            mappings: {},
            similars: [],
            // recommandations: [],
            sources: []
        }
    }
}

export const getEpisodeSources = async (sources) => {
    const links = await animeAPI(sources)
    const watchLinks = links.map(l => ({
        server: "AnimeX" + l.priority,
        quality: 'HD',
        title: 'Watch on AnimeX' + l.priority,
        url: l?.referer || '',
        type: 'embed',
        videoSrc: l?.url || '',
    }))
    return watchLinks;
}

export const testAnimeData = {
    id: '1',
    slug: 'not-found-111',
    coverImage: '/no-image.png',
    bannerImage: '/no-image.png',
    title: {
        romaji: 'Anime Name',
        english: 'Anime Name',
        native: 'Anime Name',
        userPreferred: 'Anime Name'
    },
    description: 'This is the description of the anime',
    season: 'WINTER',
    currentEpisode: 1000,
    duration: 24,
    status: 'RELEASING',
    genre: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Shounen'],
    synonyms: ['One Piece', 'One Piece', 'ワンピース', 'One Piece'],
    averageScore: 100,
    popularity: 100,
    episodes: [
        {
            id: '1',
            number: 1,
            title: 'Episode 1',
            discription: 'The story follows the adventures of Monkey',
            sources: [
                {
                    id: '1',
                    target: '/'
                }
            ],
            image: '/no-image.png',
        }
    ],
}

export const getTVData = async (id, seasonID = 1, episodeID = 1) => {
    try {
        const res = await (await fetch(t(id))).json();
        const { recommendations: recommandation, credits: credit, similar, external_ids } = res;
        delete res.recommendations;
        delete res.credits;
        delete res.similar;

        const recommandations = recommandation.results.map(item => ({ ...item, media_type: 'tv' }));
        const similars = similar.results.map(item => ({ ...item, media_type: 'tv' }));

        return {
            result: res,
            recommandations,
            similars,
            cast: credit.cast,
            imdb: external_ids.imdb_id,
            external_ids
        }
    } catch (error) {
        console.error(error)
    }
}

export const getTVSeasonData = async (id, seasonID = 1) => {
    const season = await (await fetch(tv.season(id, seasonID))).json();
    return season;
}

/**
 * 
 * @param {string} id 
 * @param {number} seasonID 
 * @param {number} episodeID 
 * @param {string} imdb_id
 * @returns 
 */
export const getTVSeasonEpisodeSources = async (id : string, seasonID = 1, episodeID = 1, imdb_id : string) => {
    try {
        const watchLinks = [
            {
                server: "2embed",
                quality: 'HD',
                title: 'Watch on 2embed',
                url: `https://2embed.org/embed/series?tmdb=${id}&sea=${seasonID}&epi=${episodeID}`
            }, {
                server: "VidSrc",
                quality: 'HD',
                title: 'Watch on VidSrc',
                url: `https://v2.vidsrc.me/embed/${imdb_id}/${seasonID}-${episodeID}/`
            }, {
                server : "FireSonic",
                quality : 'HD',
                title : 'Watch on FireSonic',
                url : `https://firesonic.sc/serie.php?imdb=${imdb_id}&s=${seasonID}&e=${episodeID}`
            }
        ]

        return watchLinks;
    } catch (error) {
        console.error(error)
    }
}

export const getMovieData = async (id : string) => {
    console.log('movie', m(id));
    const res = await (await fetch(m(id))).json() as MovieDetail;
    const { recommendations: recommandation, credits: credit, similar, external_ids } = res;


    delete res.recommendations;
    delete res.credits;
    delete res.similar;

    return {
        result: res as MovieDetail | undefined,
        cast: credit?.cast,
        recommandations: recommandation?.results.map(item => ({ ...item, media_type: 'movie' })),
        similars: similar?.results.map(item => ({ ...item, media_type: 'movie' })),
        imdb: external_ids.imdb_id,
        external_ids,
    }
}

export type MovieX = Awaited<ReturnType<typeof getMovieData>>;

export const getMovieSources =  (id : string, imdb_id : string) => {
    const watchLinks = [
        {
            server : "FireSonic",
            quality : 'HD',
            title : 'Watch on FireSonic',
            url : `https://firesonic.sc/movie.php?imdb=${imdb_id}`
        },
        {
            server: "VidSrc",
            quality: 'HD',
            title: 'Watch on VidSrc',
            url: `https://v2.vidsrc.me/embed/${imdb_id}`
        },
        {
            server: "2embed",
            quality: 'HD',
            title: 'Watch on 2embed',
            url: `https://2embed.org/embed/series?tmdb=${id}`
        }, 
    ]
    return watchLinks;
}

export type MovieSrc = Awaited<ReturnType<typeof getMovieSources>>;
