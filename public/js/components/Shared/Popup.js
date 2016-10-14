import React, { Component } from 'react'
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
      offPopup: !this.props.error
    }
    this.handlePopupClick = this.handlePopupClick.bind(this)
  }
  handlePopupClick(e) {
    e.preventDefault()
    this.setState({
      offPopup: true
    })
    this.props.auth.clearError()
  }
  render() {
    const errorMessage = this.props.error.message
    const popupClasses = cx({
      'popup': true,
      'off': this.state.offPopup
    })
    const popupIconClasses = cx({
      'sign-in-error-popup': errorMessage === 'Email or password is not valid' ||
                             errorMessage === 'Format of email address is wrong',
      'network-error-popup': errorMessage === 'Failed to fetch'
    })

    return (
      <div className={popupClasses}>
        <div className='popup-panel'>
          <span className='cancel' onClick={this.handlePopupClick}></span>
          <i className={popupIconClasses}></i>
          <SignFormEmail />
          <p className='description'>{this.props.error.message}</p>
          <SubmitBtn txt={'OK'} onClick={this.handlePopupClick} />
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
