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

