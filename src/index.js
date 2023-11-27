import { EVENT_NAMES, on, send } from './lx'
import apis from './apis'
import { checkLatestVersion } from './update'

// console.log(window.lx)

on(EVENT_NAMES.request, ({ source, action, info }) => {
  switch (action) {
    case 'musicUrl':
      return apis[source].musicUrl(info.musicInfo, info.type).catch((err) => {
        console.log(err.message)
        return Promise.reject(err)
      })
  }
})

const sources = {}
for (const [source, apiInfo] of Object.entries(apis)) {
  sources[source] = apiInfo.info
}

send(EVENT_NAMES.inited, {
  status: true,
  // openDevTools: true,
  // eslint-disable-next-line no-undef
  openDevTools: mode === 'development',
  sources,
})

checkLatestVersion().then((version) => {
  if (!version) return
  send(EVENT_NAMES.updateAlert, { log: '发现新版本 v' + version.version, updateUrl: version.url })
})
