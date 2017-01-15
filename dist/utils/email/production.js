'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.checkEmailStatus=undefined;var checkEmailStatus=exports.checkEmailStatus=function(){var _ref=_asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx,next){var nodemailerInfo;return regeneratorRuntime.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:nodemailerInfo=ctx.state.nodemailerInfo;if(!(nodemailerInfo.statusCode<=202)){_context.next=3;break}return _context.abrupt('return',ctx.response.body={status:'success',code:200001,message:'You can go to check your email'});case 3:throw _boom2.default.create(500,'Your data is bad and you should feel bad',{code:500002});case 4:case'end':return _context.stop();}}},_callee,this)}));return function checkEmailStatus(_x,_x2){return _ref.apply(this,arguments)}}();exports.mailTransport=mailTransport;var _boom=require('boom');var _boom2=_interopRequireDefault(_boom);var _config=require('../../config');var _config2=_interopRequireDefault(_config);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _asyncToGenerator(fn){return function(){var gen=fn.apply(this,arguments);return new Promise(function(resolve,reject){function step(key,arg){try{var info=gen[key](arg);var value=info.value}catch(error){reject(error);return}if(info.done){resolve(value)}else{return Promise.resolve(value).then(function(value){step('next',value)},function(err){step('throw',err)})}}return step('next')})}}function mailTransport(userInfo,routePath,option){var emailToken=arguments.length>3&&arguments[3]!==undefined?arguments[3]:undefined;return new Promise(function(resolve,reject){var helper=require('sendgrid').mail;var sg=require('sendgrid')(_config2.default.sendgrid.apiKey);var from_email=new helper.Email(_config2.default.sendgrid.sendgridSender);var to_email=new helper.Email(userInfo.email);var subject=_config2.default.mailTemplate.subject;var content=void 0;if(emailToken){content=new helper.Content('text/html','<h1>Hi, '+userInfo.nickname+'</h1>\n         <h3>Let\'s confirm your email address.</h3>\n         <h3>\n           <a href=\''+_config2.default.hostUrl+'/'+routePath+'?token='+emailToken+'\'>\n             Click here to '+option+' your account\n           </a>\n         </h3>')}else{content=new helper.Content('text/html','<h1>Hi, '+userInfo.nickname+'</h1>\n         <h3>\n           Your profile setting has been changed\n         </h3>')}var mail=new helper.Mail(from_email,subject,to_email,content);var request=sg.emptyRequest({method:'POST',path:'/v3/mail/send',body:mail.toJSON()});sg.API(request,function(err,response){if(err){var SgError=_boom2.default.create(500,'Sendgrid server unavailable to request',{code:503003});return reject(SgError)}resolve(response)})})}