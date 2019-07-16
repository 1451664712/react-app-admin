import React, { Component } from 'react'
import './index.less'
class LinkButton extends Component {
    render () {
        return (
            <button {...this.props} className="link_button"></button>
        )
    }
}
export default LinkButton
