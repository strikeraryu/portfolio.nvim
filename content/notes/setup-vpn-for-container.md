
## Setup VPN for container

### docker-compose.yml

```
vpn:
image: qmcgaw/gluetun
cap_add:
  - NET_ADMIN
volumes:
  - ./gluetun:/gluetun
environment:
  - VPN_SERVICE_PROVIDER=private internet access
  - OPENVPN_USER=${OPENVPN_USER}
  - OPENVPN_PASSWORD=${OPENVPN_PASSWORD}
  - SERVER_REGIONS=India
```

command to start VPN container `docker-compose run -d --rm --name vpn vpn`
can use network mode as `container:vpn` to use VPN container

Refs: 


202410202042
