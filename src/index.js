import {computed, decorate, observable} from 'mobx';
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Temperature {
  id = Math.random();
  unit = 'C';
  temperatureCelsius = 25;
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
      case 'K': return `${this.temperatureKelvin()}ºK`;
      case 'F': return `${this.temperatureFahrenheit()}ºF`;
      default: return `${this.temperatureCelsius}ºC`;
    }
  }
}
decorate(Temperature, {
  unit: observable,
  temperatureCelsius: observable,
  temperatureKelvin: computed,
  temperatureFahrenheit: computed,
  temperature: computed,
})

const temps = observable.map({
  'Amsterdam': new Temperature(),
  'Rome': new Temperature(),
});

const App = observer(({ temperature }) => (
  <div>
    {Array.from(temperature.keys(), city =>
      <div key={city}>{city}: {temperature.get(city).temperature}</div>
    )}
    <DevTools />
  </div>
));

ReactDOM.render(<App temperature={temps} />, document.getElementById('root'));
