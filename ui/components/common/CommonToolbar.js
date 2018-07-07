import React from "react";
import { Toolbar, Button } from "patternfly-react";

const CommonToolbar = ({ buttons, filter = true }) => {
    const elements = buttons.map(button => (
        <Button
            style={{ float: button.side || "right" }}
            key={button.id}
            bsStyle="primary"
            onClick={button.cb}
        >
            {button.title}
        </Button>
    ));

    function getFilter() {
        if (filter) {
            return <input type="text" placeholder="Filter by Name" style={{ height: "26px" }} />;
        }
    }

    return (
        <div className="toolbar-container">
            <Toolbar>
                {getFilter()}
                {elements}
            </Toolbar>
        </div>
    );
};

export { CommonToolbar };
