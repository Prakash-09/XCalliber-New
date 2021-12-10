import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from './components/header/Header';
import Home from './components/content/home/Home';

export default class App extends React.Component {
    // constructor(props) {
    //     super(props);

    //     this.state = {

    //     }
    // }
    // routeData(data) {
    //     console.log("dataa", data)
    // }
    render() {
        return (
            <div className="App">
                <Router>
                    <Header />
                    <Route path="/" render={(props) => (<Home {...props}
                    // handleRouteData={this.routeData.bind(this)}
                    />)} />
                </Router>
            </div>
        );
    }
}