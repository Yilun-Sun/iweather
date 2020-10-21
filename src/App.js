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
      cityWeather: {},
      weatherIcon: 100,
      cityName: "",
    };
  }

  componentDidMount() {
    // document.getElementById("citySearch").value = '';
    this.getCityLocationByName("montreal");
  }

  getCityLocationByName = (cityName) => {
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
        // this.setState({ cityWeather: response.data.now });
        // console.log(response.data.location[0]);
        this.setState({ cityName: response.data.location[0].name });
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
        this.setState({ weatherIcon: response.data.now.icon });
        this.setState({ cityWeather: response.data.now });
        // console.log(response.data.now);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  onSearch = (value) => {
    this.getCityLocationByName(value);
  };

  render() {
    // const image = require(`${this.state.cityWeather.icon}`)
    // console.log(this.state.cityWeather.icon);
    // const image = require(`./weather-icon-S1/color-256/${this.state.cityWeather.icon}.png`)

    return (
      <div className="App">
        <div
          style={{
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h1>Météo</h1>
          <Search
            placeholder="input city name"
            onSearch={this.onSearch}
            style={{ width: 200, margin: "5px" }}
            allowClear="true"
            id="citySearch"
          />
        </div>

        <h1>{this.state.cityName}</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={require(`./weather-icon-S1/color-256/${this.state.weatherIcon}.png`)}
            style={{ width: "200px", height: "200px" }}
          />
          <div style={{ lineHeight: "80px", fontSize: '60px', padding: '60px' }}>
            {this.state.cityWeather.temp} ℃
          </div>
        </div>

        <div>Feels like: {this.state.cityWeather.feelsLike} ℃</div>
        <div>Outside: {this.state.cityWeather.text}</div>
        <div>Pressure: {this.state.cityWeather.pressure}</div>
        <div>Visibility: {this.state.cityWeather.vis} km</div>
        <div>Observe time: {this.state.cityWeather.obsTime}</div>
      </div>
    );
  }
}
