# Intuition

The key insight is to build an undirected graph representation while keeping track of the original directed edges. We can then use a two-step approach:

1. First, calculate the number of edge reversals needed when starting from node 0.
2. Then efficiently re-root the tree to find the answer for all other nodes.

The re-rooting technique allows us to avoid running a separate DFS for each node, which would result in O(n²) time complexity.

# Approach

1. Build an undirected graph for traversal, but keep track of original edge directions.
2. Use a map to track which edges need to be reversed (edges not in the original direction).
3. Run a DFS from node 0 to calculate the initial edge reversals needed.
4. Use a re-rooting technique to efficiently compute the answer for all other nodes.

The re-rooting technique works as follows:
- When we move from one node to its neighbor, we update the counts by:
  - Removing the neighbor's contribution from the current node
  - Adding the current node's updated contribution to the neighbor
  - Recursively continuing the process

# Complexity
- Time complexity:
O(n), where n is the number of nodes. We visit each node a constant number of times.

- Space complexity:
Space Complexity: O(n) for the graph adjacency list, dp array, and result array.

# Code
```cpp
class Solution {
public:
    // DFS to calculate edge reversals needed when starting from node 'nd'
    int dfs(vector<int> &dp, vector<vector<int>> &grp, map<vector<int>, int> &dir, int nd, int p) {
        for(int i : grp[nd]) {
            if(i == p) continue;  // Skip parent node
            dp[nd] += dir[{nd, i}];  // Add 1 if this edge needs reversal (not in original direction)
            dp[nd] += dfs(dp, grp, dir, i, nd);  // Add contribution from subtree
        }
        return dp[nd];  // Return total reversals needed in this subtree
    }
    
    // Re-rooting technique to calculate answer for all nodes
    void reroot(vector<int> &dp, vector<vector<int>> &grp, map<vector<int>, int> &dir, vector<int> &ans, int nd, int p) {
        ans[nd] = dp[nd];  // Store answer for current node
        
        for(int i : grp[nd]) {
            if(i == p) continue;  // Skip parent
            
            // Update dp values for re-rooting
            dp[nd] -= dp[i] + dir[{nd, i}];  // Remove child's contribution from current node
            dp[i] += dp[nd] + dir[{i, nd}];  // Add updated parent contribution to child
            
            reroot(dp, grp, dir, ans, i, nd);  // Recurse with new root
            
            // Restore dp values for backtracking
            dp[i] -= dp[nd] + dir[{i, nd}];
            dp[nd] += dp[i] + dir[{nd, i}];
        }
    }
    
    vector<int> minEdgeReversals(int n, vector<vector<int>>& edges) {
        map<vector<int>, int> dir;  // Tracks edges that need reversal
        vector<vector<int>> grp(n);  // Undirected graph representation
        
        // Build undirected graph and mark original edge directions
        for(vector<int> edge : edges) {
           grp[edge[0]].push_back(edge[1]);
           grp[edge[1]].push_back(edge[0]);
           dir[{edge[1], edge[0]}] = 1;  // Mark reversed edges (only original direction is 0)
        }
        
        vector<int> dp(n, 0), ans(n, 0);  // dp stores temporary values, ans stores final results
        dfs(dp, grp, dir, 0, -1);  // Calculate initial values from node 0
        reroot(dp, grp, dir, ans, 0, -1);  // Re-root to find all answers
        
        return ans;
    }
};
```

Refs: 
- [Leetcode](https://leetcode.com/problems/minimum-edge-reversals-so-every-node-is-reachable/description/)
- [Leetcode My Solution](https://leetcode.com/problems/minimum-edge-reversals-so-every-node-is-reachable/solutions/6536899/intuition-of-minimum-edge-reversals-usin-s44y)

202503142342
