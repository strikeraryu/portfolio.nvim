- Ngnix store all server configuration in a single place in `/etc/nginx/sites-available`, where `default` is the default configuration file.
- For each configuration file, you can create a symbolic link in `/etc/nginx/sites-enabled` to enable it.
- listen is used to setup which port we need to lister for nginx
```
listen 80; // used for ipv4
listen [::]:80; // used for ipv6, [::] is similar to 0.0.0.0 in ipv4
```
- similarly we can setup the server name which need to by the nginx
```
sever_name abc.com; // this can be use to set a server block for this specific domain
```
- location is used to set the path to where request should be forwarded to


sever block config I used to setup my sub domain for eg.
```
server {
   listen 80;
   listen [::]:80;
   server_name adguard.strikeraryu.com;

   location / {
           proxy_pass http://127.0.0.1:8080;

           proxy_set_header        Host $host;
           proxy_set_header        X-Real-IP $remote_addr;
           proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header        X-Forwarded-Proto $scheme;
           proxy_set_header        Upgrade $http_upgrade;
           proxy_set_header        Connection "upgrade";
           proxy_redirect          off;
           proxy_http_version      1.1;
   }
}
```

Refs: 


202409141620
