import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {
    state = {
        editorState: EditorState.createEmpty(),
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    render() {
        const { editorState } = this.state;
        return (
            <Editor
                editorState={editorState}
                editorStyle={{border: '1px solid #000',minHeight: 200}}
                onEditorStateChange={this.onEditorStateChange}
            />
        );
    }
}
{/*<textarea*/}
    {/*disabled*/}
    {/*value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}*/}
{/*/>*/}
