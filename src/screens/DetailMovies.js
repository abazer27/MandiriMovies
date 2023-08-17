import { View, Text, FlatList, Image, ImageBackground, Button, ActivityIndicator, SafeAreaView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import axios from 'axios'
import YoutubePlayer from "react-native-youtube-iframe";
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'MainDB',
    location: 'default',
  },
  () => { },
  error => { console.log(error) }
);

const DetailMovies = () => {
  const [detail, setDetail] = useState([])
  const [review, setReview] = useState()
  const [trailer, setTrailer] = useState([])
  const [currentpage, setPage] = useState(1)
  const [nameMovie, setName] = useState('a')
  const [idMovie, setId] = useState('a')
  const route = useRoute();
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOTQ0MTdiMzU2NjAzOTVlMWFmOWE4MTY1ODVhNDQ2ZSIsInN1YiI6IjY0ZGI1MzcwMDAxYmJkMDExZDkyNWVkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fGGuG-oe2PNr0FN_phKRehC3ZDcTFliMda5N05AEz6Y';
  const apiUrl = 'https://api.themoviedb.org/3/'
  const option = {
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  }
  const detailMovie = () => {
    axios.get(
      apiUrl + `movie/${route.params.id}?language=en-US`, option
    ).then(response => {
      setDetail(response.data)
      setName(response.data.title)
      setId(response.data.id)
    })
      .catch((err) => console.log(err));
  }

  const reviewMovie = () => {
    axios.get(
      apiUrl + `movie/${route.params.id}/reviews?language=en-US&page=${currentpage}`, option
    ).then(response => {
      setReview(response.data.results)
    })
      .catch((err) => console.log(err));
  }

  const trailerMovie = () => {
    axios.get(
      apiUrl + `movie/${route.params.id}/videos?language=en-US`, option
    ).then(response => {
      setTrailer(response.data.results[1])
    })
      .catch((err) => console.log(err));
  }

  const gotParamsMovie = () => {
    trailerMovie();
    detailMovie();
    reviewMovie();
  }
  useEffect(() => {
    gotParamsMovie();
    createTable();
  }, [currentpage])

  const loaderRender = () => {

    return (
      <View>
        <ActivityIndicator size={'large'} color={'#aaa'} style={{ margin: 16, alignItems: 'center' }} />
      </View>
    )
  }

  const loadItem = () => {
    setPage(currentpage + 1)
  }

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS "
        + "Movies"
        + "(ID INTEGER PRIMARY KEY, Name varchar(255));"
      )
    })
  }

  const setMovie = async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "INSERT INTO Movies (ID, Name) VALUES ('" + idMovie + "','" + nameMovie + "')",
        );
        Alert.alert('Added to favorite')
      })
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
      <YoutubePlayer
        height={300}
        play={true}
        videoId={trailer?.key}
        key={trailer.id}
      />
      <View style={{ marginTop: -55 }}>
        <Image
          style={{ width: 150, height: 180, alignSelf: 'center' }}
          source={{ uri: `https://image.tmdb.org/t/p/original${detail.poster_path}` }} />
        <Text style={{ textAlign: 'center', fontWeight: 800 }}>Title</Text>
        <Text style={{ textAlign: 'center' }}>{detail.title}</Text>
        <Text style={{ textAlign: 'center', fontWeight: 800 }}>Synopsis</Text>
        <Text style={{ textAlign: 'justify' }}>{detail.overview}</Text>
        <ImageBackground
          style={{ width: 70, height: 70, alignSelf: 'flex-end', margin: -10 }}
          source={require('../assets/star.png')}>
          <Text style={{ alignSelf: 'center', marginTop: 25, fontWeight: 800 }}>{detail.vote_average}</Text>
        </ImageBackground>
        <Button
          title="Add to favorite"
          onPress={setMovie}
        />
      </View>
      <Text style={{ alignSelf: 'center', fontWeight: 800, fontSize: 20, marginTop: 5 }}>Review</Text>
      <FlatList
        data={review}
        renderItem={({ item }) =>
          <View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Image
                style={{ width: 25, height: 25 }}
                source={{ uri: `https://image.tmdb.org/t/p/original${item.author_details.avatar_path}` }}
              />
              <Text>{item.author_details.name}</Text>
            </View>
            <Text style={{ marginLeft: 30, marginRight: 30, marginBottom: 30, textAlign: 'justify', borderColor: '#ddd', borderWidth: 1, padding: 10 }}>
              {item.content}
            </Text>
          </View>
        }
        ListFooterComponent={loaderRender}
        onEndReached={loadItem}
        onEndReachedThreshold={0}
      />
    </SafeAreaView>
  )
}

export default DetailMovies