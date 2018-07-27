import {action, computed, decorate, observable} from 'mobx';
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Temperature {
  id = Math.random();
  unit = 'C';
  temperatureCelsius = 25;
  constructor(degrees, unit) {
    this.setTemperatureAndUnit(degrees, unit);
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
}
decorate(Temperature, {
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
temps.push(new Temperature(20, 'K'));
temps.push(new Temperature(25, 'F'));
temps.push(new Temperature(20, 'C'));

const App = observer(({ temperatures }) => (
  <ul>
    {temperatures.map(t =>
      <TView key={t.id} temperature={t} />
    )}
    <DevTools />
  </ul>
));

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
        {t.temperature}
      </li>
    )
  };
});

ReactDOM.render(<App temperatures={temps} />, document.getElementById('root'));
