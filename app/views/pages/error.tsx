import * as React from 'react'
import { MetadataProps } from '../components/metadata'
import './error.css'

interface ErrorPageProps {
    message: string
    err?: Error
}

export class ErrorPage extends React.Component<ErrorPageProps> {

    constructor(props: ErrorPageProps) {
        super(props)
    }

    meta(): MetadataProps {
        return { title: ['Error: ' + this.props.message, 'xyz-blog'] }
    }

    render() {
        return <div className="error-page">
            <div className="error-info">
                <h1>Ohnoes!</h1>
                <p>
                    {this.props.message}
                </p>
                {
                    this.props.err && <pre>{JSON.stringify(this.props.err, null, 4)}</pre>
                }
                <p>
                    You can go back to the home page <a href="/">here</a> or click back on your browser.
            </p>
            </div>
        </div>
    }
}
