What I am currently working on is testing the code and making sure what I have currently works.

The main problem right now is the adjMatrixWithCap function in Graph.js. 
For some reason (maybe due to referencing the same point in memory? same as second main issue?) the outputted
matrix is totally wrong. 

The second main problem right now is in MaxFlowSolver.js, with references.
Basically, supose we have var G = new Graph(..., ...)
Then we do var H = G
Then we do for example H.setCapacitiesZero()

That will have the same effect as G.setCapacitiesZero() since they point to the same section of memery

it's annoying, but I need to make sure to make completely new stuffs to prevent this. 

///////////////////////////////////// UPDATED 3/30 ////////////////////////////////////

Current error is in MaxFlowSolver.js lines 239 with calculating path, it's infinitely adding 0 currently