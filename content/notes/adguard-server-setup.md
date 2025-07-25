- Created a docker compose file
```
version: '3'
services:
 adguard:
   image: adguard/adguardhome:latest
   container_name: adguard
   restart: unless-stopped
   ports:
     - "53:53/tcp"
     - "53:53/udp"
     - "67:67/udp" # DHCP server
     - "68:68/tcp" # DHCP server
     - "80:80/tcp"
     - "443:443/tcp"
     - "3000:3000/tcp"
   volumes:
     - ./adguard/work:/opt/adguardhome/work
     - ./adguard/conf:/opt/adguardhome/conf
```
- Server DNS resolver was running on port 53 which was stopping adguard container to get started
    - We create a custom config for DNS resolver, we will create a dir `/etc/systemd/resolved.conf.d` and in that create custom config file `adguardhome.conf`
```
[Resolve]
DNS=127.0.0.1
DNSStubListener=no
```
    - Here we changed the default DNS route 127.0.0.53 to 127.0.0.1 (localhost IP) and also stoped the DNSStubListener whose role is to forward dns query to upstream nameserver like google 8.8.8.8 or others
    - We will backup to old config using `mv /etc/resolv.conf /etc/resolv.conf.backup`
    - Will also create symbolic link to `/run/systemd/resolve/resolv.conf` from `/etc/resolv.conf` so whenever system read `/etc/resolv.conf` this file it will redirect to `run/systemd/resolve/resolv.conf` and this file contains the dyanamic DNS setting managed by systemd-resolved. Command: `ln -s /run/systemd/resolve/resolv.conf /etc/resolv.conf`
    - And now we will just reload/restart systemd-resolved `systemctl reload-or-restart systemd-resolved


Refs: 


202409132254
