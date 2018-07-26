import {decorate, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const appState = observable({
  count: 0
})
appState.decrement = function() {
  this.count--;
}
appState.increment = function() {
  this.count++;
}

const Counter = observer(class Counter extends Component {
  handleDec = () => {
    this.props.store.decrement();
  }
  handleInc = () => {
    this.props.store.increment();
  }
  render () {
    return (
      <div>
        Counter: {this.props.store.count}<br />
        <button onClick={this.handleDec}>-</button>
        <button onClick={this.handleInc}>+</button>
      </div>
    )
  }
})

decorate(Counter, {
  count: observable,
});

ReactDOM.render(<Counter store={appState} />, document.getElementById('root')
);
