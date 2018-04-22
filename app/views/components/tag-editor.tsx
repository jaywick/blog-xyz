import * as React from 'react'

interface TagEditorProps {
    tags: string[],
    onChange: (tags: string[]) => void,
}

export class TagEditor extends React.Component<TagEditorProps> {

    constructor(props: TagEditorProps = { tags: [], onChange: () => { } }) {
        super(props)
    }

    private updateTags(unsplitValue: string) {
        this.props.onChange(this.split(unsplitValue))
    }

    private split(value: string) {
        return value.split(',')
            .map(x => x.trim())
            .filter(x => x != '')
    }

    private join(value: string[]) {
        return value.join(', ')
    }

    render() {
        return <input className="edit edit-tags"
            type="text"
            placeholder="tags"
            defaultValue={this.join(this.props.tags)}
            onChange={e => this.updateTags(e.target['value'])} />
    }

}