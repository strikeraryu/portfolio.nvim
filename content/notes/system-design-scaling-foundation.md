# Scaling 
- The basic how we can increase resources so the infra can handle more requests.

## Scaling Types
- Vertical Scaling 
    - Adding more resources to the server (adding more CPU, RAM, DISK etc)
    - Single point of failure
    - Easy to manage
    - Limited to hardware
- Horizontal Scaling
    - Adding more server in the infra
    - Linear scaling
    - We need to ensure we pre-scale if we are excepting a sudden spike (to avoid cold start)
    - Fault Tolerance
    - Network partition
    - Complex architectural design

> Scaler bottom-up, scale first dependency services (DB, cache etc), then dependent services

## Scaling DB
- Read Replica
- Vertical Scaling
- Sharding




Refs: 


202412020942
