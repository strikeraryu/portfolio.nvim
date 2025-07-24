# Base
**Reading Data**
- Fetch data from backend about offline and online status. Can have a bulk api to fetch data for multiple users.
- `User_Id <=> status[Boolean]` this is a key-value pair

**Updating Data**
- Pull based model will not work as backend can't make call to FE to fetch the data. Also Backend is stateless so we dont maintain the connection.
- So FE will push the data (Push based model) - Heartbeat
    - We need to push data periodically, because we can't send data only when user logs in or logs out, As we can't handle the case when user machine crashes
    - So when FE don't send alive update for long while we mark it as offline
    - `User_Id <=> timestamp` Now we need to store the time of last alive update, now we can choose a threshold to mark user as offline

## Scaling
- user_id(int - 4b) and timestamp(int - 4b), so per entry 8b
- for 1 billion users the storage will require around 8gb

- We can improve the storge by only storing record for the active users
- So we need to delete the data after threshold
    - One Option is to use cron job, but this will complicate things
    - Another option is we can store different store system - redis, mongodb. This provide us both a db to store key value and TTL/expiry
        - Now we need to update TTL after each heartbeat

### High Request handling
- If we receive heartbeat every 10s then for 1m active users we will have 6m/min for our backend and same on DB as we need to update it
- For each TCP connect make we make 5 trips at_least (3-way handshake and 2 way tear_down) which is expensive
- **Connection Pooling** - Pre-established tcp connection with DB, As we don't need make new connection each time for a simple micro-update. We can get a better performance
    - We provide min/max for connection pool.
    - We should also mention TTL, so connection kills once unused
    - [Practice] Connection Poll max as 1.2x the avg (max possible connection / max number of server

Refs: 


202408110354
