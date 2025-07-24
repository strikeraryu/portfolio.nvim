# Intuition
1. **Feasibility Check**:
   - A solution exists only if the total count of each distinct element across both baskets is even.
   - If any element appears an odd number of times in total, it's impossible to balance both baskets → return `-1`.

2. **Identify Extra Elements**:
   - After counting occurrences:
     - If an element appears more times in `basket1` than in `basket2`, the extra copies in `basket1` need to be swapped to `basket2`.
     - Similarly, extra elements in `basket2` need to be swapped to `basket1`.

3. **Minimizing Cost**:
   - There are two possible ways to minimize the cost:
     - **Direct swap** between the smallest element from one basket and the largest element from the other basket.
     - **Indirect swap** using the smallest element available across both baskets as an intermediary, which costs `2 * mn` where `mn` is the minimum element in both baskets.

4. **Final Strategy**:
   - Choose the minimum cost between a direct swap and an indirect swap using the smallest element as an intermediary.


# Approach
1. **Count Frequencies**:
   - Use `map<int, int>` to count the frequency of each element in both baskets.
   - Also maintain a combined frequency count.

2. **Check Feasibility**:
   - If any element's total frequency is odd, return `-1`.

3. **Identify Extra Elements**:
   - If an element is extra in `basket1`, add it to `ext1`.
   - If an element is extra in `basket2`, add it to `ext2`.

4. **Sort Extra Elements**:
   - Sort `ext1` and `ext2` to simplify pairing of minimal elements.

5. **Calculate Minimum Cost**:
   - Direct swap → swap smallest in `ext1` with largest in `ext2`.
   - Indirect swap → use minimum element across both baskets.


# Complexity
**Time Complexity**:  
- Counting + Sorting + Swapping → `O(n log n)`

**Space Complexity**:  
- Frequency maps + extra elements → `O(n)`


# Code
```cpp []
class Solution {
public:
    long long minCost(vector<int>& basket1, vector<int>& basket2) {
        map<int, int> f1, f2, fa;

        for(int i : basket1) { f1[i]++; fa[i]++; }
        for(int i : basket2) { f2[i]++; fa[i]++; }
        for(auto p : fa) if(p.second&1) return -1;

        vector<int> ext1, ext2;
        for(auto i : f1) for(int j=f2[i.first];j<f1[i.first];j+=2) ext1.push_back(i.first);
        for(auto i : f2) for(int j=f1[i.first];j<f2[i.first];j+=2) ext2.push_back(i.first);

        sort(ext1.begin(), ext1.end());
        sort(ext2.begin(), ext2.end());

        int mn = min(*min_element(basket1.begin(), basket1.end()), *min_element(basket2.begin(), basket2.end()));
        long long ans = 0;

        for(int i=0;i<ext1.size();i++) {
            ans += 1ll * (min(mn*2, min(ext1[i], ext2[ext1.size() - i - 1])));
        }

        return ans;
    }
};
```

Refs: 
- [Leetcode](https://leetcode.com/problems/rearranging-fruits/description/)
- [Leetcode My Solution](https://leetcode.com/problems/rearranging-fruits/solutions/6543842/intuitive-minimize-swap-cost-by-balancin-8r5k)


202503162155
