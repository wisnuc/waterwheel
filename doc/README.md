### Sample
requests<p>

url format:  hostip/nas/(nasuuid)/waterwheel/(waterwheeluuid)/(requestuuid)/(resourceuuid)<p>
example:  192.168.5.132/nas/1111/waterwheel/2222/3333/4444<p>

files<p>

url format:  hostip/nas/(nasuuid)/files/(waterwheeluuid)/(requestuuid)/(resourceuuid)<p>
example:  192.168.5.132/nas/1111/files/2222/3333/4444<p>

***

+ **Check Connection Status for NAS & Cloud**<p>
  - Format<p>
  `GET /nas/UUID`<p>
  
  - Example request<p>
  `GET 192.168.5.132/nas/456fe918-1872-4ec1-b4f8-c09b62b49d72`<p>
  
  - Example response<p>
    ```
    Success:
    ""

    Failed:
    "nas not found"
    ```

+ **Create A New Link for Nas & Cloud**<p>
  - Format<p>
  `POST /nas/UUID`<p>
  
  - Example request<p>
  `POST 192.168.5.132/nas/456fe918-1872-4ec1-b4f8-c09b62b49d72`<p>
  
  - Example response<p>
    ```
    Success:
    "fd094596-d095-4a8a-a233-f408498897c5"

    Failed:
    "???"
    ```

+ **Create A New Request for Cloud**<p>
  - Format<p>
  `POST /nas/UUID/waterwheel/linkUUID`<p>
  
  - Example request<p>
  `POST 192.168.5.132/nas/456fe918-1872-4ec1-b4f8-c09b62b49d72/waterwheel/fd094596-d095-4a8a-a233-f408498897c5`<p>
  
  - Example response<p>
    ```
    Success:
    {
        "uuid": "c28c8876-6288-4442-9507-891a916d5214",
        "status": "ready",
        "resource": [
            {
                "id": "ff66e574-f0bc-4d3f-bed8-90baee45e5a9",
                "resource": "2a9b0963652a7647780dc13fd37d160720421ce8181dadd530e6a16203832f97"
            }
        ]
    }{
        "uuid": "c28c8876-6288-4442-9507-891a916d5214",
        "status": "ready",
        "resource": [
            {
                "id": "ff66e574-f0bc-4d3f-bed8-90baee45e5a9",
                "resource": "2a9b0963652a7647780dc13fd37d160720421ce8181dadd530e6a16203832f97"
            }
        ]
    }

    Failed:
    "???"
    ```
    
+ **Upload A File To Cloud**<p>
  - Format<p>
  `POST /nas/UUID/files/linkUUID/tankID/tankResourceID`<p>
  
  - Example request<p>
  `POST 192.168.5.132/nas/456fe918-1872-4ec1-b4f8-c09b62b49d72/files/fd094596-d095-4a8a-a233-f408498897c5/c28c8876-6288-4442-9507-891a916d5214/ff66e574-f0bc-4d3f-bed8-90baee45e5a9`<p>
  
  - Example response<p>
    ```
    Success:
    "success"

    Failed:
    "???"
    ```
