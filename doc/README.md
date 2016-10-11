# WaterWheel's RESTFUL API

***

### Preliminaries

+ url format: <p>
  - Request Related<p>
    `(hostip)/nas/(nasuuid)/waterwheel/(waterwheeluuid)/(requestuuid)/(resourceuuid)`<p>
    Example: 192.168.5.132/nas/456fe918-1872-4ec1-b4f8-c09b62b49d72/waterwheel/fd094596-d095-4a8a-a233-f408498897c5/c28c8876-6288-4442-9507-891a916d5214/ff66e574-f0bc-4d3f-bed8-90baee45e5a9<p>

  - Files Related<p>
    `(hostip)/nas/(nasuuid)/files/(waterwheeluuid)/(requestuuid)/(resourceuuid)`<p>
    Example: 192.168.5.132/nas/456fe918-1872-4ec1-b4f8-c09b62b49d72/files/fd094596-d095-4a8a-a233-f408498897c5/c28c8876-6288-4442-9507-891a916d5214/ff66e574-f0bc-4d3f-bed8-90baee45e5a9<p>

***

### Interface definition

+ **Check Connection Status for NAS & Cloud**<p>
  - Format<p>
  `GET /nas/(nasuuid)`<p>
  
  - Example request<p>
  `GET 192.168.5.132/nas/456fe918-1872-4ec1-b4f8-c09b62b49d72`<p>
  
  - Example response<p>
    Success:
      ```
      ""
      ```

    Failed:    
      ```
      "nas not found"
      ```

+ **Create A New WaterWheelUUID Link for Nas & Cloud**<p>
  - Format<p>
    `POST /nas/(nasuuid)`<p>
  
  - Example request<p>
    `POST 192.168.5.132/nas/456fe918-1872-4ec1-b4f8-c09b62b49d72`<p>
    PS: `Server will return a new UUID as waterwheeluuid.`<p>
  
  - Example response<p>
    Success:    
      ```
      "fd094596-d095-4a8a-a233-f408498897c5"
      ```

    Failed:
      ```
      "nas not found"
      ```
    
+ **Get All Infors With Specified WaterWheelUUID**<p>
  - Format<p>
    `GET /nas/(nasuuid)/waterwheel/(waterwheeluuid)`<p>
  
  - Example request<p>
    `GET 192.168.5.132/nas/456fe918-1872-4ec1-b4f8-c09b62b49d72/waterwheel/fd094596-d095-4a8a-a233-f408498897c5`<p>
  
  - Example response<p>
    Success:
      ```
      [
          {
            "uuid": "6db24029-547b-4f6c-ae20-088c10c1df33",
            "timestamp": 1476088155207,
            "tanks": [
              {
                "uuid": "7de5450f-f778-40df-b20c-557acca0330f",
                "status": "done",
                "resource": [
                  {
                      "id": "1fb7928a-c90d-461b-91d7-d081d9d25493",
                      "resource": "2a9b0963652a7647780dc13fd37d160720421ce8181dadd530e6a16203832f97"
                  }
                ]
              }
            ]
          },
          {
            "uuid": "4708a3de-ac9a-4bc8-ac14-dc0b1c8e110b",
            "timestamp": 1476088265939,
            "tanks": [
              {
                "uuid": "282436c0-0229-4c74-9814-457398c61bb2",
                "status": "done",
                "resource": [
                  {
                      "id": "27722bb9-3627-4fea-a53c-4fe149d41582",
                      "resource": "2a9b0963652a7647780dc13fd37d160720421ce8181dadd530e6a16203832f97"
                  }
                ]
              }
            ]
          },
      ...
      ```

    Failed:
      ```
      "???"
      ```

