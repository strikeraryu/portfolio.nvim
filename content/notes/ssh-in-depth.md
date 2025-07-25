# SSH

## SSH Server
- `openssh-server` is required to allow connection to a device
- `sshd` or `ssh` is referred to ssh-server
- check status using `systemctl status sshd`
- If we stop sshd existing connection wont drop
- SSH host key are defined at `/etc/ssh` which is use for the fingerprint 

### Config
- We can change the config for the server using `/etc/ssh/sshd_config`
    - `#PasswordAuthentication yes/no` can use the disable the password auth
        - somtimes you need to disable same config in `/etc/ssh/sshd_config.d/50-cloud-init.conf`

## SSH Client
- SSH client is required to connect with a device `which ssh` can be used to verify
- We can use command `ssh user@ip` to connect
    - can use `-p <port>` to use different port

### SSH Keys
- `ssh-keygen` can be used to create new keys (**If the key already exists it will override the value**)
- `ssh-keyget -t <type | ed25519 | rsa>  -C <comment>` default type is RSA and default comment is user_name@machine_name
- key fingerprint and random art are a unique identifier for the ssh key (condense for), So it is easy to compare value

**Public-Private Keys**
- 2 keys are generated when we generate SSH keys - public and private
    - Public Key is used to be stored at the server we want to connect (in `.ssh/authorized_keys`)
    - Private Key is then compared with public key stored there to establish a connection (public and private key are mathematically linked)
- By default following files are used as private key to compare (is not mention in config else_wise) + the keys loaded in ssh-agent 
    - ~/.ssh/id_rsa
    - ~/.ssh/id_dsa
    - ~/.ssh/id_ecdsa
    - ~/.ssh/id_ed25519
- if we want to use another file we can use `ssh -i <keyname>` command
- we can add config to use other files
```
Host *
  IdentityFile ~/.ssh/id_ed25519
```

- To clear all key we can use `ssh-add -D`

> `ssh-copy-id -i <path-to-pub-key> user@ip` This command can be used to add public in authorized_keys (in place of doing ssh into the server and then pasting the key)

### Hosts and Config
- Once you allow a host it stores the SSA finger print in `.ssh/known_hosts`
- We can create alias host using `.ssh/config` (not created by default)
```
eg.

Host MyServer
    Hostname <ip-address>
    Port 22
    User root
```
- For it we need to change the host name to different and use response back to the original host
```
Host github.com-user-a
  AddKeysToAgent no
  HostName github.com
  User git
  IdentityFile <path>
```

### SSH-Agent
- This is use to load the keys and paraphrase in memory so we dont need to mention it again and again, if some GUI is not that to add it in memory
- TO do that first we need to start SSH-agent using `eval "${ssh-agent}"`
- We can use this command to add to ssh agent using `ssh-add <path-to-priv-key>`
- We can also set if we want to keys get automatically added to the agent
```
Host *
  AddKeysToAgent yes
```

### Logs And Debug
- auth logs about the SSH connection is stored in `/var/log/auth2.log`, this can be used to debug/check the SSH connections
    - or we can use `journalctl -fu ssh`
- We can Use `ssh -v` to get verbose log
- If firewall block a connection It will show error timeout (not that the connection in blocked)

#### Possible Issues
- If `.ssh` folder or private keys is allowed to other users apart from main user (`drwx------`) then you wont be able to connect to the server 



Refs: 


202408140052
