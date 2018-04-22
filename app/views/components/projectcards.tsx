import * as React from 'react'
import { MetadataProps } from './metadata'
import { ProjectCard, Project } from './projectcard'

interface ProjectCardsProps {
    projects: Project[]
}

export class ProjectCards extends React.Component<ProjectCardsProps> {

    constructor(props: ProjectCardsProps = { projects: [] }) {
        super(props)
    }

    render() {
        return <div className="frontpage-section frontpage-section-posts">
            <h2 className="frontpage-section-header">Latest work</h2>
            <div className="frontpage-section-summary">
                Some of my recent <a href="/portfolio">projects</a>.
            </div>
            <div className="projectcards">
                {this.props.projects.map((x, i) => (
                    <ProjectCard key={i} project={x} />
                ))}
            </div>
        </div>
    }
}
