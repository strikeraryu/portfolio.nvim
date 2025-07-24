# Intuition
1. **BFS Approach:**
   - BFS is ideal for shortest path problems due to its level-order nature. 
   - We track `(x, y)` coordinates, number of steps taken, and obstacles removed (`k`). 
2. **Why revisit a cell?**
   - If we reach a cell with fewer obstacles removed than a previous visit, we should re-evaluate it because the new path might be more optimal.
3. **State:**
   - `(x, y, steps, obstacles_removed)` — Track the current state in the BFS queue. 


# Approach
1. **Initialize:**
   - Use a `queue` to store the BFS state.
   - Use a `vis` matrix to store the minimum obstacles removed to reach `(x, y)`.
2. **BFS Execution:**
   - At each step:
     - Check if the current cell is the destination → return steps. 
     - If visiting the same cell with fewer obstacles removed, continue.
     - Try all four possible directions.
     - If the next cell is within bounds:
       - If it's an obstacle, increase `obstacles_removed`. 
       - If `obstacles_removed` exceeds `k`, skip the cell. 
       - If it's better than the previous state, add it to the queue.
3. **If no path is found:** 
   - Return `-1`.


### Key Points
✅ BFS ensures shortest path due to level-order traversal.
✅ Tracking `k` allows optimal pathfinding even with obstacles. 
✅ Revisiting cells is allowed only if we find a path with fewer obstacles removed. 


# Complexity
**Time Complexity:**
- O(n * m * k)
- Each cell can be visited with at most `k` different obstacle removal states.

**Space Complexity:**
- O(n*m)
- BFS queue and `vis` matrix.


# Code
```cpp []
class Solution {
public:
    int shortestPath(vector<vector<int>>& grid, int k) {
        int n = grid.size(), m = grid[0].size();
        queue<vector<int>> q;
        vector<vector<int>> vis(n, vector<int>(m, n*m+1));

        q.push({0, 0, 0, 0});
        vis[0][0] = 0;

        vector<vector<int>> dirs = {{0, 1}, {0, -1}, {-1, 0}, {1, 0}};

        while(!q.empty()) {
            vector<int> curr = q.front();
            q.pop(); 
            
            if(curr[0]==n-1 && curr[1]==m-1)return curr[2];
            if(vis[curr[0]][curr[1]]<curr[3])continue;

            for(vector<int> dir : dirs) {
                int ni = curr[0] + dir[0];
                int nj = curr[1] + dir[1];

                if(ni<0 || ni>=n || nj<0 || nj>=m)continue;
                int nk = curr[3] + grid[ni][nj];
                if(nk>k || vis[ni][nj] <= nk)continue;

                q.push({ni, nj, curr[2]+1, nk});
                vis[ni][nj] = nk;
            }
        }

        return -1;
    }
};
```

Refs: 
- [Leetcode](https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/description)
- [Leetcode My Solution](https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/solutions/6551363/intuitive-bfs-solution-with-k-state-by-s-4ryf)


202503181819
