# Intuition
The core idea is to treat this problem as a **pathfinding problem** on a weighted grid where the weight represents the elevation. The objective is to minimize the **maximum elevation** encountered along the path.

- We need to explore all possible paths using **BFS** (Breadth-First Search) because it explores level by level, which helps minimize the maximum elevation.  
- Unlike a standard BFS where we visit a node only once, here we need to visit nodes multiple times because the path to a node might have a different maximum elevation.  
- The challenge is to minimize cases where unnecessary exploration happens, so we apply pruning using two key checks:  
  1. If the maximum elevation of the current path is already greater than the current best answer, we skip that path.  
  2. If we have already reached a node with a lower elevation than the current path's maximum elevation, we skip that path.  

# Approach
1. **Initialize BFS**:
   - Start BFS from `(0,0)` with elevation `grid[0][0]`.  
   - Use a `queue` to store the current position and maximum elevation encountered so far.  
   - Use a `vis` matrix to track the minimum elevation required to reach each cell.  

2. **BFS Exploration**:
   - For each cell, explore its 4 neighboring cells.  
   - If the new elevation is greater than the current path's maximum elevation, update it.  
   - If the new elevation is greater than the previously recorded elevation in `vis`, skip the path.  
   - If the new elevation is greater than the current best answer, skip the path.  

3. **Early Exit**:
   - If we reach `(n-1, n-1)` with a lower elevation than the current best answer, update the answer.  

4. **Return Result**:
   - If the answer remains unchanged, return `-1`, otherwise return the answer.  

# Why BFS Works:
- BFS explores the shortest path in an unweighted graph, but here the weight is dynamic (depends on elevation).  
- BFS with pruning ensures that we only explore paths that have the potential to reduce the maximum elevation.  

# Complexity
**Time Complexity**:  
- BFS explores all cells at most once ⇒ \( O(n^2) \)  
- Each cell is processed at most once due to pruning.  

**Space Complexity**:  
- `queue` stores cells to explore ⇒ \( O(n^2) \)  
- `vis` matrix to track best elevation for each cell ⇒ \( O(n^2) \) 

# Code Explanation
```cpp
class Solution {
public:
    int swimInWater(vector<vector<int>>& grid) {
        int n = grid.size(), m = grid[0].size(), ans = INT_MAX;
        queue<vector<int>> q;
        vector<vector<int>> vis(n, vector<int>(m, n * m + 1));

        // Start BFS from (0, 0)
        q.push({0, 0, grid[0][0]});
        vis[0][0] = grid[0][0];

        vector<vector<int>> dirs = {{0, 1}, {0, -1}, {-1, 0}, {1, 0}};

        while (!q.empty()) {
            vector<int> curr = q.front();
            q.pop();

            int i = curr[0], j = curr[1], maxElevation = curr[2];

            // If destination is reached, update answer
            if (i == n - 1 && j == m - 1) {
                ans = min(ans, maxElevation);
                continue;
            }

            // If current elevation is greater than the best answer, skip
            if (maxElevation > ans) continue;

            // If we have already reached this cell with a lower elevation, skip
            if (vis[i][j] < maxElevation) continue;

            for (auto dir : dirs) {
                int ni = i + dir[0], nj = j + dir[1];
                if (ni < 0 || ni >= n || nj < 0 || nj >= m) continue;

                // Max elevation along the path
                int newElevation = max(maxElevation, grid[ni][nj]);

                // If a better path to this cell exists, skip
                if (vis[ni][nj] <= newElevation) continue;

                q.push({ni, nj, newElevation});
                vis[ni][nj] = newElevation;
            }
        }

        return ans == INT_MAX ? -1 : ans;
    }
};
``` 
Refs: 
- [Leetcode](https://leetcode.com/problems/swim-in-rising-water/description/)
- [Leetcode My Solution](https://leetcode.com/problems/swim-in-rising-water/solutions/6551879/intuitive-optimized-bfs-with-elevation-t-xije)


202503182051
