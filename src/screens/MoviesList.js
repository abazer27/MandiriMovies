import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useRoute } from '@react-navigation/native'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const MoviesList = ({ navigation }) => {
  const [getMovies, setMovies] = useState([])
  const [currentpage, setPage]= useState(1)
  const route = useRoute();
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOTQ0MTdiMzU2NjAzOTVlMWFmOWE4MTY1ODVhNDQ2ZSIsInN1YiI6IjY0ZGI1MzcwMDAxYmJkMDExZDkyNWVkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fGGuG-oe2PNr0FN_phKRehC3ZDcTFliMda5N05AEz6Y';
  const apiUrl = 'https://api.themoviedb.org/3/'
  const option = {
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  }
  const getMovieList = () => {
    axios.get(
      apiUrl + `discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentpage}&sort_by=popularity.desc&with_genres=${route.params.id}`, option
    ).then(response => {
      setMovies([...getMovies, ...response.data.results])
    })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    getMovieList()
    console.log(getMovies)
  },[currentpage])

  const renderMovies = ({ item }) => {
    return (
      <TouchableOpacity 
        style={{ flex: 1, flexDirection: 'column', padding: 4, alignItems: 'center', borderWidth: 2, borderColor: '#ddd'}}
        onPress={()=> navigation.navigate('DetailMovie', {id: item.id})}
      >
        <Image
          style={{ width: 80, height: 120 }}
          source={{ uri: `https://image.tmdb.org/t/p/original${item.poster_path}` }} />
        <Text style={{textAlign: 'center',fontWeight: 800}}>{item.title}</Text>
      </TouchableOpacity >)
  }
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

  return (
    <FlatList
      data={getMovies}
      renderItem={renderMovies}
      ListFooterComponent={loaderRender}
      onEndReached={loadItem}
      onEndReachedThreshold={0}
      numColumns={3}
    />
  )
}

export default MoviesList