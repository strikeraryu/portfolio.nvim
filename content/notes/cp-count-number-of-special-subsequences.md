# Intuition

### Basic Case
If we were restricted to select only one "1", the solution would be simple:
- For each "1" in the array, we calculate:
  - Number of ways to select zeros before this "1" × Number of ways to select twos after this "1"

### Calculating Ways to Select Zeros or Twos
For n zeros, we can select any combination of them:
- We can select 1 zero: nC1 ways
- We can select 2 zeros: nC2 ways
- ...and so on until nCn ways

The total number of ways = nC1 + nC2 + ... + nCn = 2^n - 1
(We subtract 1 because we need at least one zero)

### Handling Multiple Ones
When we can select more than one "1":

Let's define:
- ai = number of ways to select zeros before position i
- bi = number of ways to select twos after position i

For combinations of ones:
1. Using 1st and 2nd ones (no ones in between): a0 × b1 × 2^0
2. Using 1st and 3rd ones (1 one in between): a0 × b2 × 2^1
   - The 2^1 represents 2 ways to handle the one in between (include or exclude)
3. Using 1st and 4th ones (2 ones in between): a0 × b3 × 2^2
4. Using 2nd and 3rd ones: a1 × b2 × 2^0
5. Using 2nd and 4th ones: a1 × b3 × 2^1
6. Using 3rd and 4th ones: a2 × b3 × 2^0

### Recursive Pattern
Looking at the formula for b3 (ways to include the 4th one):
- a0 × 2^2 + a1 × 2^1 + a2 × 2^0

This simplifies to:
- 2 × (a0 × 2^1 + a1 × 2^0) + a2
- 2 × (ways for b2) + a2

Therefore: ways for bi = 2 × (ways for b(i-1)) + a(i-2)

This gives us an efficient way to calculate all possible valid subsequences.

# Approach

The solution uses a dynamic programming approach with some combinatorial counting:

1. For each position where a "1" appears, we need to know:
   - Number of ways to select at least one "0" from positions before it
   - Number of ways to select at least one "2" from positions after it

2. For each "1" at position i, the number of valid subsequences is:
   (ways to select 0's before i) × (ways to select 2's after i)

3. However, we need to handle the cases where multiple 1's can be selected. This requires careful counting to avoid duplicates.

## Implementation Details

### Step 1: Calculate ways to select 2's after each position

For each position i, we compute the number of ways to select at least one "2" from positions after i:
- Count how many 2's appear after position i
- If there are k such 2's, there are 2^k - 1 ways to select at least one of them (total subsets minus the empty set)

```cpp
// number of ways to select 2 after ith index
int cnt2 = 0;
for(int i = n-1; i >= 0; i--) {
    if(nums[i] == 2) cnt2++;
    ways2[i] = pow(2, cnt2, mod) - 1;
}
```

### Step 2: Calculate ways to select 0's before each position

Similarly, for each position i, we compute the number of ways to select at least one "0" from positions before i:
- Count how many 0's appear before position i
- If there are k such 0's, there are 2^k - 1 ways to select at least one of them

```cpp
// number of ways to select 0 before ith index
int cnt0 = 0;
for(int i = 0; i < n; i++) {
    if(nums[i] == 0) cnt0++;
    ways0[i] = pow(2, cnt0, mod) - 1;
}
```

### Step 3: Calculate the total count

The tricky part is counting subsequences with multiple 1's. For each position i where nums[i] = 1:

1. Add the count of subsequences where this 1 is the only 1 selected:
   ```cpp
   ans = (ans + (ways0[i] * ways2[i]) % mod) % mod;
   ```

2. Add the count of subsequences where we use this 1 along with some previously seen 1's:
   ```cpp
   ans = (ans + ((ways * ways2[i]) % mod) % mod) % mod;
   ```

3. Update the running sum of ways to form subsequences ending with the current 1:
   ```cpp
   ways = (((ways * 2 + ways0[i]) % mod));
   ```

This recurrence relation can be understood from the comments in the code. The key insight is that when we see a new 1, we can either:
- Use it as the only 1 in our subsequence
- Combine it with previously seen 1's, doubling the possibilities (include/exclude this 1)
- Add new possibilities starting from 0's before it

## Fast Modular Exponentiation

The solution includes a binary exponentiation function `pow` to efficiently compute (base^exponent) % mod:

```cpp
int pow(int n, int p, int mod) {
    long long int res = 1;
    long long int nl = n;
    while(p > 0) {
        if(p & 1) {
            res = (res * nl) % mod;
            p--;
        }
        nl = (nl * nl) % mod;
        p >>= 1;
    }
    return res;
}
```

This uses the property that n^p = (n^(p/2))^2 if p is even, or n^p = n * n^(p-1) if p is odd, reducing the number of multiplications from O(p) to O(log p).


# Complexity
- Time complexity: **O(nlogn)**

- Space complexity: **O(n)**

# Code
```cpp []
class Solution {
public:
    int pow(int n, int p, int mod) {
        long long int res = 1;
        long long int nl = n;

        while(p>0) {
            if(p&1) {
                res = (res * nl) % mod;
                p--;
            }

            nl = (nl * nl) % mod;
            p>>=1;
        }

        return res;
    }
    int countSpecialSubsequences(vector<int>& nums) {
        int n = nums.size(), mod = 1e9 + 7;
        vector<long long int> ways2(n), ways0(n);
        int cnt2 = 0;
        for(int i = n-1;i>=0;i--) {
            if(nums[i] == 2) cnt2++;
            ways2[i] = pow(2, cnt2, mod) - 1;
        }

        int cnt0 = 0;
        for(int i = 0;i<n;i++) {
            if(nums[i] == 0) cnt0++;
            ways0[i] = pow(2, cnt0, mod) - 1;
        }
        
        long long int ans = 0, ways = 0;
        int cnt1 = 0;
        for(int i = 0;i<n;i++) {
            if(nums[i]!=1)continue;

            ans = (ans + (ways0[i] * ways2[i]) % mod) % mod;
            ans = (ans + ((ways * ways2[i]) % mod) % mod) % mod; 
            ways = (((ways * 2 + ways0[i]) % mod));
        }

        return ans;
    }
};
```

Refs: 
- [Leetcode](https://leetcode.com/problems/count-number-of-special-subsequences/description/)
- [Leetcode My Solution](https://leetcode.com/problems/count-number-of-special-subsequences/solutions/6526560/intuitive-combinatorics-solution-explained-in-detail)


202503120905
