# Intuition

## Initial Approach (TLE Solution)
### Idea:
- Use Dynamic Programming (`dp`) to keep track of valid sequences.
- `dp[i][0]` stores the count of valid sequences of length `i` without 'A'.
- `dp[i][1]` stores the count of valid sequences of length `i` that include 'A'.

### Transition:
- Iterate over previous lengths and place 'L' or 'LL' at different positions.
- Sum valid configurations while ensuring conditions hold.
- However, due to nested loops, the approach runs in `O(n^2)`, leading to TLE.

### Why It Fails:
- The nested loop iterates over all previous lengths, making it inefficient for large `n`.
- This leads to redundant calculations, increasing time complexity significantly.

```
for(int j=0;j<=(i-2);j++) {
    dp[i][0] = (dp[i][0] + dp[j][0])%mod;
    dp[i][1] = (dp[i][1] + dp[j][1] + dp[j][0]*(i-j-1))%mod;
    if(j<=(i-3)) {
        dp[i][0] = (dp[i][0] + dp[j][0])%mod;
        dp[i][1] = (dp[i][1] + dp[j][1] + dp[j][0]*(i-j-2))%mod;
    }
}
```


## Optimized Approach
### Optimizations:
- Instead of iterating over all previous lengths, maintain precomputed values.
- Track:
  - `prev1, prev2, prev3`: Count of valid sequences without 'A' for previous lengths.
  - `pprev1, pprev2, pprev3`: Count of sequences contributing 'P' values.
  - `mprev1, mprev2, mprev3`: Sum of valid sequences.

### Steps:
1. Compute sequences without 'A' using recurrence relations.
2. Compute the count of 'P' occurrences to determine how many ways an 'A' can be inserted.
3. Use rolling variables to avoid inner loops and improve time complexity to `O(n)`.

### Formula:
- `dp[i][0] = prev2 + prev3 + 2` (adding 'L' and 'LL')
- `dp[i][1] = pprev2 + pprev3 + mprev2 + mprev3 + (i-2) + (i-1) + i` (counting valid replacements with 'A')

### Explanation of the Formula:
- `dp[i][0]` considers cases where 'L' or 'LL' are placed at different positions without introducing 'A'.
- `dp[i][1]` builds upon `dp[i][0]` by replacing any 'P' with 'A' in valid sequences.
- Rolling variables (`prev1`, `prev2`, etc.) store previous results to avoid recomputation, reducing complexity.


## Explanation of the Code Implementation
### **Key Data Structures:**
- `dp[i][0]`: Stores the number of valid sequences of length `i` without 'A'.
- `dp[i][1]`: Stores the number of valid sequences of length `i` that include one 'A'.
- `prev1, prev2, prev3`: Stores previous valid sequences to reduce redundant calculations.
- `pprev1, pprev2, pprev3`: Stores previous counts of 'P' occurrences.
- `mprev1, mprev2, mprev3`: Tracks cumulative sequences.

### **Code Walkthrough:**
1. **Base Cases:**
   - If `n = 1`, there are two valid sequences (`P`, `L`) without 'A' and one valid sequence with 'A' (`A`).
   - If `n = 2`, precompute valid sequences for quick access.
2. **Transition using Rolling Variables:**
   - Instead of iterating over all previous states, the rolling variables track essential counts from past computations.
   - `dp[i][0]` is updated using `prev2` and `prev3` to count cases where 'L' or 'LL' appear at different positions.
   - `dp[i][1]` is updated using `pprev2`, `pprev3`, `mprev2`, and `mprev3` to count valid sequences when replacing a 'P' with 'A'.
3. **Final Computation:**
   - The total valid sequences are obtained as `dp[n][0] + dp[n][1]`, ensuring results stay within modulo constraints.


# Complexity Analysis
The optimized approach reduces the complexity to **O(n)** due to the use of rolling variables instead of nested loops.


# Code
```cpp []
class Solution {
public:
    int checkRecord(int n) {
        int mod = 1e9 + 7;       
        vector<vector<long long int>> dp(n+1, {1, 0});
        dp[1] = {2, 1};
        if(n>=2)dp[2] = {4, 4};

        long long int prev1 = 7, prev2 = 3, prev3 = 1;
        long long int pprev1 = 5, pprev2 = 1, pprev3 = 0;
        long long int mprev1 = 11, mprev2 = 4, mprev3 = 1;

        for(int i=3;i<=n;i++) {
            // L for every (i-2) postions
            dp[i][0] = (dp[i][0] + prev2)%mod;
            // LL for every (i-3) postions
            dp[i][0] = (dp[i][0] + prev3)%mod;
            // Count of P for cases with L for every (i-2) postions
            dp[i][1] = (dp[i][1] + pprev2)%mod;
            dp[i][1] = (dp[i][1] + mprev2)%mod;
            // Count of P for cases with LL for every (i-3) postions
            dp[i][1] = (dp[i][1] + pprev3)%mod;
            dp[i][1] = (dp[i][1] + mprev3)%mod; 

            // L and LL at the end
            dp[i][0] = (dp[i][0] + 2)%mod;
            dp[i][1] = (dp[i][1] + (i-2))%mod;
            dp[i][1] = (dp[i][1] + (i-1))%mod;
            // All P
            dp[i][1] = (dp[i][1] + i)%mod;

            
            prev3 = prev2; prev2 = prev1; prev1 = (dp[i][0] + prev1)%mod;
            mprev3 = mprev2; mprev2 = mprev1; mprev1 = (mprev1 + prev1)%mod;
            pprev3 = pprev2; pprev2 = pprev1; pprev1 = (dp[i][1] + pprev1)%mod;
        }

        // Total ways for n without using any A
        // + Total P in every ways (as we can replace any 1 P with A)
        return (dp[n][0] + dp[n][1]) % mod;
    }
};


```

Refs: 
- [Leetcode](https://leetcode.com/problems/student-attendance-record-ii/description/?envType=problem-list-v2&envId=7p55wqm)
- [Leetcode My Solution](https://leetcode.com/problems/student-attendance-record-ii/solutions/6580135/intuitive-dp-approach-using-l-positionin-q9oz)


202503260822
