---
trigger: model_decision
description: 
globs: 
---
### 新增套餐
POST {{baseUrl}}/api/bundles
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "bundleName": "测试套餐",
  "bundleDesc": "这是一个测试套餐"
}

返回：
{
  "code": 0,
  "msg": "success",
  "data": {
    "bundleId": 108858,
    "bundleName": "更新后的套餐1",
    "bundleDesc": "更新描述",
    "price": 19.9,
    "isActive": 1,
    "isDeleted": 0,
    "createdAt": "2025-05-29T02:38:44.542+00:00",
    "updatedAt": "2025-05-29T02:50:30.948+00:00",
    "products": []
  }
}

### 更新套餐
POST {{baseUrl}}/api/bundles/update/{{bundleId}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "bundleName": "更新后的套餐1",
  "bundleDesc": "更新描述",
  "price": 19.9,
  "appIds": [112688]
}

返回：

{
  "code": 0,
  "msg": "success",
  "data": {
    "bundleId": 110622,
    "bundleName": "更新后的套餐1",
    "bundleDesc": "更新描述",
    "price": 19.9,
    "isActive": 0,
    "createdAt": "2025-05-29T02:56:21.218+00:00",
    "updatedAt": "2025-05-29T07:09:03.997+00:00",
    "products": [
      {
        "appId": 112688,
        "name": "测试产品2",
        "garminImageUrl": "https://example.com/image.png"
      }
    ]
  }
}

### 激活套餐

@isActive = 0

POST {{baseUrl}}/api/bundles/{{bundleId}}/activate/{{isActive}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "code": 0,
  "msg": "success",
  "data": null
}



### 查询单个套餐
GET {{baseUrl}}/api/bundles/{{bundleId}}
Content-Type: application/json
Authorization: Bearer {{token}}

返回：
{
  "code": 0,
  "msg": "success",
  "data": {
    "bundleId": 110622,
    "bundleName": "更新后的套餐1",
    "bundleDesc": "更新描述",
    "price": 19.9,
    "isActive": 0,
    "createdAt": "2025-05-29T02:56:21.218+00:00",
    "updatedAt": "2025-05-29T07:09:03.997+00:00",
    "products": [
      {
        "appId": 112688,
        "name": "测试产品2",
        "garminImageUrl": "https://example.com/image.png"
      }
    ]
  }
}