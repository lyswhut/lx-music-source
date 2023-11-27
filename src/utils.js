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

// https://stackoverflow.com/a/53387532
export const compareVersions = ((prep, l, i, r) => (a, b) => {
  a = prep(a)
  b = prep(b)
  l = Math.max(a.length, b.length)
  i = 0
  r = i
  // convert into integer, uncluding undefined values
  while (!r && i < l) r = ~~a[i] - ~~b[i++]

  return r < 0 ? -1 : (r ? 1 : 0)
})(t => ('' + t)
// treat non-numerical characters as lower version
// replacing them with a negative number based on charcode of first character
  .replace(/[^\d.]+/g, c => '.' + (c.replace(/[\W_]+/, '').toUpperCase().charCodeAt(0) - 65536) + '.')
// remove trailing "." and "0" if followed by non-numerical characters (1.0.0b);
  .replace(/(?:\.0+)*(\.-\d+(?:\.\d+)?)\.*$/g, '$1')
// return array
  .split('.'))
