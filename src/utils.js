import { version, utils, send, EVENT_NAMES } from './lx'


export const buf2hex = buffer => { // buffer is an ArrayBuffer
  return version
    ? utils.buffer.bufToString(buffer, 'hex')
    : [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('')
}

export const aesEncrypt = (data, eapiKey, iv, mode) => {
  if (!version) {
    mode = mode.split('-').pop()
  }
  return utils.crypto.aesEncrypt(data, mode, eapiKey, iv)
}

export const md5 = str => utils.crypto.md5(str)


export const showUpdateAlert = () => {
  send(EVENT_NAMES.updateAlert, {
    log: 'hello world',
    updateUrl: 'https://xxx.com',
  })
}
