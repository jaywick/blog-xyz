import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Footer } from '../components/footer'
import { SmallHeader } from '../components/small-header'
import { publicImgUrl } from '../../transforms/feature-image-url';
import './base.css'

export class AboutPage extends React.Component {

    render() {
        return <div id="about-page">
            <SmallHeader />

            <div className="about-info">
                <h1>About me</h1>
                <p>
                    YOUR STORY HERE
                </p>

                <ul className="external-links">
                    <li>
                        <a href="https://github.com/jaywick/xyz-blog">
                            repo
                        </a>
                    </li>
                    <li>
                        <a href="https://jaywick.xyz">
                            jaywick-xyz
                        </a>
                    </li>
                </ul>

            </div>

            <Footer />
        </div>
    }
}
