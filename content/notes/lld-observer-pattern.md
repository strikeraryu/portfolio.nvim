# Observer Pattern
- The Idea is to create a pattern which can seamlessly notify Updates to different things.
For eg.
Lets take google sheet, and I want to make the owners can opt-in for notifications on updates by other.
Now each owner can poll to all the docs (where he opt in) and check for updates, as that will not be ideal

So we can create observer(owner) and observable(doc), and whenever the doc is updated, it the job of observable to notify the observer which then can perform some actoin based on the update

```

Observer
Observable observerable
- update()

Observable
list<Observer> observers

- add // add the observer to the list
- remove // remove the observer from the list
- notify // notify all the observers
```

## Case-Study
We user a similar design pattern in scaler for metrics.
The problem statement was, on different dashboards where were elements which shown solved% for different problems on different level like on test level, user level etc.
Now fetching the data on the fly was very expensive as we had lot of data in these table, so query each time was talking lot of time

Now to fix this we created ModelStat - this tables stores different metrics for each model for different level.
**ModelStatDefinition**
- observer_type
- target_type
- metric_type [sum, max, min, avg]
- status [active, inactive, archived]

**ModelStat**
- observer_type
- observer_id
- target_type
- target_id
- model_stat_definition_id
- value
- count


Now if we can to observer a combination of target and observer, we create updates in relationship tables. 
Eg. where we want to keep metrics of solved% for test level. we create updater in TestProblem Table which stores which test have which problems.

We user rails concern, to create this simple updater. Which is like simplying defining the configuration.
eg.

```ruby
update_model_stats :test_problem_solved_count,
                     observer_type: 'Test', observer_id: :fetch_test_id, 
                     target_type: 'Problem', target_id: :problem_id,
                     condition_method: :status_changed_to_solved?,
                     delta_total_count: 0,
                     delta: 0
```

- test_problem_solved_count - (this is the slug for model stat definition)
- fetch_test_id - (this is a method to get which observer to update)
- problem_id - (this is a method to get which target to update)
- status_changed_to_solved? - (this is a method which work as a condition on when to update)
- delta_total_count - (this is the delta to update the count in model stat)
- delta - (this is the delta to update the value in model stat)

**update_model_stats**
This a concern which adds callback to that model on create, update, delete. And call the updater with that configuration. So we can update the value accordingly.

### Addition
- To improve the load on the DB, we also created lazy update. Which stores the ledger of updates in redis. and flush updates periodically or if cache data gets to big.

Refs: 


202411060848
