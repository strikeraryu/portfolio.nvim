# Delegation
Offloading the computation to async workers
- This can be used to reduce response time, to delegate the non-essential work to async workers.

## Types of broker
- Message Queue
    - Eg. SQS, RabbitMQ
    - We will have single type of consumer
    - The message are pushed in the broker and consumer take pull for message from the broker and perform the task.
    - These message are exclusively consumed by the one consumer.
- Message Stream
    - Eg. Kafka, Kinesis
    - We can multiple type of consumers to consume messages from stream
    - Each consumer can iterate over the messages and perform the task, asynchronously. (They are not dependent on each other)
    - These message are remain in the stream, until the retention period expires.

### Kafka Essentials
In kafka there are few entities
- Topic - message are added for some topic
    - Its like type of consumer
- Partition - inside a topic there are multiple partitions, and message are added to a specific partition
    - For each partition there is a consumer and they will consume the message on that partition on there own pace
    - Number of consumer = number of partitions

- Each consumer do commiting after performing the task, these commits is used to track the progress of the consumer
- So if it fails before committing, it will process the message again from the last successful commit.

Refs: 


202412040930
