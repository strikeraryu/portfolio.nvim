# Intuition

1. **Shift Perspective:** Since the observer’s position is given, we translate all points relative to the observer’s location. This makes the observer the new origin — simplifying the problem.
   
2. **Convert to Angles:** Instead of working with Cartesian coordinates, we convert each point to an angle using the **atan2** function. This helps us compare points based on their angular position from the observer.
   
3. **Sorting & Sliding Window:** We sort these angles and use a two-pointer (sliding window) approach to efficiently count the number of points within any given angular range. This allows us to determine the maximum number of visible points.

# Approach

1. **Translate Points:** Subtract the observer's location from all points to shift the origin.
2. **Filter Out the Observer's Position:** If a point coincides with the observer’s location, it is always visible. We count these separately.
3. **Compute Angles:** Use `atan2(y, x)` to find the angle each remaining point makes with the positive x-axis, converting it into degrees.
4. **Sort Angles:** Sort these angles to allow easy range calculations.
5. **Extend Range for Circular Window:** Since angles wrap around at 360°, we duplicate the list by adding 360° to each angle and appending it to the original list. This helps handle the circular nature of the problem.
6. **Use Sliding Window:** Maintain a window `[l, r]` where all angles within the window fit inside the given `angle` range. Update `l` and `r` accordingly to maximize the count.

# Complexity Analysis
- **Sorting the Angles:** \(O(N \log N)\)
- **Sliding Window:** \(O(N)\)
- **Overall Complexity:** \(O(N \log N)\), where \(N\) is the number of points.


# Code Explanation

```python
import math
from typing import List

class Solution:
    def angle(self, p):
        theta = math.degrees(math.atan2(p[1], p[0]))
        return theta if theta >= 0 else theta + 360

    def visiblePoints(self, points: List[List[int]], angle: int, location: List[int]) -> int:
        # Translate points relative to the observer
        points = [(p[0] - location[0], p[1] - location[1]) for p in points]
        
        # Count points that coincide with the observer
        stationary_count = sum(1 for p in points if p == (0, 0))
        
        # Compute angles for remaining points
        angles = sorted(self.angle(p) for p in points if p != (0, 0))
        
        # Duplicate angles with +360 to handle circular nature
        angles += [x + 360 for x in angles]
        
        # Sliding window to find max points within the given angle
        max_visible = 0
        l = 0
        for r in range(len(angles)):
            while angles[r] - angles[l] > angle:
                l += 1
            max_visible = max(max_visible, r - l + 1)
        
        return max_visible + stationary_count
```

Refs: 
- [Leetcode](https://leetcode.com/problems/maximum-number-of-visible-points/description)
- [Leetcode My Solution](https://leetcode.com/problems/maximum-number-of-visible-points/solutions/6591879/intuitive-approach-with-in-depth-explana-0189)


202503291251
