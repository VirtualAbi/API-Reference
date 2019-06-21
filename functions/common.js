/**
* @file
* @desc Common functions
* @author Deepak
* @date 10 Feb 2017
*
*/
const config = require('config')


function Common() {};

/**
* @method
* @param {string} type - validationError, error, success
* @param {string} code
* @param {object} data
* @return {object} response
*
*/
Common.prototype.formatResponse = function(request) {

    var response = {}
    response.statusCode = request.code

    switch(request.type) {

        /**
         * @case
         * @param {string} validationError
         *
         */
         case 'validationError':
         response.status = 'error'
         response.message = 'Bad Request'
         response.data = []
         obj = {}

         for (item of request.data) {
             (obj[item.param]) ? '' : obj[item.param] = item.msg
         }

         response.data.push(obj)
         return response
         break

         /**
         * @case
         * @param {string} dbError
         *
         */
         case 'dbError':
         response.status = 'error'
         response.message = 'Internal Server Error'
         response.data = {}
         response.data.name = request.data.name
         response.data.message = request.data.message
         return response
         break

         /**
         * @case
         * @param {string} error
         *
         */
         case 'authorizationError':
         response.status = 'error'
         response.message = 'Unauthorized'
         return response
         break

        /**
         * @case
         * @param {string} error
         *
         */
         case 'error':
         response.status = 'error'
         response.message = request.data
         return response
         break

        /**
         * @case
         * @param {string} success
         *
         */
         case 'success':
         response.status = 'success'
         response.message = request.data.message
         response.data = request.data.data
         return response
         break
     }
 }

/**
* @method
* @param {string} size
* @return {string} 5 digit random number
*
*/
Common.prototype.generateOTP = function(size = 5) {

    var min = Math.pow( 10, (size-1) );
    var max = min * 9;
    return Math.floor(min + Math.random() * max);
}

/**
* @method
* @return {string} 16 character long secret
*
*/
Common.prototype.getSecret = function() {

    // return 'rkf06JlTniCw<@)N';
    return config.get('secret');
}

/**
* @method
* @param {json} email
* @return {boolean} success or error
*
*/
Common.prototype.sendEmail = function(email) {

    'use strict';
    const nodemailer = require('nodemailer')
    var mu = require('mu2')
    var htmlData = ''

    /**
    * @template
    * @param {json} email.template - Template file to be used for sending email
    * @param {json} email.data - Data to be used inside template
    *
    */
    mu.root = __dirname + '/../emails'
    mu.compileAndRender(email.template, email.data)
    .on('data', function(data) {
        htmlData += data
    })
    .on('end', function () {

        // let transporter = nodemailer.createTransport({
        //     service: 'mandrill',
        //     auth: {
        //         user: 'MindWeavers',
        //         pass: 'wxaXlseWBMPKONWV15rlgA'
        //     }
        // });


        // let transporter = nodemailer.createTransport({
        //     service: 'SendGrid',
        //     auth: {
        //         user: 'sujith.reubro',
        //         pass: 'sujith123'
        //     }
        // });

        // let smtpConfig = {
        //     host: 'email-smtp.us-east-1.amazonaws.com',
        //     port: 587,
        //     secure: false,
        //     auth: {
        //         user: 'AKIAIWMQ5MFPUFN6NWXQ',
        //         pass: 'Av8sbAvoFYA5JfzhEU+j2jJWYVeWPafSkcMW8mTMiU71'
        //     }
        // };

        let transporter = nodemailer.createTransport(config.get('smtp'));


        /**
        * @template
        * @param {json}  email.from - From email address
        * @param {json}  email.to - To email address
        * @param {json}  email.subject - Subject of the email
        * @param {json}  htmlData - Body of the email
        * @return {boolean} success or error
        *
        */
        let mailOptions = {
            from: config.get('email.from'),//email.from,
            to: email.to,
            subject: email.subject,
            text: htmlData,
            html: htmlData
        }

       // return true

        transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
             console.log(error)
             return false
         }
         console.log('Message %s sent: %s', info.messageId, info.response)
         return true
        })

    })
}

/**
* @method
* @return {string} SHA256 string
*
*/
Common.prototype.hashString = function(string) {

    var createHash = require('sha.js')
    var sha256 = createHash('sha256')
    return sha256.update(string, 'utf8').digest('hex')
}


/**
* @method
* @param {string, object} obj
*
*/
Common.prototype.trim = function(obj) {

    switch(typeof obj){

        case 'string' :
        return obj.trim()
        break

        case 'object' :
        var keyArray = Object.keys(obj)
        for(key in keyArray){
            obj[keyArray[key]] = obj[keyArray[key]].trim()
        }
        return obj
        break
    }
};


module.exports = new Common()
