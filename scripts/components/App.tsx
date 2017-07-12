// import is an example of JavaScript syntax new version
import * as React from 'react'; 
import * as ReactDOM from 'react-dom';
import { IAppCss as appcss } from '../../styles/app.css';
const styles: appcss = require('../../styles/app.css');

export default class App extends React.Component<any, any> {	
	render() {
		return (
			<span>
				<span className={styles.TestCssStyle}>Hello</span><span className={styles.TestCssFont}>... world</span>
			</span>
		);
	}
}