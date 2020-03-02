import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';

// import Home from './pages/home.page';
import ParticlesProjects from './pages/particlesprojects';

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" exact component={ParticlesProjects} />
				<Route path="/home" component={ParticlesProjects} />
				<Route path="/about" component={About} />
				<Route path="/users" component={Users} />

				<Route component={Error404} />
			</Switch>
		</Router>
	);
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

function Error404() {
	return <h2>ERROR PAGE</h2>;
  }

export default App;
