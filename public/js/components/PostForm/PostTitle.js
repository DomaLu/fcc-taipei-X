import React, { Component, PropTypes } from 'react'
import cx from 'classnames'

class PostTitle extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { placeHolder, detectPostForm, bolder, value } = this.props

    return (
      <input
        type='text'
        placeholder={placeHolder}
        className={cx('post-title-input', { bolder })}
        id='post-title-input'
        name='post_title'
        onFocus={detectPostForm}
        onKeyDown={detectPostForm}
        onBlur={detectPostForm}
        onKeyUp={detectPostForm}
        onChange={detectPostForm}
        value={value}
        ref='inp'
      />
    )
  }
}

PostTitle.propTypes = {
  placeHolder: PropTypes.string.isRequired,
  detectPostForm: PropTypes.func.isRequired,
  bolder: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
}

PostTitle.defaultProps = {
  bolder: false,
  placeHolder: 'Do you want to share something?',
  value: '',
}

export default PostTitle
