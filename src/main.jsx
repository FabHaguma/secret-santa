// src/main.jsx
import { h, render } from 'preact';
import App from './components/App'; // Ensure path is correct
import './styles/global.css'; // Optional: for truly global styles like body font-family

render(<App />, document.getElementById('app'));