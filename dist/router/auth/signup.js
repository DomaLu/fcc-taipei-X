'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};var _koaRouter=require('koa-router');var _koaRouter2=_interopRequireDefault(_koaRouter);var _boom=require('boom');var _boom2=_interopRequireDefault(_boom);var _lodash=require('lodash');var _lodash2=_interopRequireDefault(_lodash);var _nodemailer=require('nodemailer');var _nodemailer2=_interopRequireDefault(_nodemailer);var _koaConvert=require('koa-convert');var _koaConvert2=_interopRequireDefault(_koaConvert);var _koaReqValidator=require('koa-req-validator');var _koaReqValidator2=_interopRequireDefault(_koaReqValidator);var _auth=require('../../utils/auth');var _mixed=require('../../utils/mixed');var _email=require('../../utils/email');var _config=require('../../config');var _config2=_interopRequireDefault(_config);var _users=require('../../models/users');var _users2=_interopRequireDefault(_users);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _asyncToGenerator(fn){return function(){var gen=fn.apply(this,arguments);return new Promise(function(resolve,reject){function step(key,arg){try{var info=gen[key](arg);var value=info.value}catch(error){reject(error);return}if(info.done){resolve(value)}else{return Promise.resolve(value).then(function(value){step('next',value)},function(err){step('throw',err)})}}return step('next')})}}/*
  Signup
  (1) User input their user info
  (2) Server send mail
  (3) User click URL
  (4) Go to Link (register router component) + email token
  (5) Verify email token => jwt token => Login Status ing
*/var validate=function validate(){return(0,_koaConvert2.default)(_koaReqValidator2.default.apply(undefined,arguments))};var router=new _koaRouter2.default({prefix:'/v1/signup'});router.post('/',validate({'nickname:body':['require','isAlphanumeric','Nickname is required or not alphanumeric'],'email:body':['require','isEmail','Format of email address is wrong'],'password:body':['require','Password is required'],'avatar:body':['require','isDataURI','Avatar is required or not dataURI']}),function(){var _ref=_asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx,next){var _ctx$request$body,email,nickname,socialAccountExist,accountExist,result,emailToken,user;return regeneratorRuntime.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.prev=0;_ctx$request$body=ctx.request.body,email=_ctx$request$body.email,nickname=_ctx$request$body.nickname;_context.next=4;return _users2.default.findOne({email:email,social:true});case 4:socialAccountExist=_context.sent;if(!socialAccountExist){_context.next=7;break}throw _boom2.default.create(403,'The email has already been registered in social account',{code:403001});case 7:_context.next=9;return _users2.default.findOne({email:email,isEmailActived:true});case 9:accountExist=_context.sent;if(!accountExist){_context.next=12;break}throw _boom2.default.create(403,'The email has already been registered',{code:403002});case 12:_context.next=14;return _users2.default.findOne({email:email,isEmailActived:false});case 14:result=_context.sent;_context.next=17;return _auth.getToken['EMAIL'](email);case 17:emailToken=_context.sent;user=void 0;//If email account is not active, resend email again.
if(!result){_context.next=28;break}_context.next=22;return _users2.default.findById(result._id);case 22:user=_context.sent;_lodash2.default.extend(user,_extends({},ctx.request.body,{verifyEmailToken:emailToken,nicknameChangeLimit:_config2.default.user.nicknameChangeLimit()}));_context.next=26;return user.save();case 26:_context.next=34;break;case 28://3. Store new user info in DB (finally)
user=new _users2.default(ctx.request.body);_context.next=31;return user.save();case 31:_lodash2.default.extend(user,{verifyEmailToken:emailToken});_context.next=34;return user.save();case 34:ctx.state.user=user;_context.next=37;return(0,_email.mailTransport)({email:email,nickname:nickname},'verifyToken','activate',emailToken);case 37:ctx.state.nodemailerInfo=_context.sent;_context.next=40;return next();case 40:_context.next=45;break;case 42:_context.prev=42;_context.t0=_context['catch'](0);if(_context.t0.output.statusCode){ctx.throw(_context.t0.output.statusCode,_context.t0)}else{ctx.throw(500,_context.t0)}case 45:case'end':return _context.stop();}}},_callee,undefined,[[0,42]])}));return function(_x,_x2){return _ref.apply(this,arguments)}}(),_email.checkEmailStatus);//Active the account, and verify the email token
router.get('/',validate({'token:query':['require','token is required']}),function(){var _ref2=_asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx,next){var emailToken,verifyResult,email,result,user,userId,accessToken;return regeneratorRuntime.wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.prev=0;emailToken=ctx.request.query.token;_context2.next=4;return(0,_auth.verifyToken)(emailToken);case 4:verifyResult=_context2.sent;if(verifyResult){_context2.next=7;break}throw _boom2.default.create(401,'Token is not valid or expired',{code:401002});case 7:email=verifyResult.email;_context2.next=10;return _users2.default.findOneAndUpdate({email:email},{isEmailActived:true,verifyEmailToken:null});case 10:result=_context2.sent;if(result){_context2.next=13;break}throw _boom2.default.create(401,'Email token is not valid or expired',{code:401003});case 13:user=(0,_mixed.getCleanUser)(result);userId=result._id;_context2.next=17;return _auth.getToken['JWT']({userId:userId,email:email});case 17:accessToken=_context2.sent;ctx.body={status:'success',auth:_extends({token:accessToken},user),code:200002,message:'Account validation success'};_context2.next=24;break;case 21:_context2.prev=21;_context2.t0=_context2['catch'](0);if(_context2.t0.output.statusCode){ctx.throw(_context2.t0.output.statusCode,_context2.t0)}else{ctx.throw(500,_context2.t0)}case 24:case'end':return _context2.stop();}}},_callee2,undefined,[[0,21]])}));return function(_x3,_x4){return _ref2.apply(this,arguments)}}());exports.default=router;