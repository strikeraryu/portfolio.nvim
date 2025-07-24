# Cap Theorem
- Consistency - All user reads are consistent data
- Availability - All requests are processed in a timely manner
- Partition tolerance - System works despite networks failures between nodes

You can achieve only 2 of 3 at a time.

As partition in a distributed system is required, we need to choose between consistency and availability.

Different Type of consistency
- Strong consistency - All user reads are consistent data
- Causal consistency - Event should appear in order
- Read-Your-Own-Write (RYOW) - User use there own write to read
- Eventual consistency - Data will be eventually consistent

Refs: 


202505191144
