# Patterns

### Soft Deletes
- When a record is deleted we mark it as delete but not delete it actually
- This can help in mainting a archive for deleted items for later
- Soft Delete is easy of DB also as we are not deleting the record (which will can rebalancing of B-tree) but just updating the record

# Internals

### Long text VS Short text
- Long text is stored is reference in DB.
- Short text is stored with other columns


### Different ways to store datatime
- As datetime db internal type - as serialized format (different db store datetime in different way)
    - If db store the date time as string the it can be inefficient as we need to do parsing again and again 
    - And it can be heavy on size and index
- As epoch integer - seconds from 1st jan 1970
    - THis is lightweight and efficient
- As custom format (int) YYYYMMDD - 20240824 (this was done by red-bus as datetime was becoming bottleneck for them)

## Locking

### Pessimistic Locking
- Shared Lock
- Exclusive Lock

There is a risk of deadlock. Two different transaction can wait on different rows which are locked by each other.
MySql and other modern RDBMS internally handle this using deadlock detection. They do not allow lock to be applied if there is a possibility of deadlock.

#### Shared Lock
- Transaction is allowed to read the row but not update the row.
- `select ... where id in (1, 2) for share`
- If the transaction is trying to modify the it will upgrade to exclusive lock.

#### Exclusive Lock
- Transaction is not allowed to read and update the row.
- `select ... where id in (1, 2) for update`
- I can skip lock using `for update skip locked`
- there is also option of no wait `select ... where id in (1, 2) for update nowait`

## Key value store (redis)
- Redis to lazy delete, whenever a expired key is accesssed it deleted it.
- It also do perodiocally clean up expired keys, it random picks 20 keys and check for expired key and delete them. If the delete key is greater then 25% then repeat the process


Refs: 


202408241409
