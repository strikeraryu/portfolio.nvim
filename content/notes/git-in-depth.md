
# Basic Commands
- `git add <file | pattern>`
- `git commit -m <message>`
- `git status`

## Git logs
Log the history for the GIT

Useful flags:
- `--graph` 
- `--decorate` (for normal output we don't need to add this flag but when copying into some file we need to add it)
- `-S` to search in git log
- `-p` to generat diff in patch format

## Commits

- Commit have SHA with them (we can use first 7 character of SHA and git will identify the commit)
- We can find commit in `.git` dir using SHA. git using first 2 character as dir and rest as file name. Eg.
```
./objects/14
./objects/14/7ebcd00a63719ea113df7a9374cdeac71a2a93
./objects/14/90eb51d5c15b84bfae3c0a4a733f1892c6e209
```
- `git cat-files -p <sha>`, will print the uncompressed commit. Eg.
```
tree 79e7e451c7312cd7f65edb453d2cfd8cdbea67c4
parent 740756633757d58989dae52b81096416947eb0f8
author AryamaanScaler <aryamaan.jain@scaler.com> 1722857801 +0530
committer AryamaanScaler <aryamaan.jain@scaler.com> 1722857801 +0530

sync: 050820241706
```

- Tree is like a directory and parent is the previous commit. We can use this SHA further to get info
- Blob is like a file

```
040000 tree f8405a902301f6086558a3fe0c53120b40afe1b0    .obsidian
040000 tree ce1e1bf58c4790b4e4ec0ae83c918c9bea0ed62b    0-inbox
040000 tree 36c59ace9b64b0337ff0f38a06f630215e589bfd    00-zettelkasten
040000 tree 90d72ac5acff61d12c587676f6e974dce325a606    1-periodic-notes
040000 tree 52de1798b80ad9f845a2f6a7d0ec98a857a1b600    2-resources
100644 blob e69de29bb2d1d6434b8b29ae775ad8c2e48c5391    debug.md
040000 tree 20e2ec79c7e16bbbca7a502a99f0ef8062cd268c    templates
```

GIT does not store diffs, each commit stores the entire source for the code. We can use the commit to rebuild the code.
Case: We made a file and committed it. When we create another file and commit it. The three stores pointers to previous file.
```
# Tree of first commit (added first file)
100644 blob e2d5924275e87051eb139244dc4bb369229a0276    first.md

# Tree of second commit (added the second file without the change)
100644 blob e2d5924275e87051eb139244dc4bb369229a0276    first.md
100644 blob 1c59427adc4b205a270d8f810310394962e79a8b    second.md

# Tree of third commit (changes the first fil)
100644 blob 3dcd716bc4434d9bc43f1a3e67268e8983bc99a5    first.md
100644 blob 1c59427adc4b205a270d8f810310394962e79a8b    second.md
```

## Git config
- We can use `git config -add section.key value` to add new git config values. Eg. `git config --add user.name "git_user"`
- Git config can store same key multiple time but when fetches it will always used the last key
- `git congif --list` to list the conFigs


## Git branch
- `git branch <branch_name>` will create a branch from that commit. (will not switch to it)
- `git log --graph --all` to see commits from all the branches
- Content in branch file in `.git`, just store the SHA value of the last commit in that branch
- `git checkout <branch>` to switch a branch
- `git branch -D <branch_name>` to delete the file

### Git Merge
- `git merge <branch_name>`
- Each branch have SHA value for the last commit. Two find the merge divergent point we start from the commit history and find the first point with different commit to find the best common ancestor. (it uses hash maps)
- Git then add all commit to the base branch as a single commit. It will combine all the commits and create a single commit which will be added to the tip of base branch.
- When its a divergent branch it will require a message as it combine the commits and added it after the tip.
- In case of linear merge (base branch was not update after creating the new branch) the best commit ancestor will be the tip for the base branch, So it will just eastward and now point to the latest commit. (we can acoud fast forward merge using --no-ff)

### Git Rebase
- `git rebase <branch_name>`
- It got the the target branch replay out commit after the head of that branch and after that our current branch will point to the new head
- This changes the history of the current branch to match the latest head
```
Before rebase
/ - B - C(branch)
A - D(main)

After rebase
    / - B - C (branch)
A - D(main)
```
- As there is no divergence now we can just do fast forward merge

### Head
- Point the the head commit for the branch

### Reflog
- Give the history where head have been.
```
6a698bc (HEAD -> dead) HEAD@{0}: checkout: moving from main to dead
869b308 (main) HEAD@{1}: checkout: moving from main-copy to main
869b308 (main) HEAD@{2}: checkout: moving from 869b30873020669a9b07a4d79d399b83f3e83702 to main-copy
869b308 (main) HEAD@{3}: checkout: moving from main to 869b308
869b308 (main) HEAD@{4}: checkout: moving from 6a698bc67f10f870465144079383c810ae9b75d3 to main
6a698bc (HEAD -> dead) HEAD@{5}: checkout: moving from main to 6a698bc
869b308 (main) HEAD@{6}: checkout: moving from dead to main
6a698bc (HEAD -> dead) HEAD@{7}: commit: added new file to be dead
12516d3 (branch2) HEAD@{8}: checkout: moving from main to dead
```
- We can use the SHA to bring that commit back using `git branch <branch_name> <sha>` or you can checkout to that commit and do `checkout -b` to new branch with that changes

### Cherry Pick
- Can be used to perform action on specific commits. To use Cherry Pick the working tree and staging area should be clean
- `git cherry-pick <sha>` it will add that specific commit to your branch at top

## Git Remote
- Remote is like a copy of your project
- You can add remote using `git remote add <remote-name> <path>` path can be anything - path to file, url and etc
- You can add remote to some git repo. Then use git fetch to get all the commits (in remote), but will not be added to your local repo/branch
- We can further use `git merge origin/<branch_name>` considering origin is remote name to get the details in local repo/branch
- We can use `git pull` to do both steps together. (but we need to either specify to pull from which remote branch or set tracking information)
    - `git pull <remote> <branch>`
    - `git branch --set-upstream-to=<remote>/<branch> <branch-in-current-repo>`
- Similarly we can use `git push` to send and add our changes to remote directory
    - By default remote branch should not be checkout to the branch we are pushing. Else we will not be to push it
    - Also the branch name should be same
    - We can use `git push --set-upstream origin main` to set the upstream to track

## Git stash
- We can use `git stash` to add all our changes till head commit to a stash area. (Go back to head)
- Some other commands
    - `git stash list` show all stashes
    - `git stash show [--index index]` show diff for stash
    - `git stash pop [--index index]` pop the latest stash or index stash
- git stash work as stack, add latest stash at top
- You can stash only tracked files

## Git conflicts
- Conflicts happens when we have 2 different changes on same line
- In rebase it opposite as our head is pointing to latest commit from remote.
```
# In merge
<<<<<<< Head
local change
=======
remote change
>>>>>>> <SHA>

# In Rebase

<<<<<<< Head
remote change
=======
local change
>>>>>>> <SHA>
```
- As rebase add our commit at top of history of another branch, we can face same merge conflict again. If we choose our change. As doing next rebase we will try to add our commit again at the top which will create the conflict
- We can use `rerer.enabled true` to resuse our old resolutions
- We can use `git checkout --ours <filename>` to accept all ours changes, similarly we can use `--theirs` to accept all their changes

### Interactive Rebase
- We can use `git rebase -i <commit-ish>` now we can choose how to replay each commit, We can use `head~n` to replay last n commits. This can used to change history:-
    - Change commit messages
    - Delete commit
    - Squash commit
    - ...
- After the rebase we need to force push as we have changes the history

## Git Search
- `git log --grep=<pattern>` to search it messages
- `git log -- <file-patter>` to get specific file

## Git bisect
- Using bisect we can use use kind-of binary search to find a commit with specific condition like failing test case

## Git revert
- Can be used to create undo some commit, it creates a new commit with reverse change to undo the commit
- `git commit <sha>`

## Git reset
- `git reset --soft <sha>` will match to a tree without change my current working tree or index
    - `git commit --amend` if just opposite of reset soft, it takes you staged changes and add to the last commit. you can add '--no-edit' if you want want to change the message
- `git reset --hard [<sha>]` to match to a specific tree while dropping all the changes in working tree and index

## Worktree
- Create a copy of the state as new individual working tree
- `git worktree add <path>` it will create a new worktree in dir given with path and use base_name(last dir name) as the branch name
- a worktree dont have `.git` dir but a `.git` file, which just store the path to the original repo, Eg. `gitdir: /Users/striker/test/git-exp-remote/.git/worktrees/copy-tree-git-exp`
- we can remove worktree either by removing the folder and the prunining `git worktree prune` or directly remove it using `git worktree remove <path>`

## Tags
- Are inmutable state in git history
- Can use `git tag <name>` to create
- Can use `git tag -d <name>` to delete
- Can use `git tag` to list
- Can use `git checkout <tag>` to checkout to a tag, but it will be a detached head state
- Can use `git push tag <tag>` to push a single tag or `git push --tags` to push all tags




# Extras
- git have buffer limit for commit when pushing on HTTP so it can reject large commits, To increase that we can use `git config http.postBuffer 524288000`

Refs: 


202408051709