+ **Create A New Request for Cloud**<p>
  - Format<p>
    `POST /nas/(nasuuid)/waterwheel/(waterwheeluuid)`<p>
  
  - Example request<p>
    `POST 192.168.5.132/nas/456fe918-1872-4ec1-b4f8-c09b62b49d72/waterwheel/fd094596-d095-4a8a-a233-f408498897c5`<p>
    PS: Have to contain `data` field which to tell Cloud what to do next, just like `{'data':["2a9b0963652a7647780dc13fd37d160720421ce8181dadd530e6a16203832f97"]}`, it tells server to prepare for upload file.
  
  - Example response<p>
    Success:
      ```
      {
        "uuid": "c28c8876-6288-4442-9507-891a916d5214",
        "status": "ready",
        "resource": [
          {
              "id": "ff66e574-f0bc-4d3f-bed8-90baee45e5a9",
              "status": "ready",
              "resource": "2a9b0963652a7647780dc13fd37d160720421ce8181dadd530e6a16203832f97"
          }
        ]
      }
      {
        "uuid": "c28c8876-6288-4442-9507-891a916d5214",
        "status": "ready",
        "resource": [
          {
              "id": "ff66e574-f0bc-4d3f-bed8-90baee45e5a9",
              "status": "ready",
              "resource": "2a9b0963652a7647780dc13fd37d160720421ce8181dadd530e6a16203832f97"
          }
        ]
      }
      ```

    Failed:
      ```
      "nas not found"
      "need request data"
      ```
    
+ **Upload A File To Cloud**<p>
  - Format<p>
    `POST /nas/(nasuuid)/files/(waterwheeluuid)/(requestuuid)/(resourceuuid)`<p>
  
  - Example request<p>
    `POST 192.168.5.132/nas/456fe918-1872-4ec1-b4f8-c09b62b49d72/files/fd094596-d095-4a8a-a233-f408498897c5/c28c8876-6288-4442-9507-891a916d5214/ff66e574-f0bc-4d3f-bed8-90baee45e5a9`<p>
  
  - Example response<p>
    Success:
      ```
      "success"
      ```

    Failed:
      ```
      "digest is invalid"
      "url is invalid"
      ```

+ **Download A File From Cloud**<p>
  - Format<p>
    `GET /nas/(nasuuid)/files/(waterwheeluuid)/(requestuuid)/(resourceuuid)`<p>
  
  - Example request<p>
    `GET 192.168.5.132/nas/456fe918-1872-4ec1-b4f8-c09b62b49d72/files/fd094596-d095-4a8a-a233-f408498897c5/c28c8876-6288-4442-9507-891a916d5214/ff66e574-f0bc-4d3f-bed8-90baee45e5a9`<p>
  
  - Example response<p>
    Success:
      ```
      "undefined"
      ```

    Failed:
      ```
      "???"
      ```

+ **Set Tank Status**<p>
  - Format<p>
    `PATCH /nas/(nasuuid)/waterwheel/(waterwheeluuid)/(requestuuid)`<p>
  
  - Example request<p>
    `PATCH 192.168.5.132/nas/456fe918-1872-4ec1-b4f8-c09b62b49d72/waterwheel/95ae4214-b7db-42b2-9dbe-00739425e005/2a0be8d8-5523-4a49-96b4-19f088367665`<p>
    PS: Have to contain `status` field which includes `ready` | `done` | `error`.
  
  - Example response<p>
    Success:
      ```
      "request updated"
      ```

    Failed:
      ```
      "???"
      ```

+ **Delete Tank**<p>
  - Format<p>
    `DELETE /nas/(nasuuid)/waterwheel/(waterwheeluuid)/(requestuuid)`<p>
  
  - Example request<p>
    `DELETE 192.168.5.132/nas/456fe918-1872-4ec1-b4f8-c09b62b49d72/waterwheel/95ae4214-b7db-42b2-9dbe-00739425e005/2a0be8d8-5523-4a49-96b4-19f088367665`<p>
  
  - Example response<p>
    Success:
      ```
      "delete request success"
      ```

    Failed:
      ```
      "???"
      ```
    
+ **Delete Link**<p>
  - Format<p>
    `DELETE /nas/(nasuuid)/waterwheel/(waterwheeluuid)`<p>
  
  - Example request<p>
    `DELETE 192.168.5.132/nas/456fe918-1872-4ec1-b4f8-c09b62b49d72/waterwheel/95ae4214-b7db-42b2-9dbe-00739425e005`<p>
  
  - Example response<p>
    Success:
      ```
      "delete waterwheel success"
      ```

    Failed:
      ```
      "File was not found on this server."
      ```
