import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { View, Text, Button, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoviesList from './src/screens/MoviesList';
import DetailMovie from './src/screens/DetailMovies';
import SQLite from 'react-native-sqlite-storage';

const Stack = createNativeStackNavigator();
const db = SQLite.openDatabase(
  {
    name: 'MainDB',
    location: 'default',
  },
  () => { },
  error => { console.log(error) }
);

function HomeScreen({ navigation }) {
  const [getGenre, setGenre] = useState([]);
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOTQ0MTdiMzU2NjAzOTVlMWFmOWE4MTY1ODVhNDQ2ZSIsInN1YiI6IjY0ZGI1MzcwMDAxYmJkMDExZDkyNWVkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fGGuG-oe2PNr0FN_phKRehC3ZDcTFliMda5N05AEz6Y';
  const apiUrl = 'https://api.themoviedb.org/3/'
  const option = {
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  }
  const getMovieGenres = () => {
    axios.get(
      apiUrl + 'genre/movie/list?language=en', option
    ).then(response => setGenre(response.data.genres))
      .catch((err) => console.log(err));
  }

  const renderMoviesGenre = () => {
    return getGenre.map((item) => <Text onPress={() => navigation.navigate('MoviesList', { id: item.id })} key={item.id} style={{ margin: 1, padding: 5, borderColor: '#ddd', borderWidth: 2, width: '100%', textAlign: 'center', fontWeight: 800 }}>{item.name}</Text>)
  }
  useEffect(() => {
    getMovieGenres()
  }, [])

  const getMovie = () => {
    Alert.alert('Check Console')
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT Name FROM Movies",
          [],
          (tx, results) => {
            let len = results.rows.length;
            console.log(len)
            if (len > 0) {
              let name = results.rows.item(0)
              console.log(name)
            }
            else {
              console.log('add movie first')
            }
          }
        )
      })
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ paddingBottom: 20, fontSize: 35, fontWeight: 800 }}>Select Genre</Text>
      {renderMoviesGenre()}
      <View style={{paddingTop: 5}}>
        <Button
          title="Your Favorite Movies"
          onPress={getMovie}
          color="#841584"
        />
      </View>
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Movies" component={HomeScreen} />
        <Stack.Screen name="MoviesList" component={MoviesList} id />
        <Stack.Screen name="DetailMovie" component={DetailMovie} id />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
