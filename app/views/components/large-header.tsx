import * as React from 'react'
import { shuffle } from '../../utils/shuffle'
import './large-header.css';

interface LargeHeaderState {
    subtitle: string
}

export class LargeHeader extends React.Component<{}, LargeHeaderState> {

    private subtitles = [
        "YOUR_SUBTITLE_HERE",
    ]

    constructor(props) {
        super(props)
        this.state = { subtitle: shuffle(this.subtitles) }
    }

    render() {
        return (
            <header id="frontpage-header">
                <div id="frontpage-welcome">
                    <div className="title">YOUR_HEADING_<span className="focus">HERE</span></div>
                    <div className="subtitle">{this.state.subtitle}</div>
                </div>

                <div className="nav-container">
                    <ul id="nav">
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/portfolio">Portfolio</a></li>
                        <li><a href="/about">About</a></li>
                    </ul>
                </div>
            </header>
        )
    }
}
