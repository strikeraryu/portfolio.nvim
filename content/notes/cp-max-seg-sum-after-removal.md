# **Intuition**  
Instead of directly removing elements and recalculating segment sums after each operation (which is inefficient), we can reverse the problem:  

1. **Reverse the process:**  
   - Instead of removing elements, think of it as **adding back elements** in reverse order.  
   - This converts the problem from a "splitting segments" problem into a "merging segments" problem.  

2. **Use Union-Find (Disjoint Set):**  
   - Treat each segment as a set.  
   - When you add back an element, merge it with adjacent elements if they exist.  
   - Use the union-find data structure to efficiently manage merging and track segment sums.  

3. **Use a Set for Maximum Tracking:**  
   - Keep a `set` to efficiently track and query the maximum segment sum.  
   - After each operation, update the maximum using `set`.  


# **Approach**  
1. **Reverse the process:**  
   - Start with an empty array.  
   - Add elements in reverse order of `removeQueries`.  

2. **Union-Find:**  
   - Maintain a `grp[]` array to store the parent of each element (for union-find).  
   - Maintain a `grp_sum[]` array to store the sum of each segment.  
   - Use `find()` to get the root of the segment.  
   - Use `join()` to merge two segments and update the segment sum.  

3. **Add Back Element:**  
   - When adding back an element at index `i`:  
     - Initialize the segment with the element value.  
     - Try to merge with left and right neighbors if they exist.  

4. **Track Maximum:**  
   - Use a `set` to keep track of the maximum sum.  
   - After each operation, store the maximum sum in the result array.  


# **Code Breakdown**  
### 1. **find()**  
- Finds the parent of an element using path compression.  
```cpp
int find(int i, vector<int> &grp) {
    if (i == grp[i]) return i;
    return find(grp[i], grp);
}
```

### 2. **join()**  
- Merges two segments and updates the segment sum.  
- Attach the smaller sum segment to the larger one for balanced merging.  
```cpp
void join(int i, int j, vector<int> &grp, vector<long long int> &grp_sum) {
    int pi = find(i, grp);
    int pj = find(j, grp);

    if (grp_sum[pi] > grp_sum[pj]) {
        grp[pj] = pi;
        grp_sum[pi] += grp_sum[pj];
    } else {
        grp[pi] = pj;
        grp_sum[pj] += grp_sum[pi];
    }
}
```

### 3. **add()**  
- Adds an element back to the array.  
- Merges with adjacent segments if possible.  
- Returns the sum of the newly formed segment.  
```cpp
long long int add(int i, vector<int> &grp, vector<long long int> &grp_sum, vector<int> &nums) {
    grp[i] = i;
    grp_sum[i] += nums[i - 1];

    if (grp[i - 1] != -1) join(i - 1, i, grp, grp_sum);
    if (grp[i + 1] != -1) join(i + 1, i, grp, grp_sum);

    return grp_sum[find(i, grp)];
}
```

### 4. **maximumSegmentSum()**  
- Reverses the process of removing elements by adding them back.  
- Uses a `set` to track maximum sums.  
```cpp
vector<long long> maximumSegmentSum(vector<int>& nums, vector<int>& removeQueries) {
    int n = nums.size();
    vector<long long int> ans(n);
    vector<int> grp(n + 2, -1);
    vector<long long int> grp_sum(n + 1);
    set<long long int> s;
    s.insert(0);

    for (int i = n - 1; i >= 0; i--) {
        ans[i] = *(--s.end());
        s.insert(add(removeQueries[i] + 1, grp, grp_sum, nums));
    }

    return ans;
}
```


# **Complexity**  
**Time Complexity:**  
- `find()` and `join()` → `O(log n)` (due to path compression)  
- Set insertion → `O(log n)`  
- Total: **O(n * log n)**  

**Space Complexity:**  
- `grp[]`, `grp_sum[]` → `O(n)`  
- `set` → `O(n)`  
- Total: **O(n)**  


# Code
```cpp []
class Solution {
public:
    int find(int i, vector<int> &grp) {
        if(i==grp[i])return i;

        return find(grp[i], grp);
    }

    void join(int i, int j, vector<int> &grp, vector<long long int> &grp_sum) {
        int pi = find(i, grp);
        int pj = find(j, grp);

        if(grp_sum[pi]>grp_sum[pj]) {
            grp[pj] = pi;
            grp_sum[pi] += grp_sum[pj];
        }
        else  {
            grp[pi] = pj;
            grp_sum[pj] += grp_sum[pi];
        }

    }
    long long int add(int i, vector<int> &grp, vector<long long int> &grp_sum, vector<int> &nums) {
        grp[i] = i; grp_sum[i] += nums[i-1];

        if((grp[i-1]!=-1))  join(i-1, i, grp, grp_sum);
        if((grp[i+1]!=-1)) join(i+1, i, grp, grp_sum);

        return grp_sum[find(i, grp)];
    }
    vector<long long> maximumSegmentSum(vector<int>& nums, vector<int>& removeQueries) {
        int n = nums.size();
        vector<long long int> ans(n);

        set<long long int> s;
        s.insert(0);

        vector<int> grp(n+2, -1);
        vector<long long int> grp_sum(n+1);

        for(int i=n-1;i>=0;i--) {
            ans[i] = *(--s.end());
            s.insert(add(removeQueries[i]+1, grp, grp_sum, nums));
        }

        return ans;
    }
};
```

Refs: 
- [Leetcode](https://leetcode.com/problems/maximum-segment-sum-after-removals/description/)
- [Leetcode My Solution](https://leetcode.com/problems/maximum-segment-sum-after-removals/solutions/6551186/intuitive-approach-using-union-find-by-s-er7p)


202503181720
