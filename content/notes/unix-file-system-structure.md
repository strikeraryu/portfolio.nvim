- `/bin` [binary] simple binaries are stored in this file like ls, cat
- `/sbin` [system binary] binaries that is used by system admin
- `/boot` this contains necessary files for boot (boot loaders)
- `/etc` [extra] system wide configuration
    - `apt` it contains information regarding different sources
- `/lib` [library] this is where library are stored (which can be required by different binary and application)
- `/mnt` [mount] different mounted devices
- `/opt` [options] manually installed software from different vendors
- `/proc` this is were sudo files are stored regarding processes and cpu
    - `<int>` there is folder for each process
- `/root` this root user home folder
- `/dev` [devices] this store information regarding different hardware devices
    - `sda` is this disk device
- `/srv` [service] this store information regarding service
- `/sys` [system] way to interact with kernal, its not phyical written but create by system
- `/tmp` [temporary] this store temporaries files 
- `/usr` [usr] this contains application and different files installed by the user
- `/var` [variable] this contains files which are expected to grow in size like logs, crash
- `/home` this is where personal file stored for each user


Refs: 
