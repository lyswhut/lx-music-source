import { request } from '../lx'

const qualitys = {
  '128k': 'PQ',
  '320k': 'HQ',
  flac: 'SQ',
  flac24bit: 'ZQ',
}

// https://github.com/listen1/listen1_chrome_extension/blob/master/js/provider/migu.js
export default {
  info: {
    name: '咪咕音乐',
    type: 'music',
    actions: ['musicUrl'],
    qualitys: ['128k', '320k', 'flac', 'flac24bit'],
  },

  musicUrl({ songmid }, quality) {
    quality = qualitys[quality]
    /*
    const copyrightId = track.id.slice('mgtrack_'.length);
    const type = 1;
    // NOTICE：howler flac support is not ready for production.
    // Sometimes network keep pending forever and block later music.
    // So use normal quality.
    // switch (track.quality) {
    //   case '110000':
    //     type = 2;
    //     break;
    //   case '111100':
    //     type = 3;
    //     break;
    //   case '111111':
    //     type = 4;
    //     break;
    //   default:
    //     type = 1;
    // }
    const k =
      '4ea5c508a6566e76240543f8feb06fd457777be39549c4016436afda65d2330e';
    // type parameter for music quality: 1: normal, 2: hq, 3: sq, 4: zq, 5: z3d
    const plain = forge.util.createBuffer(
      `{"copyrightId":"${copyrightId}","type":${type},"auditionsFlag":0}`
    );
    const salt = forge.random.getBytesSync(8);
    const derivedBytes = forge.pbe.opensslDeriveBytes(k, salt, 48);
    const buffer = forge.util.createBuffer(derivedBytes);
    const key = buffer.getBytes(32);
    const iv = buffer.getBytes(16);
    const cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({ iv });
    cipher.update(plain);
    cipher.finish();
    const output = forge.util.createBuffer();
    output.putBytes('Salted__');
    output.putBytes(salt);
    output.putBuffer(cipher.output);
    const aesResult = forge.util.encode64(output.bytes());
    const publicKey =
      '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8asrfSaoOb4je+DSmKdriQJKW\nVJ2oDZrs3wi5W67m3LwTB9QVR+cE3XWU21Nx+YBxS0yun8wDcjgQvYt625ZCcgin\n2ro/eOkNyUOTBIbuj9CvMnhUYiR61lC1f1IGbrSYYimqBVSjpifVufxtx/I3exRe\nZosTByYp4Xwpb1+WAQIDAQAB\n-----END PUBLIC KEY-----';
    const secKey = forge.util.encode64(
      forge.pki.publicKeyFromPem(publicKey).encrypt(k)
    );
    const target_url = `https://music.migu.cn/v3/api/music/audioPlayer/getPlayInfo?dataType=2&data=${encodeURIComponent(
      aesResult
    )}&secKey=${encodeURIComponent(secKey)}`;
    */
    const target_url = `https://app.c.nf.migu.cn/MIGUM2.0/strategy/listen-url/v2.2?netType=01&resourceType=E&songId=${songmid}&toneFlag=${quality}`
    return new Promise((resolve, reject) => {
      console.log(songmid, quality)
      request(target_url, {
        method: 'GET',
        headers: {
          channel: '0146951',
          uid: 1234,
        },
      }, (err, resp) => {
        console.log(resp.body)
        if (err) return reject(err)
        let playUrl = resp.body.data?.url
        if (!playUrl) return reject(new Error('failed'))

        if (playUrl.startsWith('//')) playUrl = `https:${playUrl}`

        resolve(playUrl.replace(/\+/g, '%2B'))
      })
    })
  },
}
