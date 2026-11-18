/**
 * WeChat JS-SDK 集成工具
 * 用于在微信浏览器内初始化分享功能
 */

// 微信 JS-SDK 配置
interface WxConfig {
  debug: boolean
  appId: string
  timestamp: string
  nonceStr: string
  signature: string
  jsApiList: string[]
}

// 分享内容配置
interface ShareConfig {
  title: string
  desc: string
  link: string
  imgUrl: string
}

/**
 * 加载微信 JS-SDK 脚本
 */
function loadWeChatSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.wx) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load WeChat JS-SDK'))
    document.head.appendChild(script)
  })
}

/**
 * 从后端获取签名配置
 * TODO: 替换为你的后端接口地址
 */
async function fetchWxConfig(url: string): Promise<WxConfig> {
  const response = await fetch('/api/wechat/signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  })

  if (!response.ok) {
    throw new Error('Failed to fetch WeChat signature')
  }

  return response.json()
}

/**
 * 初始化微信 JS-SDK
 */
export async function initWeChatSDK() {
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent)
  if (!isWeChat) return

  try {
    await loadWeChatSDK()

    // 获取当前页面 URL（不包含 hash）
    const url = window.location.href.split('#')[0]
    const config = await fetchWxConfig(url)

    // 初始化微信 JS-SDK
    window.wx.config({
      debug: config.debug,
      appId: config.appId,
      timestamp: config.timestamp,
      nonceStr: config.nonceStr,
      signature: config.signature,
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData'
      ]
    })

    // 配置成功后设置分享内容
    window.wx.ready(() => {
      console.log('WeChat JS-SDK initialized')
    })

    window.wx.error((res: any) => {
      console.error('WeChat JS-SDK error:', res)
    })
  } catch (error) {
    console.error('Failed to init WeChat SDK:', error)
  }
}

/**
 * 配置分享给朋友的内容
 */
export function configShareToFriend(config: ShareConfig) {
  if (!window.wx) return

  window.wx.ready(() => {
    window.wx.updateAppMessageShareData({
      title: config.title,
      desc: config.desc,
      link: config.link,
      imgUrl: config.imgUrl,
      success: () => {
        console.log('Share to friend config set')
      }
    })
  })
}

/**
 * 配置分享到朋友圈的内容
 */
export function configShareToTimeline(config: ShareConfig) {
  if (!window.wx) return

  window.wx.ready(() => {
    window.wx.updateTimelineShareData({
      title: config.title,
      link: config.link,
      imgUrl: config.imgUrl,
      success: () => {
        console.log('Share to timeline config set')
      }
    })
  })
}

// 类型声明
declare global {
  interface Window {
    wx: any
  }
}
