# 🧠 Intuition

We are given a range of numbers `[start, finish]`, a `limit` (maximum digit allowed), and a suffix string `s`. We need to count how many numbers in the range satisfy:
- All digits are ≤ `limit`.
- The number ends with the string `s`.

This is a classic **digit DP** problem with bounds (`start` and `finish`) and a suffix constraint.


# 🧩 Approach

We use a recursive function with memoization (DP) to build each digit from left to right:
- `ind`: Current digit index.
- `ll` (lower locked): Are we still matching the lower bound (`start`)?
- `lh` (higher locked): Are we still matching the upper bound (`finish`)?

We generate each digit `d` from `0` to `limit`, but skip it if:
- `ll` is `true` and `d` is less than `start[ind]`
- `lh` is `true` and `d` is more than `end[ind]`
- We're in the last `|s|` digits and `d` doesn't match the corresponding digit in `s`

Before recursion, we pad the `start` number with leading zeroes to match the length of `finish`.


# ⏱️ Complexity

- **Time complexity:** `O(D × 2 × 2 × L)` → `O(D × L)`  
  where `D` is the number of digits (up to 20) and `L` is the limit (≤ 9)

- **Space complexity:** `O(D × 2 × 2)` → `O(D)`


# ✅ Code

```cpp
class Solution {
public:
    int in(char c) { return int(c) - int('0'); }

    long long int rec(
        vector<vector<vector<long long int>>> &dp, int ind, 
        bool ll, bool lh, string &start, string &end, string &s, int limit     
    ) { 
        if(ind>=end.size())return 1;
        if(dp[ind][ll][lh]!=-1)return dp[ind][ll][lh];

        long long int ans = 0;
        for(int d=0;d<=limit;d++) {
            if(ll && d<in(start[ind]))continue;
            if(lh && d>in(end[ind]))continue;
            if(ind>=(end.size() - s.size()) && d!=in(s[ind - end.size() + s.size()]))continue;

            ans += rec(dp, ind+1, ll&&(d==in(start[ind])), lh&&(d==in(end[ind])), start, end, s, limit);
        }

        return dp[ind][ll][lh] = ans;
    }

    long long numberOfPowerfulInt(long long start, long long finish, int limit, string s) {
        string ss = to_string(start);
        string se = to_string(finish);

        vector<vector<vector<long long int>>> dp(
            20, vector<vector<long long int>>(2, vector<long long int>(2, -1))
        );
        for(int i=ss.size();i<se.size();i++)ss='0'+ss;

        return rec(dp, 0, true, true, ss, se, s, limit);
    }
};
```


Refs: 
- [Leetcode](https://leetcode.com/problems/count-the-number-of-powerful-integers)
- [Leetcode My Solution](https://leetcode.com/problems/count-the-number-of-powerful-integers/solutions/6641884/intuitive-approach-with-in-depth-explana-bnsq)

202504121141
