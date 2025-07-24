# Intuition:
We start by choosing the best element, which is the greatest element. We can choose the greatest element until it is the first element with the highest prime score. On the left, we can only choose elements with a lesser prime score because if we include an equal prime score, it will start using that element. On the right, we can also choose elements with an equal prime score.

For each index, we find the valid `l` and `r`. The total ways we can add an element at index `i` to the final score is determined by the total number of elements on the left multiplied by the total number of elements on the right.

# Approach:
1. **Compute Prime Scores Efficiently:**
   - Use a function `primeScore()` to calculate the number of distinct prime factors for each element in `nums`.
   - Use memoization (`mem` array) to store computed values and avoid redundant calculations.

2. **Determine Valid Subarray Ranges (`l` and `r`):**
   - We need to determine for each index `i`, how far left and right we can extend while ensuring that `nums[i]` remains the element with the highest prime score.
   - To do this, we use two passes:
     - **Right Bound (`dpr[i]`):** Using a monotonous stack, determine the rightmost index `r` where `nums[i]` has the highest prime score.
     - **Left Bound (`dpl[i]`):** Similarly, determine the leftmost index `l` where `nums[i]` maintains dominance.

3. **Process Elements in Descending Order:**
   - Since we want the maximum possible score, we prioritize larger elements first.
   - Sort elements in descending order based on their value.

4. **Calculate Contribution of Each Element:**
   - The number of valid ways `nums[i]` can be included in the final score is determined by:
     
     ```
     ways = (right_bound - current_index + 1) * (current_index - left_bound + 1)
     ```
     
   - We select the minimum of `ways` and `k` to ensure we do not exceed our limit.
   - Update `k` accordingly and multiply the score using modular exponentiation (`powm()` function).


# Code Walkthrough:
## **Prime Score Calculation:**
```cpp
int primeScore(int ind, vector<int>& nums, vector<int>& mem) {
    if (mem[ind] != -1) return mem[ind];
    int n = nums[ind];
    int ans = 0;

    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            ans++;
            while (n % i == 0) {
                n /= i;
            }
        }
    }
    if (n > 1) ans++;
    return mem[ind] = ans;
}
```
This function determines the number of distinct prime factors of `nums[ind]` and caches the result to avoid redundant calculations.

## **Modular Exponentiation:**
```cpp
long long int powm(long long int a, long long int b, int mod) {
    long long int ans = 1;
    while (b) {
        if (b & 1) {
            ans = (ans * a) % mod;
        }
        a = (a * a) % mod;
        b >>= 1;
    }
    return ans;
}
```
This function efficiently calculates `(a^b) % mod` using binary exponentiation.

## **Finding Valid Ranges (`l` and `r`):**
```cpp
stack<int> st;
for (int i = n - 1; i >= 0; i--) {
    while (!st.empty() && primeScore(st.top(), nums, mem) <= primeScore(i, nums, mem)) {
        st.pop();
    }
    dpr[i] = st.empty() ? n - 1 : st.top() - 1;
    st.push(i);
}

st = stack<int>();
for (int i = 0; i < n; i++) {
    while (!st.empty() && primeScore(st.top(), nums, mem) < primeScore(i, nums, mem)) {
        st.pop();
    }
    dpl[i] = st.empty() ? 0 : st.top() + 1;
    st.push(i);
}
```
This step computes the left and right bounds (`dpl` and `dpr`) using stacks in `O(n)` time.

## **Processing Elements in Descending Order and Calculating Score:**
```cpp
sort(v.begin(), v.end(), [](vector<int> &a, vector<int> &b) { return a[0] > b[0]; });
for (int i = 0; i < n; i++) {
    if (k <= 0) break;
    int l = dpl[v[i][1]], r = dpr[v[i][1]];
    long long int ways = (1LL * (v[i][1] - l + 1)) * (r - v[i][1] + 1);
    ways = min(ways, 1LL * k);
    k -= ways;
    ans = (ans * powm(v[i][0], ways, mod)) % mod;
}
```
We process elements in descending order, ensuring we maximize the score while respecting the constraint `k`.


# Complexity Analysis:
- **Prime Score Calculation:** `O(n log m)`, where `m` is the max value in `nums`.
- **Finding Valid Ranges (`l` and `r`):** `O(n)`.
- **Sorting Elements:** `O(n log n)`.
- **Final Computation:** `O(n log k)`, due to modular exponentiation.

**Overall Complexity:** `O(n log n + n log m)`, which is efficient for large inputs.


# Code
```cpp []
class Solution {
public:
    int primeScore(int ind, vector<int>& nums, vector<int>& mem) {
        if(mem[ind] != -1) return mem[ind];
        int n = nums[ind];
        int ans = 0;

        for(int i=2;i*i<=n;i++) {
            if(n%i == 0) {
                ans++;
                while(n%i == 0) {
                    n /= i;
                }
            }
        }
        if(n > 1) {
            ans++;
        }

        return mem[ind] = ans;
    }

    long long int powm(long long int a, long long int b, int mod) {
        long long int ans = 1;
        while(b) {
            if(b&1) {
                ans = (1LL*ans*a)%mod;
            }
            a = (1LL*a*a)%mod;
            b >>= 1;
        }
        return ans;
    }

    int maximumScore(vector<int>& nums, int k) {
        int mod = 1e9 + 7, n = (int)nums.size();
        long long int ans = 1;

        vector<vector<int>> v;
        vector<int> dpr(n, 0), dpl(n, 0), mem(n, -1);

        stack<int> st;
        for(int i=n-1;i>=0;i--) {
            while(!st.empty() && primeScore(st.top(), nums, mem) <= primeScore(i, nums, mem)) {
                st.pop();
            }
            if(!st.empty()) {
                dpr[i] = st.top()-1;
            } else dpr[i] = n-1;
            st.push(i);
        }

        st = stack<int>();
        for(int i=0;i<n;i++) {
            while(!st.empty() && primeScore(st.top(), nums, mem) < primeScore(i, nums, mem)) {
                st.pop();
            }
            if(!st.empty()) {
                dpl[i] = st.top()+1;
            }
            st.push(i);
        }

        for(int i=0;i<n;i++) { v.push_back({nums[i], i}); }
        sort(v.begin(), v.end(), [](vector<int> &a, vector<int> &b) { return a[0] > b[0]; });

        for(int i=0;i<n;i++) {
            if(k<=0) break;
            int l = dpl[v[i][1]], r = dpr[v[i][1]];
            long long int ways = (1ll*(-l+v[i][1] + 1)) * (r - v[i][1] + 1);
            ways = min(ways, 1ll*k);
            k-=ways;

            ans = (ans * (powm(v[i][0], ways, mod))) % mod;
        }


        return ans;
    }
};

```

Refs: 
- [Leetcode](https://leetcode.com/problems/apply-operations-to-maximize-score)
- [Leetcode My Solution](https://leetcode.com/problems/apply-operations-to-maximize-score/solutions/6591629/intuitive-approach-with-in-depth-explana-75oi)


202503291122
