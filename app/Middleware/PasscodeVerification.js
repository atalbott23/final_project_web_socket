'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class PasscodeVerification {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    // call next to advance the request
    await next()
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async wsHandle ({ request }, next) {
    let { passcode } = request.get()

    if (passcode === '123') {
      // call next to advance the request
      await next()
    } else {
      throw new Error(`${passcode} is the wrong passcode`)
    }
  }
}

module.exports = PasscodeVerification
