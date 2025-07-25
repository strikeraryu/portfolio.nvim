# Issue
I was adding new gem for AWS bedrock in scaler, and during install was showing error that a newer version of aws sdk was required (it was a dependencies of bedrock gem). 
When I did bundle install it gets stuck at resolving dependencies. I tried removing gem lock file and duing bundle install but still same.

# Fix
To fix this issue I did first bundle update aws-sdk gem and then I did bundle install for the new gem

Refs: 


202408252105
