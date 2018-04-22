import * as React from 'react'
import { SmallHeader } from '../components/small-header'
import { Footer } from '../components/footer'
import { MetadataProps } from '../components/metadata'
import './blog.css'
import './base.css'

class Post {
    relativeDate: string
    readTime: number
    commentCount: number
    status: string
    title: string
    id: number
    slug: string
    summary: string
    featureImageUrl: string
}

class BlogPageProps {
    paging: {
        prev: string
        next: string
        current: number
    }
    posts: Post[]
    tag?: string
}

export class BlogPage extends React.Component<BlogPageProps> {

    constructor(props: BlogPageProps) {
        super(props)
    }

    meta(): MetadataProps {
        return {
            title: [
                (this.props.paging.current !== 1) && ('Page ' + this.props.paging.current),
                (this.props.tag) && ('Tagged ' + this.props.tag),
                'Blog',
                'xyz-blog',
            ],
        }
    }

    render() {
        return <div id="blog-page">
            <SmallHeader />

            {!!this.props.tag &&
                <div className="filter-description-panel">
                    <div className="filter-description">
                        You are viewing all blog posts tagged &nbsp;
                        <span className="tag-name">{this.props.tag}</span> &nbsp;
                        <a className="fa fa-times filter-description-untag" href="/blog" />
                    </div>
                </div>
            }

            {this.props.posts.map((x, i) => (
                <div className="blog-summary-container" key={i}>
                    <div className="blog-summary">
                        <div className="blog-meta-top">
                            <span className="blog-date">{x.relativeDate}</span>
                            <span className="blog-meta-separator">&bull;</span>
                            <span className="blog-minutes">{x.readTime} min read</span>
                            {
                                !!x.commentCount && [
                                    (<span className="blog-meta-separator">&bull;</span>),
                                    (<span className="blog-comments">{x.commentCount} response {x.commentCount == 1 ? '' : 's'} </span>)
                                ]
                            }
                        </div>
                        <a href={`/blog/${x.id}/${x.slug}`} className="title-link-summary"><h2 className="blog-title">{x.title}</h2></a>
                        <img className="post-feature-image" src={x.featureImageUrl} />
                        <p dangerouslySetInnerHTML={{ __html: x.summary }} />
                        <a className="continue-reading" href={`/blog/${x.id}/${x.slug}`}>Continue reading</a>
                    </div>
                </div>))}

            <div className="paging">
                {!!this.props.paging.prev &&
                    <a className="paging-action" href={this.props.paging.prev}>&laquo; Older posts</a>}
                {!!this.props.paging.next &&
                    <a className="paging-action" href={this.props.paging.next}>Newer posts &raquo;</a>}
            </div>

            <Footer />
        </div>
    }
}
