import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Footer } from '../components/footer'
import { SmallHeader } from '../components/small-header'
import { MetadataProps } from '../components/metadata'
import './base.css'

class ProjectPageProps {
    title: string
    subtitle: string
    bodyHtml: string
    firstImage: string
}

export class ProjectPage extends React.Component<ProjectPageProps> {

    constructor(props: ProjectPageProps) {
        super(props)
    }

    meta(): MetadataProps {
        return {
            title: [this.props.title, 'Portfolio', 'xyz-blog'],
            image: this.props.firstImage,
            summary: this.props.subtitle,
        }
    }

    render() {
        return <div>
            <SmallHeader />

            <div className="portfolio-project">
                <h1 className="blog-title">{this.props.title}</h1>
                <h3 className="project-subtitle">{this.props.subtitle}</h3>
                <p dangerouslySetInnerHTML={{ __html: this.props.bodyHtml }}></p>
            </div>
            <Footer />
        </div>
    }
}
