# Oxford Group Design Practical - Group 12

## Initial Brief

The initial brief given was as follows:

> Project L: Finding Technical Talent [Project in collaboration with Microsoft]
> A software telecoms company are looking for ways to attract and identify new technical talent.
> They’re looking for some kind of game or puzzle that will run in a web browser, with twin underlying goals of (a) get lots of students interested in and applying to the company and (b) automatically flagging any particularly good looking candidates to the company to fast- track to interview.
> The company has some ideas for puzzles and games that might work, but are open to ideas and suggestions from the consultants (you!) – they’re really looking for something with wow factor.
> There’s no restriction on the set of languages/packages/back-end that you use.

## Project usage

To run the project, run the command `npm run start` in the root directory. A full build can be produced with `npm run build`

To run on the express server, run `npm run build` in root directory.
Then run `npm run dev` in server and navigate to localhost:3001 in your browser.
The server will recompile and restart when any files in server are changed.
If your changes only affect the React code, you will need to run `npm run build` in root again to trigger a server restart.
You will also need to refresh the page in your browser. This must be done at the homepage or it will cause an error.

## Technologies Used

### React

We are using React as we plan to build a web app, and React is the industry standard for creating interactive, dynamic websites. This has the advantage of allowing us to reuse components instead of copying HTML code over multiple places, as well as easier management of when various Javascript code runs (using `useEffect`, `useMemo`, and `useCallback` hooks). We will use functional components rather than class components, as these are what are preferred in the latest versions of React, and they will allow us to use less boilerplate code.

### TypeScript

TypeScript will allow us to add typing to our project. This has the advantages of reducing runtime errors (as we get compile-time type checking), as well as a form of documentation (the typescript language server will tell you the types required for a function call through your editor's LSP integration).

### Azure Backend

Using Microsoft's Azure **backend as a service** solution will allow for much simpler scalability, as we will not have to worry about managing servers or databases ourselves. Azure also has simple ways to deploy and integrate with React projects, so this will speed up development time. 
