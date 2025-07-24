# Intuition
The problem requires an efficient way to allocate requests while ensuring fair distribution. Instead of iterating over servers sequentially, we use:
- A **set** to quickly find and allocate free servers.
- A **priority queue** to efficiently release servers when their tasks finish.

Using these structures, we process requests in order while minimizing overhead, ensuring that servers are utilized optimally.

# Approach
We use a **set** to track free servers and a **priority queue** (min-heap) to manage ongoing requests efficiently. The set allows us to quickly find the next available server using `lower_bound`, while the priority queue helps process finished requests in increasing order of completion time.

## Steps:
1. **Initialize structures**:
   - A `set<int>` to track free servers.
   - A `priority_queue<vector<int>>` to manage request completion times.
   - An array `cnt[k]` to store request counts for each server.
2. **Iterate over requests**:
   - Free up servers by checking the priority queue for completed tasks.
   - Find the next available server using `lower_bound(i % k)`. If no suitable server is found, wrap around and take the smallest indexed server.
   - If a server is assigned, remove it from the free set, update its count, and push its finish time into the priority queue.
3. **Determine the busiest servers** by finding the ones with the maximum request count.

# Complexity Analysis
- **Finding a free server:** `O(log k)` due to `set.lower_bound()`.
- **Processing each request:** `O(log k)` due to heap operations.
- **Total Complexity:** `O(n log k)`, where `n` is the number of requests.

# Key Takeaways
- **Efficient server selection**: `set.lower_bound()` helps find the next available server quickly.
- **Handling request completion**: A priority queue ensures we release servers in the correct order.
- **Optimized lookup and processing**: The combination of `set` and `priority_queue` keeps the solution optimal at `O(n log k)`.


# Code
```cpp []
class Solution {
public:
    int find(set<int> &free, int i) {
        if(free.empty())return -1;

        if(free.lower_bound(i)==free.end())return *free.begin();

        return *free.lower_bound(i);
    }

    vector<int> busiestServers(int k, vector<int>& arrival, vector<int>& load) {
        int n = arrival.size(), ans = 0;
        priority_queue<vector<int>> q;
        vector<int> cnt(k);
        set<int> free;
        for(int i=0;i<k;i++)free.insert(i);

        for(int i=0;i<n;i++) {
            while(!q.empty() && -(q.top()[0]) <= arrival[i]) {
                free.insert(q.top()[1]);
                q.pop();
            }

            int s = find(free, i%k);
            if(s==-1)continue;

            free.erase(s);
            ans = max(ans, ++cnt[s]);
            q.push({-arrival[i]-load[i], s});
        }

        vector<int> bs;
        for(int i=0;i<k;i++)if(cnt[i]==ans)bs.push_back(i);

        return bs;
    }
};
```

Refs: 
- [Leetcode](https://leetcode.com/problems/find-servers-that-handled-most-number-of-requests/description)
- [Leetcode My Solution](https://leetcode.com/problems/find-servers-that-handled-most-number-of-requests/solutions/6582015/intuative-request-allocation-using-sets-kyiee)


202503261828
