const { EVENT_NAMES, on, send, request, utils: lxUtils, version } = window.lx
console.log(window.lx)


// https://github.com/lyswhut/lx-music-desktop/blob/master/FAQ.md#windowlxutils
const utils = {
  buffer: {
    from: lxUtils.buffer.from,
    bufToString: lxUtils.buffer.bufToString,
  },
  crypto: {
    aesEncrypt: lxUtils.crypto.aesEncrypt,
    md5: lxUtils.crypto.md5,
    randomBytes: lxUtils.crypto.randomBytes,
    rsaEncrypt: lxUtils.crypto.rsaEncrypt,
  },
}

export {
  EVENT_NAMES,
  on,
  send,
  request,
  utils,
  version,
}
