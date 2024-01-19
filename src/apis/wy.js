import { request, currentScript } from '../lx'
import { buf2hex, aesEncrypt, md5 } from '../utils'

const parse = (str) => {
  let comment = /^\/\*(?:.|\n)+?\*\//.exec(str)?.[0]
  if (!comment) return ''
  let token = /\*\s*@wy_token\s+(.+)/.exec(comment)?.[1]?.trim()
  return (!token || token == 'null') ? '' : token
}
const token = parse(currentScript)

const qualitys = {
  '128k': 128000,
  '320k': 320000,
  flac: 999000,
}
const eapi = (url, object) => {
  const eapiKey = 'e82ckenh8dichen8'

  const text = typeof object === 'object' ? JSON.stringify(object) : object
  const message = `nobody${url}use${text}md5forencrypt`
  const digest = md5(message)
  const data = `${url}-36cd479b6b5-${text}-36cd479b6b5-${digest}`
  return {
    params: buf2hex(aesEncrypt(data, eapiKey, '', 'aes-128-ecb')).toUpperCase(),
  }
}

let cookie = 'os=pc'
if (token) cookie = `MUSIC_U=${token}; ` + cookie

// https://github.com/listen1/listen1_chrome_extension/blob/master/js/provider/netease.js
export default {
  info: {
    name: '网易音乐',
    type: 'music',
    actions: ['musicUrl'],
    qualitys: token ? ['128k', '320k', 'flac'] : ['128k'],
  },

  musicUrl({ songmid }, quality) {
    quality = qualitys[quality]
    const target_url = 'https://interface3.music.163.com/eapi/song/enhance/player/url'
    const eapiUrl = '/api/song/enhance/player/url'

    const d = {
      ids: `[${songmid}]`,
      br: quality,
    }
    const data = eapi(eapiUrl, d)

    return new Promise((resolve, reject) => {
      console.log(songmid, quality)
      request(target_url, {
        method: 'POST',
        form: data,
        headers: {
          cookie,
        },
      }, (err, resp) => {
        console.log(resp.body)
        if (err) return reject(err)
        if (resp.headers.cookie) cookie = resp.headers.cookie

        let res_data = resp.body
        const { url, freeTrialInfo } = res_data.data[0]
        if (!url || freeTrialInfo) return reject(new Error('failed'))
        resolve(url)
      })
    })
  },
}
