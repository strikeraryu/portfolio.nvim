# Basic setup
- create a flash drive with ubunte server image
- logged in bios and changes the order if boot menu
- restarted and choose to install linux

## Installation
- most selected default value
- for network I choosed DHCP (later changed to static IP)
- then selected the drive to install the server

# Server setup
**SSH setup**
    - changed the default port
    - removed password based auth
    - add authorized key for connection

**Static IP setup**
    - changed to config file with biggest number in `etc/netplan`
```yml
# Old config
network:
  ethernets:
    enp4s0:
      dhcp4: true
  version: 2
  wifis: {}

# New config
network:
  version: 2
  renderer: networkd
  ethernets:
    enp4s0:
      addresses:
        - 192.168.1.7/24
      gateway4: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
```
- then ran sudo netplan apply


**Mounted new storage**

**Network storage**
- Setup the network storage using **samba**
- installed it and the create a user using `sudo smbpasswd -a striker`
- And then added a config for share folder in `etc/samba`
```
[share]
path = /mnt/data
valid users = striker
read only = no
```
- restarted the service `sudo systemctl restart smbd.service`
- also connected my mac with the storage `Go>network server` available in `/Volumes/`

**Firewall**
- we can manage firewall using `ufw`
- `sudo ufw enable/disable`
- `sudo ufw allow/deny profile`
    - for ssh `sudo ufw allow ssh` and `sudo ufw allow 2200/tcp` (to allow on other ports)
    - for samba `sudo ufw allow samba`

**netstat**
- common flags `-tulpn`
    - t = tcp
    - u = udp
    - l = listening sockets
    - p = PID and program name
    - n = numerical address


Refs:
[video](https://www.youtube.com/watch?v=2Btkx9toufg)


202409080134
