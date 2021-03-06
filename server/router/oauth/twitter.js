import Router from 'koa-router'
import _ from 'lodash'
import fetch from 'node-fetch'
import qs from 'querystring'
import Boom from 'boom'
import convert from 'koa-convert'
import _validate from 'koa-req-validator'
import User from '../../models/users'
import { getToken } from '../../utils/auth'
import { getCleanUser } from '../../utils/mixed'
import { encodeRemoteImg } from '../../utils/mixed'
import Config from '../../config'

const validate = (...args) => convert(_validate(...args))
const router = new Router({
  prefix: '/v1/auth/twitter',
})

router.post('/',
  validate({
    'code:body': ['require', 'code is required'],
  }),
  async(ctx, next) => {
    try {
      const { code } = ctx.request.body
      const { accessTokenUrl, client_id, redirect_uri, client_secret } = Config.auth.twitter
      // WIP
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
