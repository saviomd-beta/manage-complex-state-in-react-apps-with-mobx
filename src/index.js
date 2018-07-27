import {computed, decorate, observable} from 'mobx';
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Temperature {
  unit = 'C';
  temperatureCelsius = 25;
  temperatureKelvin() {
    console.log('calculating Kelvin');
    return this.temperatureCelsius * (9 / 5) + 32;
  }
  temperatureFahrenheit() {
    console.log('calculating Fahrenheit');
    return this.temperatureCelsius + 273.15;
  }
  temperature() {
    console.log('calculating temperature');
    switch (this.unit) {
      case 'K': return `${this.temperatureKelvin()}ºK`;
      case 'F': return `${this.temperatureFahrenheit()}ºF`;
      default: return `${this.temperatureCelsius}ºC`;
    }
  }
}
// decorate(Temperature, {
//   unit: observable,
//   temperatureCelsius: observable,
//   temperatureKelvin: computed,
//   temperatureFahrenheit: computed,
//   temperature: computed,
// })

const t = new Temperature();

const App = observer(({ temperature }) => (
  <div>
    {temperature.temperature()}
    <DevTools />
  </div>
));

ReactDOM.render(<App temperature={t} />, document.getElementById('root'));
