
# Intuition
### 1. **Direct Longest Path (lp) Intuition**  
To find the time to reach a node through its **descendant paths**, we need to compute the **longest path** from the node to any of its child nodes:
- Start from the root node.
- Recursively calculate the longest path from the children.
- Add the node’s weight to the maximum child path to get the longest path at the current node.

### 2. **Alternative Longest Path (alp) Intuition**  
A node can also be reached more quickly through its parent’s path:
- A node’s parent might have a longer alternative path through a sibling.
- If the best path is through a sibling, we calculate the second-best path (excluding the direct path through the current node) and adjust it.
- This ensures that even if the longest path isn’t through direct descendants, the parent’s alternative path is considered.

### 🌳 **Example Tree:**  
```
       0 (Even)  
      /   \
    1(Odd) 2(Even)
   /   \     \
  3(Odd) 4(Even) 5(Odd)
```
**Direct Path:** From node `0` → `1` → `3`
**Alternative Path:** From node `0` → `2` → `5` 

- Node `3`'s direct path comes from node `1`.
- Node `4`'s best path might be through node `1`, but an alternative path could also come through node `2` via the parent.


# Approach
We solve the problem using a two-step Depth-First Search (DFS):

1. **First DFS** (`find_lp`):
   We calculate the **longest path (lp)** from the current node to any of its descendants. This gives the maximum time needed to reach any descendant node.

2. **Second DFS** (`find_alp`): 
   We calculate the **alternative longest path (alp)**, which considers the path from the parent node. This ensures we capture paths that might not go through direct descendants but could be longer through parent connections.


### Step-by-Step Explanation
1. **Weight Calculation:**
   Each node’s weight is calculated using:
   - `wt(nd) = 1` if `nd` is odd
   - `wt(nd) = 2` if `nd` is even

2. **First DFS (`find_lp`)**:
   - Start DFS from the root node.
   - For each child node:
     - Recursively compute the longest path from the child.
     - Update the current node’s longest path based on the maximum path from any child + node’s weight.

3. **Second DFS (`find_alp`)**:
   - Start DFS from the root node.
   - Compute the alternative longest path:
     - Consider the parent’s alternative longest path.
     - Calculate the maximum path excluding the direct path through the current child.
     - Use a sorted list to efficiently get the second-best path.
   - Update the node’s alternative longest path.

4. **Final Update:**
   - The time taken to reach each node is the maximum of the longest path and the alternative longest path.


### Code Breakdown
```cpp
int wt(int nd) { 
    return nd % 2 ? 1 : 2; 
}
```
- Computes the weight of a node.


```cpp
int find_lp(vector<vector<int>> &grp, vector<int> &lp, int nd, int p) {
    int lc = 0; 
    for (int i : grp[nd]) {
        if (i == p) continue;
        lc = max(lc, find_lp(grp, lp, i, nd));
    }
    lp[nd] = lc;
    return lc + wt(nd);
}
```
- First DFS to calculate the longest path from descendants.


```cpp
// clp = cousin longest path
void find_alp(vector<vector<int>> &grp, vector<int> &lp, vector<int> &alp, int nd, int p, int clp) {
    if (p != -1) alp[nd] = max(clp + wt(p), alp[p] + wt(p));

    vector<vector<int>> nds;
    for (int i : grp[nd]) {
        if (i != p) nds.push_back({-lp[i] - wt(i), i});
    }
    sort(nds.begin(), nds.end());
    
    for (int i : grp[nd]) {
        if (i == p) continue;
        int tmp_clp = (nds.size() > 1 && nds[0][1] == i) ? -nds[1][0] : -nds[0][0];
        find_alp(grp, lp, alp, i, nd, tmp_clp);
    }
}
```
- Second DFS to calculate the alternative longest path.


```cpp
vector<int> timeTaken(vector<vector<int>>& edges) {
    int n = edges.size() + 1;
    vector<int> lp(n), alp(n);
    vector<vector<int>> grp(n);

    for (vector<int> edge : edges) {
        grp[edge[0]].push_back(edge[1]);
        grp[edge[1]].push_back(edge[0]);
    }

    find_lp(grp, lp, 0, -1);
    find_alp(grp, lp, alp, 0, -1, 0);

    for (int i = 0; i < n; i++) 
        lp[i] = max(lp[i], alp[i]);

    return lp;
}
```
- Build the tree.
- Compute longest and alternative longest paths.
- Return the maximum of both.


### Complexity
**Time Complexity:**  **O(nlog n)**
- First DFS: `O(n)`
- Second DFS: `O(n log n)` for sorting in each node's DFS.

**Space Complexity:**  **O(n)**


# Code
```cpp []
class Solution {
public:
    int wt(int nd) { return nd % 2 ? 1 : 2; }

    int find_lp(vector<vector<int>> &grp, vector<int> &lp, int nd, int p) {

        int lc = 0; 
        for(int i : grp[nd]) {
            if(i==p)continue;
            lc = max(lc, find_lp(grp, lp, i, nd));
        }
        lp[nd] = lc;

        return lc + wt(nd);
    }

    void find_alp(vector<vector<int>> &grp, vector<int> &lp, vector<int> &alp, int nd, int p, int clp) {
        if(p!=-1) alp[nd] = max(clp + wt(p), alp[p] + wt(p));

        vector<vector<int>> nds;
        for(int i : grp[nd]) {
            if(i!=p)
                nds.push_back({-lp[i] - wt(i), i});
        }
        sort(nds.begin(), nds.end());
        for(int i : grp[nd]) {
            if(i==p)continue;

            int tmp_clp = 0;
            if(nds.size() > 1) {
                if(nds[0][1] == i)tmp_clp = -nds[1][0];
                else tmp_clp = -nds[0][0];
            }

            find_alp(grp, lp, alp, i, nd, tmp_clp);
        }
    }
    vector<int> timeTaken(vector<vector<int>>& edges) {
        int n = edges.size() + 1;
        vector<int> lp(n), alp(n);
        vector<vector<int>> grp(n);

        for(vector<int> edge : edges) {
            grp[edge[0]].push_back(edge[1]);
            grp[edge[1]].push_back(edge[0]);
        }

        find_lp(grp, lp, 0, -1);
        find_alp(grp, lp, alp, 0, -1, 0);

        for(int i=0;i<n;i++) lp[i] = max(lp[i], alp[i]);

        return lp;
    }
};
```


Refs: 
- [Leetcode](https://leetcode.com/problems/time-taken-to-mark-all-nodes/description/)
- [Leetcode My Solution](https://leetcode.com/problems/time-taken-to-mark-all-nodes/solutions/6526821/optimal-time-calculation-in-a-tree-using-qib1)


202503121016
