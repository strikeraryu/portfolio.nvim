![Hamiltonian cycle](/assets/blogs/hamiltonian/cover.png)

Let’s take a step back and let’s see what’s a **hamiltonian cycle**. In the mathematical field, it’s a concept of **graph theory**. A **graph** is like a map of nodes. Where each node connects with an edge, and this represents that there is a path between those specific nodes. A graph is used in many ways to represent all kinds of data.

![Graph](/assets/blogs/hamiltonian/graph.png)

The edges between nodes represent a direct connection between them. We can use a combination of these edges to show a path between two nodes that are not directly connected. A Hamiltonian path is a path in a graph where all nodes are only visited once. A hamiltonian cycle is a cycle of the hamiltonian path where the first node and last node are the same.

![Hamiltonian Cycle](/assets/blogs/hamiltonian/cycle.png)

# **How to find a Hamiltonian cycle in an undirected graph?**

To find a Hamiltonian cycle in a graph (whenever I use a word graph I am talking about an undirected graph) we can use **backtracking**. In this algorithm, we will keep a log of the path till now, and we will add nodes to it. If the node is not already present in the path we will keep adding nodes. Else we will backtrack to the previous working state and check new nodes with that. In the end, if we can’t find any path with the required conditions we will say there is no possible hamiltonian cycle in this graph.

![Kinds of graph](/assets/blogs/hamiltonian/types.png)  

---

# **Let see the algorithm in-depth**

First, let’s create a function to check if a node N is ok to add to the path. We will check if N and the last node have an edge between them. After that, we will see if N is not already present in the path. If both conditions hold, we will return true that it is ok to add N in the path.

```cpp
bool node_check(int node, vector<vector<int>> graph, vector<int> path, int pos){  
    // node is not conneccted to the prev node of the path  
    if(graph[path[pos - 1]][node] == 0)  
        return false;  
    // check the node is already visited in the path  
    for(int i = 0; i < pos; i++)  
        if(path[i] == node)  
            return false;  
    return true;  
}
```

Now let’s create a **recursive function** to find hamiltonian cycle in the graph. The base case for this function will be if we have added all nodes in the path. Further, we will check if the last node and first node of the path have an edge between them. If an edge is present between those two nodes we will return true, or else we will return false. Let’s have a look over the recursive step. We will try to add each node in the path and check if it is valid or not. If the node is valid we will add it to the path and look further for the hamiltonian cycle using recursive call. If the function returns false, it shows we can’t find any hamiltonian cycle with the specific node. Then we will remove the node from the path and further check with other nodes.

```cpp
bool find_cycle(vector<vector<int>> graph, vector<int> &path, int pos, int n)  {    
    // check all node are added to path  
    if(pos == n){    
        // And check the is a edge between first node and the last node of the path  
        if(graph[path[pos - 1]][path[0]] == 1)    
            return true;    
        else  
            return false;    
    }    
    // we will check all node   
    for(int v = 0; v < n; v++)    
    {    
        // check if node is valid to insert in cycle  
        if(node_check(v, graph, path, pos))  {    
            // we will add node to the path   
            path[pos] = v;    
            // check further   
            if(find_cycle(graph, path, pos + 1, n) == true)    
                return true;    
            // if no valid cycle with this node we will remove it from cycle  
            path[pos] = -1;    
        }    
    }   
    return false;   
}
```

At last, let’s take a graph as an input and find a hamiltonian cycle in it.

**_Include the necessary header file while running the code._**

```cpp
int main() {  
    // to take input of a graph  
    int n, q;  
    cin>>n>>q;  
    vector<vector<int>> graph(n, vector<int>(n));  
    vector<int> path(n, -1);  
    path[0]=0;  
    for(int i = 0; i < q; i++){  
        int a, b;  
        cin>>a>>b;  
        graph[a][b] = 1;  
        graph[b][a] = 1;  
    }  
    // if there is a valid cycle  
    if(find_cycle(graph, path, 1, n)){  
        // print the path  
        for(int i : path)cout<<i<<" ";  
        cout<<path[0];  
        cout<<endl;  
    }  
    else {  
        cout<<"No valid cycle \n";  
    }  
    return 0;  
}
```

**Input**

*(You can provide the number of vertices and edges followed by edge pairs as shown below)*

```
5 6
0 1
1 2
2 3
3 4
4 0
1 4
```

**Output**

```
0 1 2 3 4 0
```

Now let’s see what so great about the hamiltonian cycle. The property of touching a node only once, or we can say never crossing the path in a hamiltonian cycle provides high usability and can be used in real-life problems. Let’s look over one example, we can use these cycles to create a perfect path for the snake to follow in the snake game, so it will never collide with its tail or the border. This can work as the AI for the **snake game**.

![Snake game](/assets/blogs/hamiltonian/snake.gif)

---

202103191420
