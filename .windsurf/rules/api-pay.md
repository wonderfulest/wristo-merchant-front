---
trigger: model_decision
description: 
globs: 
---
### 1. 试用状态；手表每5分钟请求一次

POST https://api.wristo.io/api/trials/v1/status
Content-Type: application/json

{
  "appId": 10001,
  "accountToken": "1adb81fbc0f53582020a7589ffd0aedf60b15984",
  "platform": "garmin",
  "device": "006-B3076-00",
  "isTest": false,
  "skipTrial": false,
  "libv": "ga_c_1.3.3",
  "partNumber": "006-B3076-00"
}

返回值：

{
  "code": 0,
  "message": "success",
  "data": {
    "status": "unlicensed",
    "trialDurationInSeconds": null,
    "purchaseStatus": "waitForUser",
    "paymentCode": "835564"
  }
}



### 2. 支付购买
POST {{baseUrl}}/api/trials/v1/purchase
Content-Type: application/json

{
  "code": "222222"
}

返回值：

{
  "code": 0,
  "msg": "success",
  "data": {
    "products": [
      {
        "productName": "测试产品",
        "productDescription": "这是一个测试产品",
        "productId": 1,
        "isBundle": false,
        "merchantName": "wonderful",
        "price": 1.99,
        "imageUrl": "https://example.com/image.png",
        "licenseValidityDurationInDays": null,
        "appId": 10001,
        "allowTipping": null,
        "bundleContent": null
      }
    ],
    "request": {
      "appid": 10001,
      "accounttoken": "4ddb81fbc0f53582020a7589ffd0aedf60b15984",
      "purchaseCode": "222222"
    },
    "detectedLocation": "china"
  }
}

