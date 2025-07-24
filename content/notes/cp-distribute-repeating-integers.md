# Intuition
### Step 1: Reduce the Problem to Count-Based Fulfillment  
- The actual values of `nums` do not matter; only their frequencies are relevant.
- Create a frequency map of `nums` to count how many times each value appears.
- Store these frequencies in a `cnt` array. 

### Step 2: Use a Greedy + Bitmask Approach to Minimize Leftover  
- Each count in `cnt` represents how many times a specific value is available.
- For each count, try to fulfill as many customer orders as possible to minimize leftover values.
- We can use a bitmask to represent different combinations of orders:
  - Each bit in the bitmask represents whether a particular order is selected.
  - Try all possible combinations to see which orders can be fulfilled by the current count.
  - Choose the combination that minimizes leftover values after fulfilling orders.

### Step 3: Remove Fulfilled Orders  
- After each count is processed, remove the satisfied orders from `quantity`.
- If all orders are fulfilled successfully, return `true`; otherwise, return `false`.

## Why This Works  
- If two counts `a` and `b` exist where `a > b`, and `b` could be used to fulfill an order, then `a` should also be able to fulfill that order. 
- If a solution exists using `b`, there must exist a solution using `a` since `a` has more available values.
- Therefore, we prioritize using larger counts to minimize leftover values, ensuring that we maximize the chances of fulfilling remaining orders.  -
## Code Explanation  
### Step 1: Create Frequency Count  
We create a `map` to count the occurrences of each element in `nums`.
```cpp
map<int, int> mp;
for(int i : nums) mp[i]++;
vector<int> cnt;
for(auto p : mp) cnt.push_back(p.second);
```

### Step 2: Try to Fulfill Orders Using Each Count  
For each count, we try all combinations of orders using a bitmask approach: 
```cpp
void find_perfect(int c, vector<int> &quantity) {
    if(quantity.empty()) return;
    
    int mx = (1 << quantity.size()) - 1;
    vector<int> mn = {c, 0};
    
    for(int i = mx; i >= 1; i--) {
        int left = c;
        for(int b = 0; b < quantity.size(); b++) {
            if(i & (1 << b)) left -= quantity[b];
        }
        mn = min(mn, {left, i});
    }
    
    vector<int> left_over;
    for(int b = 0; b < quantity.size(); b++) {
        if(!(mn[1] & (1 << b))) left_over.push_back(quantity[b]);
    }
    quantity = left_over;
}
```

- `mx = (1 << quantity.size()) - 1` → Create all possible order combinations using a bitmask.
- Try each combination and compute the remaining values after fulfilling the orders.
- Select the combination that leaves the least leftover.
- Remove fulfilled orders from `quantity`.

### Step 3: Repeat Until All Orders Are Fulfilled  
Process each count from the `cnt` array:
```cpp
for(int c : cnt) {
    find_perfect(c, quantity);
}
return quantity.empty();
```

# Complexity  
**Time Complexity:**
- Counting elements: `O(n)` 
- Processing combinations: `O(m * 2^m)` → m ≤ 10 → `2^10 = 1024` (manageable)
- Total: `O(n + 50 * 2^10)` 

**Space Complexity:**
- Frequency map and `cnt` array: `O(50)`
- Bitmask-based processing: `O(2^10)`
- Total: `O(50 + 2^10)` 

# Code
```cpp []
class Solution {
public:
    void find_perfect(int c, vector<int> &quantity) {
        if(quantity.size()==0)return;
        
        int mx = pow(2, quantity.size()+1)-1;
        vector<int> mn = {c, 0};
        for(int i=mx;i>=1;i--) {
            int left = c;
            for(int b=0;b<quantity.size();b++) {
                if((i & (1<<b))!=0 && left >= quantity[b])
                    left -= quantity[b];
            }
            mn = min(mn, {left, i});
        }
        vector<int> left_over;
        for(int b=0;b<quantity.size();b++) {
            if((mn[1] & (1<<b))==0)
                left_over.push_back(quantity[b]);
        }

        quantity = left_over;
    }

    bool canDistribute(vector<int>& nums, vector<int>& quantity) {
       map<int, int> mp;
       for(int i : nums)mp[i]++; 

       int ind = 0;
       vector<int> cnt(mp.size());
       for(auto p : mp)cnt[ind++] = p.second;

       sort(cnt.begin(), cnt.end());

       for(int c : cnt) {
        find_perfect(c, quantity);
       }

       return quantity.size() == 0;
    }
};
```

Refs: 
- [Leetcode](https://leetcode.com/problems/distribute-repeating-integers/description/)
- [Leetcode My Solution](https://leetcode.com/problems/distribute-repeating-integers/solutions/6531073/intuitive-greedy-bitmask-approach-to-min-9021)


202503130903
