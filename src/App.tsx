import { App, View } from 'framework7-react';
import 'framework7/css/bundle';
import './theme/variables.css';

import HomePage from './features/home';

const routes = [
  { path: '/', component: HomePage },
];

const TrivoApp: React.FC = () => (
  <App theme="ios" routes={routes}>
    <View main url="/" />
  </App>
);

export default TrivoApp;
