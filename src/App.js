import React, { Component, useState } from "react";
import socketIOClient from "socket.io-client";

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      num1: 0,
      num2: 0,
      endpoint: 'http://localhost:3001/',
      highlight: 0
      //'http://192.168.68.105:4001/'
      // this is where we are connecting to with sockets,
    };

  }

  // count = (e) => {
  //   if (!isNaN(e.target.value)){
  //     this.setState({ counter: parseInt(e.target.value) });
  //   }
  //   else {
  //     this.setState({ counter: 0 });
  //   }
  // };

  focus = (e) => {
    // console.log('focused on:', e.target.name);
    this.socket.emit('incoming highlight', e.target.id)
  };

  blur = (e) => {
    this.socket.emit('incoming highlight', 0)
    this.sendData(e);

    // const field = document.getElementById(e.target.id);
    // field.style.outline = "";
  }

  sendData = (e) => {
    console.log('sending...');
    // console.log(e);
    this.socket.emit('incoming data', { [e.target.name]: e.target.value });
  }

  componentDidMount(){
    // console.log(this.state.counter);
    const {endpoint} = this.state;
    //Very simply connect to the socket
    this.socket = socketIOClient(endpoint, {transports: ['websocket']});
    //Listen for data on the "outgoing data" namespace and supply a callback for what to do when we get one. In this case, we set a state variable
    this.socket.on('outgoing data', data => {
      // console.log(data);
      for (let [key, value] of Object.entries(data)){
        // console.log(key, value);
        if (key in this.state){
          this.setState({[key]: value});
        }
      }
      // this.setState({response: data.num})
    });

    this.socket.on('outgoing highlight', fieldName => {
      // console.log(fieldName);
      console.log('hello');
      const field = document.getElementById(fieldName);
      if (field){
        console.log(field);
        field.style.outline = "yellow solid 5px";
      }
      else {
        for (let field of document.getElementsByTagName('input')){
          field.style.outline = "";
        }
      }
    });
    // console.log(this.socket);
    // setInterval(() => {
    //   let number = Math.round(Math.random()*10);
    //   console.log('Changed number to: ', number);
    //   this.socket.emit('incoming data', number);
    // }, 1000);
  }

  componentDidUpdate(){
    // console.log(this.state);
  }

  componentWillUnmount() {
    this.socket.off("outgoing data");
    this.socket.off("outgoing highlight");
  }

  render() {
    return (
      <div className="App">
        The count is: <br/>
        <h1>{this.state.counter}</h1><br/>

        <div className="App__fields">
          <div className="App__field">
            <div>num1</div>
            <input
              name="num1"
              id="num1"
              value={this.state.num1}
              onChange={e => this.setState({num1: e.target.value})}
              onFocus={e => this.focus(e)}
              onBlur={e => this.blur(e)}
              />
          </div>
          <div className="App__field">
            <div>num2</div>
            <input
              name="num2"
              id="num2"
              value={this.state.num2}
              onChange={e => this.setState({num2: e.target.value})}
              onFocus={e => this.focus(e)}
              onBlur={e => this.blur(e)}
              />
          </div>

        </div>
        <br/><br/>
        {/*<button onClick={e => this.setState({counter:this.state.counter+1})}>Increment</button>*/}
        <button onClick={e => this.sendData()}>send data</button>
        <br/><br/>
        This is the response:
        <h1>{this.state.response}</h1>
      </div>
    );
  }
}

export default App;
