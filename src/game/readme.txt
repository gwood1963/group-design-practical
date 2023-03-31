The main problem to be aware of is with references.
Basically, supose we have var G = new Graph(..., ...)
Then we do var H = G
Then we do for example H.setCapacitiesZero()

That will have the same effect as G.setCapacitiesZero() since they point to the same section of memery

it's annoying, but I need to be very careful to prevent this

///////////////////////////////////// UPDATED 3/31 ////////////////////////////////////

Max flow seems to work now, working on random generation 
now and more verification that max flow works