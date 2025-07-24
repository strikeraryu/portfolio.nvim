
# 💡 Intuition

The key idea is:

> The LCA of the deepest leaves is the **lowest node** in the tree that contains **all deepest leaves** in its subtree.

Instead of computing LCA the traditional way, we:
1. Find the **maximum depth** of the tree.
2. Traverse the tree again to count how many deepest leaves (nodes at max depth) exist under each node.
3. The **first node from bottom to top** that covers **all** deepest leaves in its subtree becomes the answer.


# 🧠 Approach

1. `mx(root)`: Recursively find the **maximum depth** of the tree.
2. `rec(root, d, ans, mx)`: For each node:
   - Count how many nodes are at depth `d` in its subtree.
   - If this count exceeds current `mx`, update the result node (`ans`).
3. The LCA will be the node with the highest count of deepest nodes under it.


# ✅ Code Explanation

```cpp
int mx(TreeNode *root): 
    // Compute the max depth of the tree.
    return 1 + max(mx(root->left), mx(root->right));

int rec(TreeNode *root, int d, TreeNode* &ans, int &mx): 
    // Count nodes at depth d. Update ans if count increases.
    if (d == 0) return 1; // Reached a deepest leaf
    if (!root) return 0;

    int count = rec(root->left, d - 1, ans, mx) + rec(root->right, d - 1, ans, mx);
    if (count > mx) { mx = count; ans = root; }

    return count;
```


# 🧪 Time & Space Complexity

- **Time**: O(n), where n is the number of nodes (each node visited twice).
- **Space**: O(h), where h is the height of the tree (recursion stack).

Refs: 
- [Leetcode](https://leetcode.com/problems/lowest-common-ancestor-of-deepest-leaves/description)
- [Leetcode My Solution](https://leetcode.com/problems/lowest-common-ancestor-of-deepest-leaves/solutions/6640275/intuitive-approach-leaves-count-explaine-dbq2)


202504112056
