import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import cx from 'classnames'
import SubmitBtn from './SubmitBtn'
import SignFormEmail from './SignFormEmail'
import * as AuthActions from '../../actions/auth'

class Popup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      offPopup: !this.props.isPopup
    }
    this.handlePopupClick = this.handlePopupClick.bind(this)
  }
  handlePopupClick(e) {
    e.preventDefault()
    this.setState({
      offPopup: true
    })
    this.props.auth.clearResponse()
  }
  render() {
    const { res } = this.props

    return (
      <div className={cx('popup', { off: this.state.offPopup })}>
        <div className='popup-panel'>
          <span className='cancel' onClick={this.handlePopupClick}></span>
          <i className={res.icon}></i>
          <SignFormEmail />
          <p className='description'>
            {res.message}
          </p>
          <SubmitBtn txt={'OK'} onClick={this.handlePopupClick} valid={false} />
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    auth: bindActionCreators(AuthActions, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(Popup)

Popup.propTypes = {
  isFetching: PropTypes.bool,
  isPopup: PropTypes.bool,
  res: PropTypes.object
}

Popup.defaultProps = {
  res: null
}
