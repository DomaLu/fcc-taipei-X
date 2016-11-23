import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import cx from 'classnames'
import PostTitle from './PostTitle'
import PostContent from './PostContent'
import * as PostActions from '../../actions/post'

class PostForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: null,
      counting: false,
      post_title: false,
      post_content: false,
      bolder: false,
      disabled: true,
    }
    /* Post form related function */
    this.shrinkPostForm = this.shrinkPostForm.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.detectPostForm = this.detectPostForm.bind(this)
    /* Time related function */
    this.tick = this.tick.bind(this)
  }
  timeCalc(date) {
    const limited = Date.parse(date)
    const now = Date.now()

    if(limited > now) {
      const sec = Math.floor((limited - now) / 1000)
      this.setState({ count: sec, counting: true })
      this.interval = setInterval(this.tick, 1000)
    }
  }
  timeFormat(sec) {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)

    if( s < 10 )
      return `0${m}:0${s}`
    else
      return `0${m}:${s}`
  }
  tick() {
    if(this.state.count <= 0) {
      clearInterval(this.interval)
      this.setState({ count: null, counting: false })
    } else {
      this.setState({ count: this.state.count - 1 })
    }
  }

  detectPostForm(e) {
    const bolder = (e.target.parentNode[1].value.trim().length > 0) ? true : false
    const hasText = e.target.value.trim().length > 0 ? true : false
    const disabled = (this.state.post_title && this.state.post_content) ? false : true

    this.setState({
      bolder,
      disabled,
      [e.target.name]: hasText,
    })

    this.props.setFilter(true)
  }
  shrinkPostForm() {
    this.props.setFilter(false)
  }

  handleSubmit(e) {
    e.preventDefault()
    this.setState({ bolder: false })
    const title = e.target.post_title.value.trim()
    const content = e.target.post_content.value.trim()
    this.props.post.createPostRequest({ title, content })
    e.target.reset()
    this.props.setFilter(false)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.newPost) {
      const { counting } = this.state
      const { create_post_time } = nextProps.newPost.author

      if(!counting) this.timeCalc(create_post_time)
    }
  }

  render() {
    const { filter, isFetching } = this.props
    const { count, counting, bolder, disabled } = this.state
    const placeHolder = filter ? 'TITLE (required)' : 'Do you want to share something?'

    return (
      <form className={cx('post-form', { expand: filter, hidden: isFetching })} onSubmit={this.handleSubmit}>
 	    	<i className='close' onClick={this.shrinkPostForm}>close</i>
        { counting ?
          <div className='post-btn'>{this.timeFormat(count)}</div> :
          <button className='post-btn' role='submit' disabled={disabled}>POST</button>
        }
 				<label className='post-1' htmlFor='post-title-input'></label>
        <PostTitle
          placeHolder={placeHolder}
          detectPostForm={this.detectPostForm}
          bolder={bolder}
        />
        <PostContent detectPostForm={this.detectPostForm} />
      </form>
    )
  }

  componentDidMount() {
    const { create_post_time } = this.props
    this.timeCalc(create_post_time)
  }

  componentWillUnmount() {
     clearInterval(this.interval)
  }
}

PostForm.propTypes = {
  filter: PropTypes.bool.isRequired,
  setFilter: PropTypes.func.isRequired,
  newPost: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  create_post_time: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => {
  const { newPost } = state.post
  const { create_post_time } = state.auth.profile
  return {
    newPost,
    create_post_time,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    post: bindActionCreators(PostActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostForm)
