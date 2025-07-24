# Approach & Intuition

## Observations
1. We need to maximize the points collected at the last row.
2. The value at any index in a row depends on the best values from the previous row.
3. A brute force approach would check all previous indices for every new index, but this is inefficient.
4. We optimize by leveraging the non-increasing nature of the penalty function: As we move further from a previous index, the penalty increases, so we can terminate early when no improvement is possible.

## Intuition Explained More Clearly
- Think of the problem as building the best possible score row by row, starting from the top.
- If we are at row `i`, the best score for any column in row `i+1` must come from a column in row `i`, considering both the previous row's score and the movement penalty.
- The naive approach would compare every column in row `i` with every column in row `i+1`, which is too slow.
- Instead, we observe that as we move farther in a row, the penalty increases linearly. This means that once a transition stops improving our score, it will never improve it again further in that direction.
- So, we only need to extend our search until the benefit no longer outweighs the penalty, making the approach much faster.

# Algorithm
1. **Initialization**: Store the first row as the starting `prev` array.
2. **Iterate Over Rows**:
   - Create a `curr` array, initializing it by assuming the same index transition.
   - Update `curr[j]` using `prev[j] + points[i][j]`.
   - **Optimized Transition**: Iterate through `prev` to update `curr`:
     - Move forward, updating values until a drop in potential points occurs.
     - Move backward similarly.
3. **Result Extraction**: The maximum value in the last computed row is our answer.

# Complexity Analysis
- The brute force approach would run in **O(n * m^2)** time.
- The optimized approach reduces unnecessary comparisons, improving efficiency closer to **O(n * m)**.

# Why This Works
- Instead of checking all pairs, we only extend until the result worsens, avoiding unnecessary computations.
- The benefit from a previous row naturally decreases with distance, making the early exit strategy valid.


# Code
```cpp []
class Solution {
public:
    long long maxPoints(vector<vector<int>>& points) {
        vector<long long int> prev;
        for(int i : points[0]) prev.push_back(i); 
        int n = points.size(), m = prev.size();

        for(int i=1;i<n;i++) {
            // for(int i : prev) cout << i << " ";
            // cout << endl;
            vector<long long int> curr(m);


            for(int j=0;j<m;j++) curr[j] = prev[j] + points[i][j];
            for(int j=0;j<m;j++) {
                for(int k=j+1;k<m;k++) {
                    int tmp = prev[j] + points[i][k] - abs(k-j);
                    if(curr[k]<tmp)curr[k]=tmp;
                    else break;
                }
                
                for(int k=j-1;k>=0;k--) {
                    int tmp = prev[j] + points[i][k] - abs(k-j);
                    if(curr[k]<tmp)curr[k]=tmp;
                    else break;
                }
            }

            prev = curr;
        }

        long long ans = 0;
        for(long long i : prev) ans = max(ans, i);

        return ans;
    }
};
```

Refs: 
- [Leetcode](https://leetcode.com/problems/maximum-number-of-points-with-cost/)
- [Leetcode My Solution](https://leetcode.com/problems/maximum-number-of-points-with-cost/solutions/6551692/intuitive-optimized-row-by-row-transitio-777x)


202503182001
