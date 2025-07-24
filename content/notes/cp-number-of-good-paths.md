# Intuition
A path exists between two nodes if they are connected in any way. To determine good paths efficiently, we start processing nodes in increasing order of their values. This ensures that when connecting nodes, all paths between them consist only of nodes with values less than or equal to the current maximum weight.

To achieve this, we utilize **Disjoint Set Union (DSU)** to manage connectivity between nodes and determine if two nodes belong to the same connected component.

For each edge, we consider the **maximum weight of the two endpoints** while iterating. This weight represents the highest value in the connected components up to that point.

## Approach
1. **Sort Nodes by Value:**
   - Use a map `m` to group nodes by their values.
   - This ensures we process nodes in increasing order of their values.

2. **Sort Edges by Maximum Endpoint Value:**
   - For each edge `(u, v)`, consider `max(vals[u], vals[v])` as the edge weight.
   - Sort edges based on this weight.

3. **Union-Find Data Structure (DSU):**
   - Use the `find` function to get the representative of a component.
   - Use the `join` function to merge components.

4. **Iterate Through Edges:**
   - Traverse sorted edges and join their components.
   - For each node with the current value, count how many belong to the same component.
   - Compute the number of valid paths within each component using combinations: $$paths = c(c-1)/2 $$
    where `c` is the count of nodes in the same component.

5. **Return Total Count of Good Paths:**
   - Every node itself is a trivial good path, so add `n` to the final count.

# Complexity Analysis
- **Sorting nodes and edges:** `O(n log n)`
- **Union-Find operations:** `O(n α(n))`, where `α(n)` is the inverse Ackermann function.
- **Overall complexity:** `O(n log n)`

# Code
```cpp []
class Solution {
public:
    int find(int n, vector<int>& par) {
        if(par[n] == n) return n;
        return par[n] = find(par[n], par);
    }

    void join(int x, int y, vector<int>& par) {  
        par[find(x, par)] = find(y, par);
    }

    int numberOfGoodPaths(vector<int>& vals, vector<vector<int>>& edges) {
        int n = (int)vals.size(), cnt = 0;
        vector<vector<int>> wedges;
        vector<int> par(n);
        map<int, vector<int>> m;

        for(int i = 0; i < n; i++) m[vals[i]].push_back(i);
        for(vector<int>& edge : edges) wedges.push_back({max(vals[edge[0]], vals[edge[1]]), edge[0], edge[1]});
        for(int i = 0; i < n; i++) par[i] = i;

        sort(wedges.begin(), wedges.end());

        for(int i = 0; i < n-1;) {
            int w = wedges[i][0];
            while(i < (n-1) && wedges[i][0] == w) { join(wedges[i][1], wedges[i][2], par); i++; }

            map<int, int> tmp;
            for(int k : m[w]) tmp[find(k, par)]++;
            for(auto& p : tmp) cnt += (p.second - 1)*p.second/2;

        }
        return cnt + n;
    }
};
```

Refs: 
- [Leetcode](https://leetcode.com/problems/number-of-good-paths/)
- [Leetcode My Solution](https://leetcode.com/problems/number-of-good-paths/solutions/6595885/intuitive-approach-with-in-depth-explana-0lv0)


202503301531
