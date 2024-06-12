import { request } from '../lx'

const qualitys = {
  '128k': '128kmp3',
  '320k': '320kmp3',
  // ape: 'ape',
  // flac: 'flac',
}


let token = ''
let cookie = ''
let key = ''

function encrypt(str, pwd) {
  if (pwd == null || pwd.length <= 0) {
    console.log('Please enter a password with which to encrypt the message.')
    return null
  }
  let prand = ''
  for (let i = 0; i < pwd.length; i++) {
    prand += pwd.charCodeAt(i).toString()
  }
  let sPos = Math.floor(prand.length / 5)
  let mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5))
  let incr = Math.ceil(pwd.length / 2)
  let modu = Math.pow(2, 31) - 1
  if (mult < 2) {
    console.log('Algorithm cannot find a suitable hash. Please choose a different password. \nPossible considerations are to choose a more complex or longer password.')
    return null
  }
  let salt = Math.round(Math.random() * 1000000000) % 100000000
  prand += salt
  while (prand.length > 10) {
    prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString()
  }
  prand = (mult * prand + incr) % modu
  let enc_chr = ''
  let enc_str = ''
  for (let i = 0; i < str.length; i++) {
    enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255))
    if (enc_chr < 16) {
      enc_str += '0' + enc_chr.toString(16)
    } else enc_str += enc_chr.toString(16)
    prand = (mult * prand + incr) % modu
  }
  salt = salt.toString(16)
  while (salt.length < 8)salt = '0' + salt
  enc_str += salt
  return enc_str
}
const createToken = (cookieToken, currentKey) => {
  if (currentKey && key != currentKey) key = currentKey
  return encrypt(cookieToken, key)
}
const parseCookieToken = (cookies) => {
  if (!cookies) return ''
  let cookieToken = Array.isArray(cookies) ? cookies.find(str => str.startsWith('Hm_Iuvt_')) : cookies.match(/Hm_Iuvt_\w+=\w+;/)?.[0]
  if (!cookieToken) return ''
  cookieToken = cookieToken.split(';')[0]
  cookie = cookieToken
  cookieToken = cookieToken.split('=')[1]
  return cookieToken
}
const getToken = () => new Promise((resolve, reject) => {
  let defaultKey = 'Hm_Iuvt_cdb524f42f0ce19b169a8071123a4700'
  request('http://www.kuwo.cn/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
      Referer: 'http://www.kuwo.cn/',
    },
  }, async function(error, response) {
    if (error) return reject(new Error('failed'))
    const token = parseCookieToken(response.headers['set-cookie'])
    if (!token) return reject(new Error('Invalid cookie'))
    const result = response.body.match(/https?:\/\/[/.\w]+\/kw-www\/\w+\.js/g)
    if (result) {
      const getAppToken = (url) => new Promise((resolve) => {
        request(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
            Referer: 'http://www.kuwo.cn/',
          },
        }, function(error, response) {
          if (error) return resolve('')
          const result = response.body.match(/Hm_Iuvt_(\w+)/)
          if (result) {
            resolve(createToken(token, result[0]))
          } else resolve('')
        })
      })
      const appRxp = /app\.\w+\.js/
      const index = result.findIndex(l => appRxp.test(l))
      if (index > -1) {
        const token = getAppToken(result[index])
        if (token) return resolve(token)
        result.splice(index, 1)
      }
      while (result.length) {
        const token = await getAppToken(result.pop())
        if (token) return resolve(token)
      }
      resolve(createToken(token, defaultKey))
    } else {
      resolve(createToken(token, defaultKey))
    }
  })
})


export default {
  info: {
    name: '酷我音乐',
    type: 'music',
    actions: ['musicUrl'],
    qualitys: ['128k', '320k'],
  },

  async musicUrl({ songmid }, quality) {
    quality = qualitys[quality]

    const target_url = `http://www.kuwo.cn/api/v1/www/music/playUrl?mid=${songmid}&type=music&br=${quality}`
    // const target_url = `http://www.kuwo.cn/api/v1/www/music/playUrl?mid=${songmid}&type=convert_url3&br=${quality}`
    /* const target_url = 'https://www.kuwo.cn/url?'
      + `format=mp3&rid=${song_id}&response=url&type=convert_url3&br=128kmp3&from=web`;
    https://m.kuwo.cn/newh5app/api/mobile/v1/music/src/${song_id} */

    if (!token) token = await getToken()

    return new Promise((resolve, reject) => {
      // console.log(songmid, quality)
      request(target_url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
          Referer: 'http://kuwo.cn/',
          Secret: token,
          cookie,
        },
      }, (err, resp) => {
        console.log(resp.body)
        if (err) return reject(err)
        if (resp.body.code != 200) return reject(new Error('failed'))

        resolve(resp.body.data.url)
      })
    })
  },
}
