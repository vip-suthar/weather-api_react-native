import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';

// vis https://openweathermap.org/api to get API Keys.
const API_KEY = "79a66d36cd902abff8647cae058f2a45";

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export default function App() {
  const [city, setCity] = useState("...Loading");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if(!granted) { // if location permission is granted
        setOk(false);
      }
      Location.setGoogleApiKey('AIzaSyAdBvn3eGqxvDLTcNo22TVPoBpn3KGXJgA');
      const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
      // latitude, longitude as reverse geocoding
      const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
      setCity(location[0].region);
      const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
       );
      const json = await response.json();
      setDays(json.daily);
    };
  // After Rendering ask use useEffect to fetch data using API
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text>
                  {new Date(day.dt * 1000).toString().substring(0, 10)}
              </Text>
              <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(1)}
              </Text>
              <Text style={styles.des}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: "tomato",
  },
  city:{
    flex: 1.2,
    justifyContent: 'center',
    alignItems:'center',
  },  
  cityName:{
    fontSize: 68,
    fontWeight: "500",
  },
  weather:{
  
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems:'center',
    
  },
  temp: {
    marginTop: 50,
    fontSize: 178,
  },
  desc: {
    marginTop: -30,
    fontSize: 60,
  },
  tinyText: {
    fontSize: 20,
  },
});
