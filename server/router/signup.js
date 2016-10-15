import Router from 'koa-router'
import User from '../models/users'
import Boom from 'boom'
import _ from 'lodash'
import nodemailer from 'nodemailer'
import convert from 'koa-convert'
import _validate from 'koa-req-validator'
import { getToken, verifyToken } from '../utils/auth'
import { getCleanUser } from '../utils/mixed'
import { mailTransport, checkEmailStatus } from '../utils/email'
import Config from '../config'

/*
  Signup
  (1) User input their user info
  (2) Server send mail
  (3) User click URL
  (4) Go to Link (register router component) + email token
  (5) Verify email token => jwt token => Login Status ing
*/
const validate = (...args) => convert(_validate(...args))
const router = new Router({
  prefix: '/v1/signup'
})

router.post('/',
  validate({
    'nickname:body': ['require', 'isAlphanumeric', 'nickname is required or not alphanumeric'],
    'email:body': ['require', 'isEmail', 'email is required or not valid'],
    'password:body': ['require', 'password is required'],
    'avatar:body': ['require', 'isDataURI', 'avatar is required or not dataURI'],
  }),
  async(ctx, next) => {
    try {
      const { email, nickname } = ctx.request.body
      const socialAccountExist = await User.findOne({ email, social: true })
      if (socialAccountExist) {
        throw Boom.forbidden('The email has already been registered in social account')
      }

      //1. Check the account is unique
      const accountExist = await User.findOne({ email, isEmailActived: true })
      if (accountExist) {
        throw Boom.forbidden('The email has already been registered')
      }
      //2. The user may forget to receive their email to authentication
      const result = await User.findOne({ email, isEmailActived: false })
      const emailToken = await getToken['EMAIL'](email)
      let user
      //If email account is not active, resend email again.
      if (result) {
        user = await User.findById(result._id)
        _.extend(user, {
          ...ctx.request.body,
          verifyEmailToken: emailToken,
          nicknameChangeLimit: Config.user.nicknameChangeLimit()
        })
        await user.save()
      } else {
        //3. Store new user info in DB (finally)
        user = new User(ctx.request.body)
        await user.save()

        _.extend(user, {
          verifyEmailToken: emailToken
        })
        await user.save()
      }
      ctx.state.user = user
      ctx.state.nodemailerInfo = await mailTransport({ email, nickname }, 'verifyToken', 'activate', emailToken)
      await next()
    } catch (err) {
      if (err.output.statusCode) {
        ctx.throw(err.output.statusCode, err)
      } else if (err.code === 11000) {
        const MongoError = Boom.conflict('DB Conflict')
        ctx.throw(MongoError.output.statusCode, MongoError)
      } else if (err.name === 'ValidationError') {
        const UserInputError = Boom.badData('Your data is bad and you should feel bad')
        ctx.throw(UserInputError.output.statusCode, UserInputError)
      } else {
        ctx.throw(500, err)
      }
    }
  },
  checkEmailStatus
)

//Active the account, and verify the email token
router.get('/',
  validate({
    'token:query': ['require', 'token is required']
  }),
  async(ctx, next) => {
    try {
      const emailToken = ctx.request.query.token
      const { email } = await verifyToken(emailToken)
      const result = await User.findOneAndUpdate({ email }, {
        isEmailActived: true,
        verifyEmailToken: undefined
      })

      if (!result) {
        throw Boom.unauthorized('Email token is not valid or expired')
      }
      const user = getCleanUser(result)
      const accessToken = await getToken['JWT'](email)

      ctx.response.body = {
        status: 'success',
        auth: {
          token: accessToken,
          ...user
        }
      }
    } catch(err) {
      if (err.output.statusCode) {
        ctx.throw(err.output.statusCode, err)
      } else {
        ctx.throw(500, err)
      }
    }
  }
)

export default router
