import * as React from 'react'
import { Component } from 'react'

export interface Post {
    id,
    slug,
    title,
    featureImageThumbUrl,
    relativeDate,
    readTime,
    commentCount,
    snippet,
}

interface PostCardProps {
    post: Post,
}

export class PostCard extends Component<PostCardProps> {

    constructor(props: PostCardProps) {
        super(props)
    }

    render() {
        return <a className="postcard" href={`/blog/${this.props.post.id}/${this.props.post.slug}`}>
            <figure className="card-img-container">
                <img className="postcard-img" src={this.props.post.featureImageThumbUrl} alt={this.props.post.title}/>
            </figure>
            <h3 className="postcard-title">{this.props.post.title}</h3>
            <p className="postcard-subtitle">{this.props.post.relativeDate} &bull; {this.props.post.readTime} min read</p>
        </a>
    }
}
