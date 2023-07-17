import { request } from '../lx'

const qualitys = {
  '128k': '128kmp3',
  '320k': '320kmp3',
  // ape: 'ape',
  // flac: 'flac',
}


export default {
  info: {
    name: '酷我音乐',
    type: 'music',
    actions: ['musicUrl'],
    qualitys: ['128k', '320k'],
  },

  musicUrl({ songmid }, quality) {
    quality = qualitys[quality]

    const target_url = `http://www.kuwo.cn/api/v1/www/music/playUrl?mid=${songmid}&type=music&br=${quality}`
    // const target_url = `http://www.kuwo.cn/api/v1/www/music/playUrl?mid=${songmid}&type=convert_url3&br=${quality}`
    /* const target_url = 'https://www.kuwo.cn/url?'
      + `format=mp3&rid=${song_id}&response=url&type=convert_url3&br=128kmp3&from=web`;
    https://m.kuwo.cn/newh5app/api/mobile/v1/music/src/${song_id} */

    return new Promise((resolve, reject) => {
      // console.log(songmid, quality)
      request(target_url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0',
          Referer: 'http://kuwo.cn/',
          Secret: '6c3e1759abe6bd58f56bb713f6aee0bb738189eae7837be83636389b96fd4d7104c13520',
          Cookie: 'Hm_Iuvt_cdb524f42f0ce19b169b8072123a4727=2bm5QbPQKPZSRHyFN4pbZnGcNJ4J2DZJ',
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
