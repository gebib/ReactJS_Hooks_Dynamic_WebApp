import React from "react";

export default class DateInput extends React.PureComponent {
    state = {readOnly: false};

    render() {
        return (
            <input
                {...this.props}
                onFocus={() => this.setState({readOnly: true})}
                onBlur={() => this.setState({readOnly: false})}
                readOnly={this.state.readOnly}
            />
        );
    }
}
