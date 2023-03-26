What I am currently working on is testing the code and making sure what I have currently works.

The main problem right now is in MaxFlowSolver.js, with references.
Basically, supose we have var G = new Graph(..., ...)
Then we do var H = G
Then we do for example H.setCapacitiesZero()

That will have the same effect as G.setCapacitiesZero() since they point to the same section of memery

it's annoying, but I need to make sure to make completely new stuffs to prevent this. 