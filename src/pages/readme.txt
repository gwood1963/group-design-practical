TODO

//////////////// Round 2 /////////////////


- Implement moneys
when building a road, use the round2.roadCost(i, j, capacity) function to indicate price
then, update bank by running round2.moneyRemaining()
or keep track of bank in frontend but still use round2.roadCost(...).
The reasoning for doing it this way is that length/distance should play 
a role in the price of a road, otherwise users will opt for the greedy solution.

- tweak parameters
In round2.genRandom(...) 
under this.setBankParams(...)
edit the last two values to make the pricing appropriate
To do this, we simple need to play the game a few times to see what values seem to work the best

- Where are the seeds stored? in round 1 it was "/api/getproblem"
- for scoring, use Round2.getScore() or one of the other methods that are there Note: score will be an integer
- Also note, when we build/delete a road, the backend (round2 object) keeps track of it.
To see the current money, use Round2.moneyRemaining()

- database stuffs: store seeds, scores, etc. (George, should be similar to round 1)
