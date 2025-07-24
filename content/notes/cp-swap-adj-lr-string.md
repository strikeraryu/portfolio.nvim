# Intuition  
We are allowed two operations:
1. `"XL"` → `"LX"` → `'L'` can only move left.
2. `"RX"` → `"XR"` → `'R'` can only move right. 

This gives us three key insights:
1. **Order of `'L'` and `'R'` must remain unchanged** – Since we can only swap adjacent `'X'` with `'L'` or `'R'`, the order of `'L'` and `'R'` in the final result cannot change.
2. **'L' can only move left** – Since `'XL'` → `'LX'`, there is no way to add extra `'X'` to the left of `'L'`. Therefore, the position of `'L'` in `result` should not exceed its position in `start`. 
3. **'R' can only move right** – Since `'RX'` → `'XR'`, there is no way to add extra `'X'` to the right of `'R'`. Therefore, the position of `'R'` in `result` should not precede its position in `start`.


# Approach  
To check if the transformation is possible, we need to validate these conditions:

1. **Both strings should be equal if we ignore `'X'`**
   - Removing `'X'` should give the same sequence of `'L'` and `'R'` in the same order. 

2. **'L' should not move right**
   - The number of `'X'` before each `'L'` in `result` should be greater than or equal to the number of `'X'` before the same `'L'` in `start`. 
   - This ensures that `'L'` hasn’t shifted to the right.

3. **'R' should not move left** 
   - The number of `'X'` before each `'R'` in `result` should be less than or equal to the number of `'X'` before the same `'R'` in `start`.
   - This ensures that `'R'` hasn’t shifted to the left.


# Code Breakdown  
1. **Remove 'X' and track positions**
   - Build two strings `s1` and `s2` by removing `'X'`. 
   - Store the position of `'L'` and `'R'` in `l1` and `l2` (count of `'X'` before each `'L'` and `'R'`).

2. **Compare order**
   - If `s1 != s2`, return `false` because the order of `'L'` and `'R'` changed.

3. **Check valid movement** 
   - `'L'` in `result` should appear to the left or at the same position as in `start` → `l2[i] <= l1[i]`.
   - `'R'` in `result` should appear to the right or at the same position as in `start` → `l2[i] >= l1[i]`. 


# Complexity  
- **Time Complexity:** `O(n)` – Iterating through strings once. 
- **Space Complexity:** `O(n)` – To store positions of `'L'` and `'R'`.


# Code  
```cpp
class Solution {
public:
    bool canTransform(string start, string result) {
        string s1 = "", s2 = "";
        vector<int> l1, l2;
        int cnt1 = 0, cnt2 = 0;
        
        // Remove 'X' and store X before index
        for(char c : start) {
            if(c != 'X') {
                s1 += c;
                l1.push_back(cnt1);
            } else {
                cnt1++;
            }
        }

        for(char c : result) {
            if(c != 'X') {
                s2 += c;
                l2.push_back(cnt2);
            } else {
                cnt2++;
            }
        }

        // Condition 1: Order should match
        if (s1 != s2) return false;

        // Condition 2 & 3: Valid movement of 'L' and 'R'
        for (int i = 0; i < s1.size(); i++) {
            if (s1[i] == 'L' && l2[i] > l1[i]) return false;
            if (s1[i] == 'R' && l2[i] < l1[i]) return false;
        }
        
        return true;
    }
};
``` 

Refs: 
- [Leetcode](https://leetcode.com/problems/swap-adjacent-in-lr-string/description/)
- [Leetcode My Solution](https://leetcode.com/problems/swap-adjacent-in-lr-string/solutions/6551770/intuitive-valid-string-transformation-en-2407)


202503182023
