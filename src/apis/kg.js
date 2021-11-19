import { request } from '../lx'

// const qualitys = {
//   '128k': 'PQ',
//   '320k': 'HQ',
//   flac: 'SQ',
//   flac32bit: 'ZQ',
// }

// https://github.com/listen1/listen1_chrome_extension/blob/master/js/provider/kugou.js
export default {
  info: {
    name: '酷狗音乐',
    type: 'music',
    actions: ['musicUrl'],
    qualitys: ['128k'],
  },

  musicUrl({ hash, albumId }, quality) {
    // quality = qualitys[quality]
    let target_url = `https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash=${hash}&dfid=dfid&mid=mid&platid=4&album_id=${albumId}`

    return new Promise((resolve, reject) => {
      console.log(hash, quality)
      request(target_url, {
        method: 'GET',
      }, (err, resp) => {
        console.log(resp.body)
        if (err) return reject(err)
        const data = resp.body

        if (data.status !== 1) return reject(new Error(data.err_code))
        if (data.data.privilege > 9) return reject(new Error('failed'))

        resolve(resp.body.data.play_url)
      })
    })
  },
}
