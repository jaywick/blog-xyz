import * as React from 'react'
import { Component } from 'react'

export interface Project {
    key,
    featureImageThumbUrl,
    title,
    subtitle,
}

interface ProjectCardProps {
    project: Project,
}

export class ProjectCard extends Component<ProjectCardProps> {

    constructor(props: ProjectCardProps) {
        super(props)
    }

    render() {
        return <a className="projectcard" href={`/portfolio/${this.props.project.key}`}>
            <figure className="card-img-container">
                <img className="projectcard-img" src={this.props.project.featureImageThumbUrl} alt={this.props.project.title}></img>
            </figure>
            <h3 className="projectcard-title">{this.props.project.title}</h3>
            <p className="projectcard-subtitle">{this.props.project.subtitle}</p>
        </a>
    }
}
