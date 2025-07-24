# Intuition
### **Step 1: Understanding the Base Case (`k = n`)**
- If `k = n`, each marble is placed in a separate bag.
- In this case, both the maximum and minimum scores will be identical, as each bag contains a single marble, and the sum is straightforwardly calculated.
- We initialize `mn` and `mx` as the sum of all elements multiplied by 2.

### **Step 2: Merging Marbles (`k < n`)**
- As we decrease `k`, we must start merging marbles into fewer bags.
- The way we merge marbles will determine whether we minimize or maximize the score.

### **Step 3: Identifying the Key Contribution of Merging**
- Consider a bag containing two adjacent marbles `i` and `j`.
- When adding another marble, say `j+1`, the new bag's total sum changes as:
  
  	new_total = prev_total - weights[j] - 2 * weights[j+1] + weights[j+1]
  	           = prev_total - weights[j] - weights[j+1]
  
- This means merging always decreases the sum, and by choosing the merging order optimally, we can control how much the sum decreases.

### **Step 4: Using a Greedy Approach**
- To **minimize the sum (`mn`)**, we should first merge the largest pairs.
- To **maximize the sum (`mx`)**, we should first merge the smallest pairs.
- Sorting all possible adjacent pair sums helps us efficiently determine which pairs to include or exclude.

# Approach
1. Compute initial `mn` and `mx` as if `k = n`.
2. Store all adjacent pair sums (`weights[i] + weights[i+1]`) in a separate array.
3. Sort the array to use it greedily:
   - For `mn`, remove the largest pairs.
   - For `mx`, remove the smallest pairs.
4. The final answer is `mx - mn`.

# Code Explanation
```cpp
class Solution {
public:
    long long putMarbles(vector<int>& weights, int k) {
        int n = weights.size();
        vector<long long int> mxa;
        long mn = 2ll * weights[n-1], mx = 2ll * weights[n-1];

        for(int i = 0; i < n - 1; i++) {
            mn += 2ll * weights[i];
            mx += 2ll * weights[i];
            mxa.push_back(weights[i] + weights[i+1]);
        }
        
        sort(mxa.begin(), mxa.end());
        
        for(int i = 0, j = n - 2; k < n; k++, i++, j--) {
            mx -= mxa[i];
            mn -= mxa[j];
        }
        return mx - mn;
    }
};
```

# Complexity Analysis
- **Sorting takes O(n log n)**.
- **Looping through the elements takes O(n)**.
- **Overall complexity: O(n log n)**.

Refs: 
- [Leetcode](https://leetcode.com/problems/put-marbles-in-bags/)
- [Leetcode My Solution](https://leetcode.com/problems/put-marbles-in-bags/solutions/6602698/intuitive-approach-with-in-depth-explana-ueui)


202504011325
