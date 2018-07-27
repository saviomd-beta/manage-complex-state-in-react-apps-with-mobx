import {action, computed, decorate, observable} from 'mobx';
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const APPID = '6c9bb64443d124019b41ea00de26732e';

class Temperature {
  id = Math.random();
  unit = 'C';
  temperatureCelsius = 25;
  loading = true;
  location = 'Amsterdam, NL';
  constructor(location) {
    this.location = location;
    this.fetch();
  }
  get temperatureKelvin() {
    console.log('calculating Kelvin');
    return this.temperatureCelsius * (9 / 5) + 32;
  }
  get temperatureFahrenheit() {
    console.log('calculating Fahrenheit');
    return this.temperatureCelsius + 273.15;
  }
  get temperature() {
    console.log('calculating temperature');
    switch (this.unit) {
      case 'K': return `${this.temperatureKelvin}ºK`;
      case 'F': return `${this.temperatureFahrenheit}ºF`;
      default: return `${this.temperatureCelsius}ºC`;
    }
  }
  setUnit(newUnit) {
    this.unit = newUnit;
  }
  setCelsius(degrees) {
    this.temperatureCelsius = degrees;
  }
  setTemperatureAndUnit(degrees, unit) {
    this.setCelsius(degrees);
    this.setUnit(unit);
  }
  inc() {
    this.setCelsius(this.temperatureCelsius + 1);
  }
  fetch() {
    window.fetch(`http://api.openweathermap.org/data/2.5/weather?appid=${APPID}&q=${this.location}`)
      .then(res => res.json())
      .then(action(json => {
        console.log(json);
        this.temperatureCelsius = (json.main.temp - 273.15);
        this.loading = false;
      }))
  }
}
decorate(Temperature, {
  fetch: action,
  loading: observable,
  location: observable,
  setCelsius: action,
  setTemperatureAndUnit: action,
  setUnit: action,
  unit: observable,
  temperatureCelsius: observable,
  temperatureKelvin: computed,
  temperatureFahrenheit: computed,
  temperature: computed,
})

const temps = observable([]);

const App = observer(({ temperatures }) => (
  <ul>
    <TemperatureInput temperatures={temperatures} />
    {temperatures.map(t =>
      <TView key={t.id} temperature={t} />
    )}
    <DevTools />
  </ul>
));

const TemperatureInput = observer(class TemperatureInput extends Component {
  input = '';
  onChange = (e) => {
    this.input = e.target.value;
  }
  onSubmit = () => {
    this.props.temperatures.push(
      new Temperature(this.input)
    );
    this.input = '';
  }
  render() {
    return (
      <li>
        Destination:
        <input onChange={this.onChange} value={this.input} />
        <button onClick={this.onSubmit}>Add</button>
      </li>
    )
  }
})
decorate(TemperatureInput, {
  input: observable,
  onChange: action,
})

const TView = observer(class TView extends Component {
  onTemperatureClick = () => {
    this.props.temperature.inc();
  }
  render () {
    const t = this.props.temperature;
    return (
      <li
        key={t.id}
        onClick={this.onTemperatureClick}
      >
        {t.location}:
        {t.loading ? 'loading...' : t.temperature}
      </li>
    )
  };
});

ReactDOM.render(<App temperatures={temps} />, document.getElementById('root'));
