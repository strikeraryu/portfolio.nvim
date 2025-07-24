# **Intuition**
The problem involves finding the minimum cost between two nodes in a weighted undirected graph using the bitwise AND operation. The key observation is that if a path exists between two nodes, the optimal answer will always be obtained by visiting all the nodes in that connected component. This is because the bitwise AND operation (`&`) can only decrease or remain the same as we traverse more edges.

Since we can visit nodes and edges multiple times, there are no restrictions on the number of times we can traverse an edge. Therefore, the best approach is to find all connected components and determine the cumulative AND value for each connected component. Once we have this information, we can efficiently answer queries about the minimum cost between any two nodes.

To implement this, we use **Disjoint Set Union (DSU)** to:
1. **Track which nodes belong to the same connected component**.
2. **Maintain the bitwise AND of all edge weights within each component**.


# **Approach**
1. **Initialize DSU Structures**:
   - `p`: Parent array to track connected components.
   - `a`: Array to store the AND value of all edges within each connected component.
   - `c`: Size array for Union-Find optimizations.

2. **Build the Connected Components**:
   - Iterate through all given edges and merge the nodes into the same DSU component.
   - While merging two components, update the AND value of the entire component using `a[parent] &= edge_weight`.

3. **Process Queries Efficiently**:
   - For each query `(u, v)`, check if they belong to the same component using DSU.
   - If `find(u) == find(v)`, return the stored AND value of that component (`a[parent]`).
   - Otherwise, return `-1`, indicating no path exists.


# **Complexity Analysis**
- **Finding & Merging Nodes in DSU**: Almost **O(1)** (using path compression + union by size).
- **Processing Edges**: **O(E)** (each edge merges components).
- **Processing Queries**: **O(Q)** (each query performs two `find()` operations).
- **Overall Complexity**: **O(N + E + Q)**, which is very efficient.


# **Edge Cases Considered**
1. **Disconnected Nodes**: Queries where no path exists should return `-1`.
2. **Graph with One Node**: Should handle a single-node case correctly.
3. **All Nodes Connected**: If all nodes are connected, all queries should return the same AND value.


# **Code Explanation**
```cpp
class Solution {
public:
    // DSU find function with path compression
    int find(int a, vector<int> &p) {
        if (p[a] == a) return a;
        return p[a] = find(p[a], p); // Path compression
    }

    // Merge two nodes in DSU and update AND values
    void add(vector<int> edge, vector<int> &p, vector<int> &a, vector<int> &c) {
        int p1 = find(edge[0], p);
        int p2 = find(edge[1], p);

        // Update AND value for both components
        a[p1] = a[p1] & a[p2] & edge[2];
        a[p2] = a[p1]; // Ensure consistency

        // If already in the same component, no need to merge
        if (p1 == p2) return;

        // Union by size
        if (c[p1] > c[p2]) {
            p[p2] = p1;
            c[p1] += c[p2];
        } else {
            p[p1] = p2;
            c[p2] += c[p1];
        }
    }

    vector<int> minimumCost(int n, vector<vector<int>>& edges, vector<vector<int>>& query) {
        vector<int> p(n), a(n, (1 << 25) - 1), c(n, 1), ans;
        for (int i = 0; i < n; i++) p[i] = i;

        // Process edges to form DSU components
        for (vector<int> edge : edges) add(edge, p, a, c);

        // Answer queries
        for (vector<int> q : query) {
            int p1 = find(q[0], p);
            int p2 = find(q[1], p);
            ans.push_back((p1 == p2) ? a[p1] : -1);
        }

        return ans;
    }
};
```

Refs: 
- [Leetcode](https://leetcode.com/problems/minimum-cost-walk-in-weighted-graph/description)
- [Leetcode My Solution](https://leetcode.com/problems/minimum-cost-walk-in-weighted-graph/solutions/6583529/intuitive-approach-using-dsu-and-bitwise-iiq0)

202503270126
