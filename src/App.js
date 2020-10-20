import React, { Component } from "react";
import "./App.css";

import axios from "axios";

import "antd/dist/antd.css";
import { Input } from "antd";
const { Search } = Input;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      montrealWeather: {},
      cityName: "",
    };
  }

  componentDidMount() {
    this.getCityLocationByName("montreal");
  }

  getCityLocationByName = (cityName) => {
    this.setState({ cityName: cityName });
    const cityLookupUrl = "https://geoapi.qweather.com/v2/city/lookup?";

    // get location
    axios
      .get(cityLookupUrl, {
        params: {
          key: "935d116f4c384dec9ac8e88bdba1319d",
          location: cityName,
          lang: "en",
        },
      })
      .then((response) => {
        // this.setState({ montrealWeather: response.data.now });
        console.log(response.data.location[0]);
        this.getWeatherDataByLocation(
          response.data.location[0].lon + "," + response.data.location[0].lat
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  getWeatherDataByLocation = (location) => {
    const weatherUrl = "https://devapi.qweather.com/v7/weather/now?";

    // get weather by location
    axios
      .get(weatherUrl, {
        params: {
          key: "935d116f4c384dec9ac8e88bdba1319d",
          location: location,
          lang: "en",
        },
      })
      .then((response) => {
        this.setState({ montrealWeather: response.data.now });
        console.log(response.data.now);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  onSearch = (value) => {
    this.getCityLocationByName(value);
  };

  render() {
    return (
      <div className="App">
        <h1>Météo</h1>
        <Search
          placeholder="input city name"
          onSearch={this.onSearch}
          style={{ width: 200 }}
        />
        <div>City: {this.state.cityName}</div>
        <div>Temperature: {this.state.montrealWeather.temp}℃</div>
        <div>Feels like: {this.state.montrealWeather.feelsLike}℃</div>
        <div>Outside: {this.state.montrealWeather.text}</div>
        <div>Pressure: {this.state.montrealWeather.pressure}</div>
        <div>Visibility: {this.state.montrealWeather.vis}</div>
        <div>Observe time: {this.state.montrealWeather.obsTime}</div>
      </div>
    );
  }
}
