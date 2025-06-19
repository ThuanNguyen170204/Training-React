import "./App.css";
import React, { Component } from "react";
import Main from "./components/MainComponent";
import { BrowserRouter } from "react-router-dom";
import MyProvider from "./contexts/MyProvider";
import ChatWidget from "./chatbox/ChatWidget";
import ScrollToTop from "./ScrollToTop";
import FloatingContact from "./components/FloatingContact";
class App extends Component {
  render() {
    return (
      <MyProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Main />
          <ChatWidget />
          <FloatingContact />
        </BrowserRouter>
      </MyProvider>
    );
  }
}

export default App;
