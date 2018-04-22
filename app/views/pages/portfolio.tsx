import * as React from 'react'
import { SmallHeader } from '../components/small-header'
import { Footer } from '../components/footer'
import { MetadataProps } from '../components/metadata'
import { Project, ProjectCard } from '../components/projectcard'
import './base.css'

interface PortfolioPageProps {
    projects: Project[],
}

export class PortfolioPage extends React.Component<PortfolioPageProps> {

    constructor(props: PortfolioPageProps = { projects: [] }) {
        super(props)
    }

    meta(): MetadataProps {
        return { title: ['Portfolio', 'xyz-blog'] }
    }

    render() {
        return <div id="portfolio-page">
            <SmallHeader />

            <div className="frontpage-section frontpage-section-posts">
                <h2 className="frontpage-section-header">Portfolio</h2>
                <div className="frontpage-section-summary">
                    Here are some of my favourite endevours thoughout the years
                </div>
                <div className="projectcards">
                    {this.props.projects.map((x, i) => (
                        <ProjectCard key={i} project={x} />
                    ))}
                </div>
            </div>

            <Footer />
        </div >
    }
}
