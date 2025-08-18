---
trigger: model_decision
description: 
globs: 
---
# 本地环境
@base_url = http://localhost:8088

@token = eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImV4cCI6MTc0ODY1ODgxNiwiaWF0IjoxNzQ4NTcyNDE2fQ.uNhEem69nlzRVACQirI7og184YnPHsQprL_W62-mej2-q2EjoHQ9CKRphr5bcj61pBNLQe70t8X-ZX1k8QyflQ

### 上传文件

POST {{base_url}}/api/files/upload
Content-Type: multipart/form-data
Authorization: Bearer {{token}}

file=@/Users/mac/Downloads/test.png
folder=test
suffix=png

返回：

{
    "code": 0,
    "msg": "success",
    "data": "https://wristo-io.s3.amazonaws.com/test/e6f6d787-286f-4c50-9f35-34a6ecc33092.png"
}
