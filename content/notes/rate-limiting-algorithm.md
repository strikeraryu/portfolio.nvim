# Rate Limiting Algorithm
Limiting the number of requests that can be made to a resource.

## Bucket Algorithm
- There is a virtual bucket of tokens that is maintained for each resource. Which is filled with tokens at constant rate.
- Each request consumes a token from the bucket. If the bucket is empty, the request is rejected. (429)

## Leaky Bucket Algorithm
- Similar to the bucket algorithm, except now token reduce also at come constant rate.
- Benefit over bucket algorithm that there be be burst of request on server when the bucket was full. 
- But in this algo the burst is minimized as the bucket is leaky it reaches full capacity at longer time. But as it is filling at a constant rate it can handle a constant rate of request for similar throughput.

## Window Algorithm
- It allow only a set of request during a window.
- The problem is high burst during intersection of window.

## Sliding Window Algorithm
- Similar to window algorithm, but the window slide across time.
- So there is no issue of burst request at intersection.
- Need management of queue for requests

Refs: 


202505191044
