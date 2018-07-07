import React from "react";
import { Button } from "patternfly-react";

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorContent: props.source,
            editorLines: 1,
            maxLines: 1
        }
    }

    componentDidMount() {
        window.addEventListener("resize", () => this.updateMaxLines());
        this.updateMaxLines();
    }

    // TODO: take editor scrolling into account
    drawLineNumbers() {
        const result = [];

        let from = 0;
        let to = this.state.editorLines;

        if (to > this.state.maxLines) {
            from = this.state.editorLines - this.state.maxLines;
            to += 1;
        }

        for (let i = from; i < to; ++i) {
            result.push(<div key={ i } className="line-number">
                <span>{ i + 1 }</span>
            </div>);
        }
        return result;
    }

    getLine(content) {
        return content.split("\n").length;
    }

    updateMaxLines() {
        let maxLines = document.getElementById("editor-content").clientHeight;
        maxLines -= 47; // Height of the bottom toolbar
        maxLines /= 20; // Divide by line height

        this.setState({
            maxLines: Math.floor(maxLines)
        });
    }

    onEditorContentChange({ target }) {
        const text = target.value;


        this.setState({
            editorContent: text,
            editorLines: this.getLine(text)
        });
    }

    onEditorKeyDown(e) {
        // Allow tab to be used in text areas
        if (e.keyCode === 9) {
            const ta = document.getElementById("editor-content");
            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            const value = ta.value;

            ta.value = (value.substring(0, start) + "\t" + value.substring(end));
            ta.selectionStart = ta.selectionEnd = start + 1;

            console.log(ta.val);
            e.preventDefault();
        }
    }

    onSaveSchema() {

    }

    render() {
        return (
            <div style={{height: "100%", position: "relative"}}>
                <div id="lines-container">
                    {this.drawLineNumbers()}
                </div>
                <textarea
                    id="editor-content"
                    value={this.state.editorContent}
                    onChange={(ev) => this.onEditorContentChange(ev)}
                    onKeyDown={(ev) => this.onEditorKeyDown(ev)}
                />
                <div id="editor-toolbar">
                    <Button
                        style={{float: "left"}}
                        className="btn btn-primary"
                    >
                        Save
                    </Button>
                </div>
            </div>
        );
    }
}

export { Editor };
