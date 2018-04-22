import * as React from 'react'
import * as ReactDOM from 'react-dom'

export class Footer extends React.Component {
    state = { year: new Date().getFullYear() }

    render() {
        return <footer id="footer">
            <div className="footer-content">
                <h2>Fine print</h2>
                <p>YOUR_FOOTER_HERE</p>
            </div>
        </footer>
    }
}
