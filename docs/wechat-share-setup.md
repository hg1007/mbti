# 微信公众号分享功能配置说明

## 前端已完成

前端已集成微信 JS-SDK，实现了以下功能：
- ✅ 自动检测微信浏览器环境
- ✅ 加载微信 JS-SDK (jweixin-1.6.0.js)
- ✅ 关注公众号引导弹窗 UI
- ✅ 分享按钮交互逻辑

## 后端需要实现

### 1. 签名接口

创建一个 API 接口生成微信签名，参考 `src/utils/wechat.ts` 中的 `fetchWxConfig` 函数：

**接口地址：** `POST /api/wechat/signature`

**请求参数：**
```json
{
  "url": "https://yourdomain.com/page"
}
```

**响应格式：**
```json
{
  "debug": false,
  "appId": "wx1234567890abcdef",
  "timestamp": 1234567890,
  "nonceStr": "random_string",
  "signature": "calculated_signature",
  "jsApiList": [
    "updateAppMessageShareData",
    "updateTimelineShareData"
  ]
}
```

**签名生成步骤：**
1. 获取 access_token（使用 appid + appsecret）
2. 使用 access_token 获取 jsapi_ticket
3. 生成随机字符串 nonceStr 和时间戳 timestamp
4. 拼接签名字符串：`jsapi_ticket=TICKET&noncestr=NONCESTR&timestamp=TIMESTAMP&url=URL`
5. 对签名字符串进行 SHA1 加密得到 signature

**参考代码（Node.js）：**
```javascript
const crypto = require('crypto');
const axios = require('axios');

async function getSignature(url) {
  // 1. 获取 access_token（建议缓存，2小时有效）
  const tokenRes = await axios.get(
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
  );
  const accessToken = tokenRes.data.access_token;

  // 2. 获取 jsapi_ticket（建议缓存，2小时有效）
  const ticketRes = await axios.get(
    `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`
  );
  const ticket = ticketRes.data.ticket;

  // 3. 生成签名
  const timestamp = Math.floor(Date.now() / 1000);
  const nonceStr = Math.random().toString(36).substr(2, 15);
  const signatureStr = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
  const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

  return {
    debug: false,
    appId: APPID,
    timestamp,
    nonceStr,
    signature,
    jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
  };
}
```

### 2. 注意事项

- access_token 和 jsapi_ticket 有调用频率限制，建议缓存（有效期 2 小时）
- 签名中的 URL 必须是当前页面的完整 URL（不包含 # 及之后的部分）
- 每个页面的 URL 不同，需要动态生成签名

## 微信公众号后台配置

### 1. 配置 JS 安全域名

登录微信公众号后台：
1. 进入「设置与开发」→「公众号设置」→「功能设置」
2. 找到「JS接口安全域名」，点击「设置」
3. 填写你的域名（如：`yourdomain.com`），不需要加 `http://` 或 `https://`
4. 下载验证文件并上传到域名根目录

### 2. 配置网页授权域名（可选）

如果需要获取用户信息：
1. 进入「设置与开发」→「公众号设置」→「功能设置」
2. 找到「网页授权域名」，点击「设置」
3. 填写授权回调域名

### 3. 获取 AppID 和 AppSecret

1. 进入「设置与开发」→「基本配置」
2. 记录 AppID（开发者ID）
3. 重置并保存 AppSecret（开发者密码），只显示一次

## 使用方式

### 在页面中配置分享内容

```typescript
import { configShareToFriend, configShareToTimeline } from '@/utils/wechat'

// 在页面 onMounted 中调用
onMounted(() => {
  configShareToFriend({
    title: '性格密码研究所 - MBTI人格测试',
    desc: '探索你的性格类型，了解真实的自己',
    link: window.location.href,
    imgUrl: 'https://yourdomain.com/logo.png'
  })

  configShareToTimeline({
    title: '性格密码研究所 - MBTI人格测试',
    link: window.location.href,
    imgUrl: 'https://yourdomain.com/logo.png'
  })
})
```

### 分享按钮行为

当前实现：
- **微信浏览器内**：显示关注公众号引导弹窗
- **外部浏览器**：复制公众号名称到剪贴板

如需修改为直接分享页面，可以调用 `configShareToFriend` 和 `configShareToTimeline` 函数。

## 测试

1. 将页面部署到已配置的域名
2. 在微信中打开页面
3. 点击右上角「...」→「分享给朋友」或「分享到朋友圈」
4. 检查分享卡片是否正确显示标题、描述和图片

## 常见问题

**Q: 签名验证失败**
- 检查 URL 是否正确（不包含 # 及之后的部分）
- 检查 access_token 和 jsapi_ticket 是否过期
- 检查时间戳是否正确（秒级，不是毫秒级）

**Q: 分享卡片不显示图片**
- 图片 URL 必须是绝对路径（包含 https://）
- 图片大小建议 300x300px 以上
- 检查图片是否可以正常访问

**Q: iOS 和 Android 表现不一致**
- iOS 使用进入页面时的 URL 生成签名
- Android 使用当前页面的 URL 生成签名
- 建议在路由切换后重新初始化 SDK
