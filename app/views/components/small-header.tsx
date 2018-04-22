import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './small-header.css'

export class SmallHeader extends React.Component {
    render() {
        return <header id="smaller-header">
            <div className="header-container">
                <h1 id="smaller-title"><a href="/">xyz-blog</a></h1>
                <ul id="small-nav">
                    <li><a href="/blog">Blog</a></li>
                    <li><a href="/portfolio">Portfolio</a></li>
                    <li><a href="/about">About</a></li>
                </ul>
            </div>
        </header>
    }
}
