# Intuition
The problem requires us to find the longest increasing sequence of numbers in the matrix, moving only in four possible directions. A naive brute-force approach would be to explore all possible paths from each cell, but this would be highly inefficient due to redundant computations. 

Instead, we recognize that:
- Every increasing path starting from a cell follows a **recursive structure**: the path length from a cell depends on the longest path from its neighbors.
- Since paths do not revisit cells (strictly increasing constraint), we can **cache results** of already computed cells to avoid re-exploring them.
- This suggests an **optimal substructure** that can be efficiently handled using **DFS + Memoization**.

# Approach
This problem is best solved using **Depth-First Search (DFS) with Memoization**. The idea is to explore all possible increasing paths from each cell and use memoization to avoid redundant computations.

## Algorithm
1. **Define Directions:** Define the four possible moves (right, left, down, up) as `dir[4][2]`.
2. **Memoization:** Use a `dp` array to store the longest increasing path starting from each cell. If a value is already computed, return it to avoid re-computation.
3. **DFS Traversal:** Start DFS from each cell and explore all valid adjacent cells that have a greater value.
4. **Marking Visited Cells:** Maintain a `vis` array to track visited cells within the current DFS path to prevent cycles.
5. **Result Calculation:** Iterate through each cell in the matrix and start DFS if its value is not already computed in `dp`.
6. **Return Maximum Path Length:** The result is the maximum value obtained across all DFS traversals.

## Implementation Details
```cpp
class Solution {
public:
    int dir[4][2] = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}}; // Directions array
    int dp[200][200]; // Memoization table
    int vis[200][200]; // Visited tracking

    int dfs(int i, int j, vector<vector<int>>& matrix) {
        if (dp[i][j] != -1) return dp[i][j]; // Return cached result
        
        int ans = 1; // Minimum path length is 1 (cell itself)
        
        for (int d = 0; d < 4; d++) {
            int ni = i + dir[d][0];
            int nj = j + dir[d][1];
            
            if (ni >= 0 && nj >= 0 && ni < matrix.size() && nj < matrix[0].size() && matrix[ni][nj] > matrix[i][j] && !vis[ni][nj]) {
                vis[i][j] = 1; // Mark cell as visited
                ans = max(ans, 1 + dfs(ni, nj, matrix));
                vis[i][j] = 0; // Unmark for other paths
            }
        }
        return dp[i][j] = ans; // Store and return result
    }

    int longestIncreasingPath(vector<vector<int>>& matrix) {
        int n = matrix.size(), m = matrix[0].size();
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                dp[i][j] = -1; // Initialize memoization table
                vis[i][j] = 0; // Reset visited array
            }
        }
        
        int ans = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (dp[i][j] == -1) ans = max(ans, dfs(i, j, matrix));
            }
        }
        return ans;
    }
};
```

# Complexity Analysis
- **DFS Traversal:** Each cell is visited once and its result is stored in `dp`, leading to **O(m * n)** complexity.
- **Space Complexity:** The memoization table and visited array take **O(m * n)** space.


Refs: 
- [Leetcode](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/description)
- [Leetcode My Solution](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/solutions/6591772/intuitive-approach-with-in-depth-explana-o8vj)


202503291205
