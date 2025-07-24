# Intuition
For a quadruplet (i, j, k, l) to be valid, we need:
- i < j < k < l (indices in ascending order)
- nums[i] < nums[k] < nums[j] < nums[l] (a specific pattern of values)

The key insight is to fix the middle pair (j, k) and then count valid i's and l's that can complete the quadruplet. For each valid (j, k) pair where nums[k] < nums[j], we need:
- Count of elements with index < j and value < nums[k]
- Count of elements with index > k and value > nums[j]

Multiplying these counts gives us the number of valid quadruplets for this specific (j, k) pair.

# Approach
1. Precompute two 2D arrays:
   - `lcnt[i][v]`: Count of elements with index < i and value < v
   - `gcnt[i][v]`: Count of elements with index > i and value < v

2. For each valid (j, k) pair where j < k and nums[k] < nums[j]:
   - Find count of valid i's: lcnt[j][nums[k]-1]
   - Find count of valid l's: gcnt[k][nums[j]-1]
   - Add their product to the answer

# Complexity
- Time complexity: **O(n²)**

- Space complexity: **O(n²)**

# Code
```cpp []
class Solution {
public:
    long long countQuadruplets(vector<int>& nums) {
        long long int ans = 0;
        int n = nums.size();

        // Compute lcnt[i][v]: count of elements with index < i and value < v
        vector<vector<int>> lcnt(n, vector<int>(n));
        vector<int> lrcnt(n);
        for(int i=0; i<n; i++) {
            for(int j=nums[i]; j<n; j++) lrcnt[j]++;
            for(int j=0; j<n; j++) lcnt[i][j] += lrcnt[j];
        }

        // Compute gcnt[i][v]: count of elements with index > i and value < v
        vector<vector<int>> gcnt(n, vector<int>(n));
        vector<int> grcnt(n);
        for(int i=n-1; i>=0; i--) {
            for(int j=0; j<nums[i]; j++) grcnt[j]++;
            for(int j=0; j<n; j++) gcnt[i][j] += grcnt[j];
        }
 
        // Count valid quadruplets
        for(int j=0; j<n; j++) {
            for(int k=j+1; k<n; k++) {
                if(nums[k] < nums[j])
                    ans += gcnt[k][nums[j]-1] * lcnt[j][nums[k]-1];
            }
        }

        return ans;
    }
};
```

Refs: 
- [Leetcode](https://leetcode.com/problems/count-increasing-quadruplets/description/)
- [Leetcode My Solution](https://leetcode.com/problems/count-increasing-quadruplets/solutions/6529996/prefix-counting-simple-n-2-approach)


202503122329
