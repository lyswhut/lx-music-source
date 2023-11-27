import { request } from './lx'
import { compareVersions } from './utils'
import { author, name, version } from '../package.json'

const address = [
  `https://raw.githubusercontent.com/${author}/${name}/master`,
  `https://cdn.jsdelivr.net/gh/${author}/${name}`,
  `https://fastly.jsdelivr.net/gh/${author}/${name}`,
  `https://gcore.jsdelivr.net/gh/${author}/${name}`,
]

const getLatestVersion = async(url, retryNum = 0) => {
  return new Promise((resolve, reject) => {
    request(url, {
      timeout: 10000,
    }, (err, resp) => {
      if (err || resp.statusCode != 200) {
        ++retryNum >= 3
          ? reject(err || new Error(resp.statusMessage || resp.statusCode))
          : getLatestVersion(url, retryNum).then(resolve).catch(reject)
      } else resolve(resp.body)
    })
  }).then(info => {
    if (info.version == null) throw new Error('failed')
    return info.version
  })
}

const getVersion = async(index = 0) => {
  return getLatestVersion(address[index] + '/package.json').then(version => {
    return {
      version,
      url: address[index] + '/dist/lx-music-source.js',
    }
  }).catch(async(err) => {
    index++
    if (index >= address.length) throw err
    return getVersion(index)
  })
}

export const checkLatestVersion = async() => {
  const remoteVersion = await getVersion()
  return compareVersions(version, remoteVersion.version) < 0 ? remoteVersion : null
}
