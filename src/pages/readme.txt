TODO

//////////////// Round 2 /////////////////

- Implement timer
- Implement moneys

- Where are the seeds stored? in round 1 it was "/api/getproblem"
- how to make edges? Idea: predraw all edges in both directions, but have them hidden
- how to initialize money/budget? Probably use method Round2.moneyRemaining() 
on initialization as its initial value is the value in bank
- for scoring, use Round2.getScore() Note: score will be an integer
- Also note, when we build/delete a road, the backend (round2 object) keeps track of it.
To see the current money, use Round2.moneyRemaining()

- database stuffs: store seeds, scores, etc. (George, should be similar to round 1)
