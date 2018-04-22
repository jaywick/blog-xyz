import * as React from 'react'
import { Footer } from '../components/footer'
import { MetadataProps } from '../components/metadata'
import { LargeHeader } from '../components/large-header'
import { PostCards } from '../components/postcards'
import { Post } from '../components/postcard'
import { ProjectCards } from '../components/projectcards'
import { Project } from '../components/projectcard'
require('./base.css')

interface HomePageProps {
    posts: Post[]
    projects: Project[]
}

export class HomePage extends React.Component<HomePageProps> {

    constructor(props: HomePageProps = { posts: [], projects: [] }) {
        super(props)
    }

    meta(): MetadataProps {
        return { title: 'xyz-blog' }
    }

    render() {
        return <div id="home-page">
            <LargeHeader />
            <PostCards posts={this.props.posts}/>
            <ProjectCards projects={this.props.projects}/>
            <Footer />
        </div>
    }
}