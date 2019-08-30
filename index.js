const crypto = require('crypto')

class SequentialUUID {
  constructor (c) {
    let config = c || {}
    this.dashes = (config.dashes === undefined) ? true : config.dashes
    this.valid = (config.valid === undefined) ? false : config.valid
    this.unsafeBuffer = (config.unsafeBuffer === undefined) ? false : config.unsafeBuffer
  }

  generate () {
    const timeBytes = (!this.unsafeBuffer) ? Buffer.alloc(4) : Buffer.allocUnsafe(4)
    timeBytes.writeUInt32BE(Math.round(+new Date() / 1000))
    let uuid = Buffer.concat([timeBytes, crypto.randomBytes(12)], 16).toString('hex')
    const parts = [uuid.slice(0, 8), uuid.slice(8, 12), uuid.slice(12, 16), uuid.slice(16, 20), uuid.slice(20, 32)]
    if (!this.valid) {
      if (this.dashes) return parts[0] + '-' + parts[1] + '-' + parts[2] + '-' + parts[3] + '-' + parts[4]
      else return uuid
    }
    parts[2] = '4' + parts[2].slice(1)
    parts[3] = [8, 9, 'a', 'b'][Math.floor(Math.random() * 4)] + parts[3].slice(1)
    if (!this.dashes) return parts[0] + parts[1] + parts[2] + parts[3] + parts[4]
    return parts[0] + '-' + parts[1] + '-' + parts[2] + '-' + parts[3] + '-' + parts[4]
  }
}

module.exports = SequentialUUID
