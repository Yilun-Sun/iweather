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
      days7Weather: [{}, {}, {}, {}, {}, {}, {}],
      hours24Weather: [],
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
        this.getWeatherDataByLocation(response.data.location[0].lon + "," + response.data.location[0].lat);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  getWeatherDataByLocation = (location) => {
    const weatherUrl = "https://devapi.qweather.com/v7/weather/";
    const nowPostfix = "now?";
    // const hours24Postfix = "24h?";
    const days7Postfix = "7d?";
    // get weather by location
    axios
      .get(weatherUrl + nowPostfix, {
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

    axios
      .get(weatherUrl + days7Postfix, {
        params: {
          key: "935d116f4c384dec9ac8e88bdba1319d",
          location: location,
          lang: "en",
        },
      })
      .then((response) => {
        // this.setState((prevState) => {
        //   let days7 = Object.assign({}, prevState.days7Weather);
        //   days7 = response.data.daily;
        //   // days7Postfix: response.data.daily
        //   return days7;
        // });
        this.setState({ days7Weather: response.data.daily });
        console.log(response.data.daily);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  onSearch = (value) => {
    this.getCityLocationByName(value);
    // set the dimensions and margins of the graph
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
            alt=""
            src={require(`./weather-icon-S1/cute-512/${this.state.weatherIcon}.png`)}
            style={{ width: "200px", height: "200px" }}
          />
          <div style={{ lineHeight: "80px", fontSize: "60px", padding: "60px" }}>{this.state.cityWeather.temp} ℃</div>
        </div>

        <div>Feels like: {this.state.cityWeather.feelsLike} ℃</div>
        <div>Outside: {this.state.cityWeather.text}</div>
        <div>Pressure: {this.state.cityWeather.pressure}</div>
        <div>Visibility: {this.state.cityWeather.vis} km</div>
        <div id="my_dataviz"></div>
        {/* style={{ display: myVar ? 'block' : 'none' }} */}
        <div className="days-7-container" style={{ display: this.state.days7Weather[0].tempMax ? "flex" : "none" }}>
          <DayCard data={this.state.days7Weather[0]} index={0}></DayCard>
          <DayCard data={this.state.days7Weather[1]} index={1}></DayCard>
          <DayCard data={this.state.days7Weather[2]} index={2}></DayCard>
          <DayCard data={this.state.days7Weather[3]} index={3}></DayCard>
          <DayCard data={this.state.days7Weather[4]} index={4}></DayCard>
          <DayCard data={this.state.days7Weather[5]} index={5}></DayCard>
          <DayCard data={this.state.days7Weather[6]} index={6}></DayCard>
        </div>
      </div>
    );
  }
}

const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DayCard = (props) => {
  var curDay = new Date();
  curDay.setDate(curDay.getDate() + props.index);
  const dayOfWeek = daysOfTheWeek[curDay.getDay()];
  return (
    <div className="day-card">
      <div className="date">{dayOfWeek}</div>
      <div className="weather">{props.data.textDay}</div>
      <div className="temp">
        <span className="high">{props.data.tempMax}℃</span> <span>/</span>{" "}
        <span className="low">{props.data.tempMin}℃</span>
      </div>
    </div>
  );
};
