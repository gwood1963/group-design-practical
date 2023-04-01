
To run test.js, use live server extension for VSCode, and run main.html using Live Server

///////////////////////////////////// UPDATED 3/31 ////////////////////////////////////

Max flow and random generation work as desired, seed reading is not complete yet

We will need to discuss seed format. 
 - possibly use seed in database, for example: 
 for user or admin, input "Microsoft1", on database side "Microsoft1" corresponds to a particular puzzle
 We don't need to have the seed itself store the info, but in database it should.

//////////////////////////////////// Visualization ////////////////////////////////////
1/4/23

I (David) will work on determining the positions of nodes for display. 

Idea: 
 - minimize crossing Number
 - Have the area/aspect ratio appropriate (use a function that takes params width and length)
 - minimize total length of edges
 - consider angular resolution maaybe.... preferably not have very sharp or flat angles
 - maybe use a force based system (each node repels from other nodes and the boundaries, but attract to connected nodes)
 