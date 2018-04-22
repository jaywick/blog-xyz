import * as React from 'react'
import { publicImgUrl } from '../../transforms/feature-image-url'

export class MetadataProps {
    title: string | string[]
    summary?: string
    image?: string
}

export class Metadata extends React.Component<MetadataProps> {

    static defaultProps: MetadataProps = {
        title: 'xyz-blog',
        summary: 'Debranded source code for jaywick.xyz',
        image: '/background.jpg',
    }

    constructor(props: MetadataProps = Metadata.defaultProps) {
        super(props)
    }

    render() {
        const title = this.compileTitle(this.props.title)

        return [
            <title>{title}</title>,
            <meta name="Description" content={this.props.summary} />,
            <meta name="keywords" content="blog,xyz" />,
            <meta name="author" content="YOUR_NAME_HERE" />,
            <meta name="twitter:card" content="summary_large_image" />,
            <meta name="twitter:site" content="@YOUR_TWITTER" />,
            <meta name="twitter:creator" content="@YOUR_TWITTER" />,
            <meta name="twitter:title" content={title} />,
            <meta name="twitter:description" content={this.props.summary} />,
            <meta name="twitter:image" content={publicImgUrl([this.props.image])} />,
            <meta property="og:type" content="article" />,
            <meta property="og:title" content={title} />,
            <meta property="og:description" content={this.props.summary} />,
            <meta property="og:image" content={publicImgUrl([this.props.image])} />,
        ]
    }

    private compileTitle(title: string | string[]) {
        if (typeof title === "string")
            return title

        return title
            .filter(x => !!x)
            .join(' | ')
    }
}
