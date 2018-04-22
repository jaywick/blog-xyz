import * as React from 'react'
import { SmallHeader } from '../components/small-header'
import { Footer } from '../components/footer'
import { plural } from '../../utils/words'
import { MetadataProps } from '../components/metadata'
import './base.css'

class PostPageProps {
    relativeDate: string
    readTime: number
    commentCount: number
    title: string
    bodyHtml: string
    tags: string[]
    featureImageUrl: string
    featureImageThumbUrl: string
    snippet: string
}

export class PostPage extends React.Component<PostPageProps> {

    constructor(props: PostPageProps) {
        super(props)
    }

    meta(): MetadataProps {
        return {
            title: [this.props.title, 'Blog', 'xyz-blog'],
            summary: this.props.snippet,
            image: this.props.featureImageThumbUrl,
        }
    }

    render() {
        return <div id="post-page">
            <SmallHeader />

            <div className="blog-post">
                <div className="blog-meta-top">
                    <span className="blog-date">{this.props.relativeDate}</span>
                    <span className="blog-meta-separator">&bull;</span>
                    <span className="blog-minutes">{this.props.readTime} min read</span>
                    {
                        !!this.props.commentCount && [
                            (<span className="blog-meta-separator">&bull;</span>),
                            (<span className="blog-comments">{this.props.commentCount + ' ' + plural('response', this.props.commentCount)}</span>)
                        ]
                    }
                </div>
                <h1 className="blog-title">{this.props.title}</h1>
                <img className="post-feature-image" src={this.props.featureImageUrl} />
                <p dangerouslySetInnerHTML={{ __html: this.props.bodyHtml }}></p>

                {!!this.props.tags.length && (
                    <div className="taglist">Tagged under: {this.props.tags.map((tag, i) => [
                        <a href={`/blog/tag/${tag}`} className="post-tag" key={i}>{tag}</a>,
                        <span> </span>
                    ])}</div>
                )}
            </div>

            <Footer />

            <script src="/highlight.pack.js"></script>
            <script>hljs.initHighlightingOnLoad();</script>
        </div>
    }
}