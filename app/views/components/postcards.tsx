import * as React from "react";
import { MetadataProps } from "./metadata";
import { plural } from "../../utils/words";
import { PostCard, Post } from './postcard'

interface FrontPagePostsProps {
    posts: Post[]
}

export class PostCards extends React.Component<FrontPagePostsProps> {

    constructor(props: FrontPagePostsProps = { posts: [] }) {
        super(props)
    }

    render() {
        return <div className="frontpage-section frontpage-section-posts">
            <h2 className="frontpage-section-header">Recent posts</h2>
            <div className="frontpage-section-summary">
                Last few ramblings from my <a href="/blog">blog</a>.
            </div>
            <div className="postcards">
                {this.props.posts.map((x, i) => (
                    <PostCard key={i} post={x} />
                ))}
            </div>
        </div>
    }
}
