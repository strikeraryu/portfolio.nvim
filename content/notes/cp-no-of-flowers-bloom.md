# Intuition
The goal is to efficiently count the number of flowers in bloom for each person's visit. By leveraging sorting and prefix sums, we can efficiently compute this result.


# Approach
1. **Sorting for Efficient Range Queries:**
   - Sort the `people` array to enable efficient range calculations.
   - Iterate through each `flower` interval and determine its effect on the sorted `people` array.

2. **Tracking Blooming Ranges:**
   - For each flower interval `[start, end]`:
     - Use `lower_bound` to find the first person whose visit time is ≥ `start`.
     - Use `upper_bound` to find the first person whose visit time is strictly greater than `end`.
     - Adjust the `upper_bound` index since the actual range should include the endpoint.

3. **Updating Range Array:**
   - Maintain a prefix sum array `tp` to efficiently track the number of flowers blooming at any given time.
   - Increment `tp[l]` by 1 (start of bloom) and decrement `tp[r + 1]` by 1 (end of bloom).

4. **Building Final Result:**
   - Compute the prefix sum over `tp` to get the total number of flowers in bloom at each time.
   - Use a map `mp` to store the calculated bloom counts for the sorted visit times.
   - Map each person’s visit time to their respective bloom count from `mp`.


# Complexity Analysis
- **Time Complexity:** `O((n + m) log n)` where `n` = number of people and `m` = number of flower intervals.
- **Space Complexity:** `O(n + m)` for the prefix sum array and mapping.


# Code
```cpp []
class Solution {
public:
    vector<int> fullBloomFlowers(vector<vector<int>>& flowers, vector<int>& people) {
        int n = people.size();
        vector<int> ans;
        vector<int> sp, tp(n+1);

        for(int i : people)sp.push_back(i);
        sort(sp.begin(), sp.end());

        for(vector<int> fw : flowers) {
            int l = lower_bound(sp.begin(), sp.end(), fw[0]) - sp.begin();
            int r = upper_bound(sp.begin(), sp.end(), fw[1]) - sp.begin();
            while(r==n || (r>=0 && sp[r]>fw[1]))r--;
            
            if(l<n && r<n && l<=r && r>=0 && sp[l]>=fw[0] && sp[r]<=fw[1]) {
                tp[l]++;
                tp[r+1]--;
            }
        }

        int sum = 0;
        map<int, int> mp;
        for(int i=0;i<n;i++) {
            sum += tp[i];
            tp[i] = sum;
            mp[sp[i]] = tp[i];
        }

        for(int i : people)ans.push_back(mp[i]);

        return ans;
    }
};
```

Refs: 
- [Leetcode](https://leetcode.com/problems/number-of-flowers-in-full-bloom/description/)
- [Leetcode My Solution](https://leetcode.com/problems/number-of-flowers-in-full-bloom/solutions/6544080/intuitive-counting-flowers-in-full-bloom-c88a)

202503162316
