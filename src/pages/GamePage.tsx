import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import MainWrapper from "../components/ContentWrapper";
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import React  from 'react';
import {
  Controls,
  Background,
  EdgeTypes,
  BackgroundVariant,
} from 'reactflow';
import Round1Edge from '../components/Round1Edge';
//import SliderEdge from '../components/SliderEdge';
import ImageNode from '../components/ImageNode'
import { Round1 } from '../game/Round1'
const edgeTypes: EdgeTypes = {
  'Round1Edge': Round1Edge,
};


const GamePage = () => {
  //ON ANY PAGE WHERE YOU NEED INFORMATION ABOUT THE SIGNED IN USER, COPY AND PASTE THE FOLLOWING SECTION AT THE TOP
  //--------------------------------------------------------------------------------------------------------------
  //it will fetch the data of the currently signed in candidate, once when the page opens


  //GEORGE: use the following states varaibles to query the database. They will be of the signed in candidate. userId is unique.
  const [email,setEmail] = useState<string|null>("")
  const [fullName,setName] = useState<string|null>("")
  const [userId,setUserId] = useState<string>("") 

  const auth = getAuth();

  useEffect(() => {onAuthStateChanged(auth, (user) =>{  //I think the useEffect here is needed to prevent infinite loops where the page re-renders, causing the emails and names to be set again, which causes another re-render  etc
    if (user){
      setEmail(user.email);
      setName(user.displayName);
      setUserId(user.uid);  //uniquely identifies users.
      console.log(user.uid)
      console.log(user.email)
      console.log(user.displayName)
      
    }
    })
  }, []);




  

  //----------------------------------------------------------------------------------------------------------------------
  const navigate = useNavigate();
  const blueGradient = "linear-gradient(180deg, rgba(135,219,255,1) 0%, rgba(204,243,255,1) 100%)"
  const yellowGradient = "linear-gradient(180deg, rgba(255,245,156,1) 0%,   rgba(255, 253, 232,1) 100%)"
  const [time, setTime] = useState<number>(0);
  const [collapseButton, collapseState] = useState("+");
  const [instructBoxSize, setBoxSize] = useState("10%");
  const [instructBoxColor, setBoxColor] = useState(blueGradient)
  const toggleCollapse = () => {
    collapseState((state) => (state === "-" ? "+" : "-"));
    setBoxSize((state) => (state === "10%" ? "50%" : "10%"));
    setBoxColor((state) => (state === blueGradient ? yellowGradient : blueGradient))
  };
  
  let start = 0;
  useEffect(() => {
    start = Date.now() / 1000;
    const interval = setInterval(() => {
      setTime(3000 - Math.floor(Date.now() / 1000 - start));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  /** Dummy code to test sliders, remove once data from max flow puzzle has been hooked up to display */
  const [ flow, setFlow ] = useState<number>(5)
  const capacity = 10;



/**BELOW IS THE SET UP FOR THE PUZZLE DISPLAY */
/** ---------------------------------------------------- */

/** ---------- David's Addition, looks very weird compared to my console output */

const round1 = new Round1;
round1.genRandom(5, 3, 2, 2, 5, 10);

const graph = round1.getGraph();
const A = round1.getA();
const ANoCap = round1.getANoCap();
const n = round1.getN();

var coords = round1.getCoords(500, 300);

var initialNodesTemp = [];
for (var i = 0; i < n; i ++) {
  const temp = {
    id: '' + i,
    type: "ImageNode",
    position: { x: coords[i][0], y: coords[i][1] },
    data: {
      label: '',
      image: "/church.svg",
      color: "black"
    }
  };
  initialNodesTemp.push(temp);
}

var initialEdgesTemp = [];
for (var i = 0; i < n; i ++) {
  for (var k = 0; k < A[i].length; k ++) {
    var j = A[i][k][0];
    const temp = {
      id: 'e' + i + '-' + j,
      source: '' + i,
      target: '' + j,
      animated: true,
      type: "Round1Edge",
      data: {Label: '0/' + A[i][k][1]}
    }
    initialEdgesTemp.push(temp);
  }
}

const initialNodes = initialNodesTemp;

/** ---------------------------------------------------------------------- */

  /**TO DO: the x and y coordinates need to be taken from an array. */
  function scalex(x:number) {return x*12.5} /**These scale functions are likely now redundant as I have worked out there is a fitView function. However they are left here in case we still need to convert David's position output into coordinates. */
  function scaley(y:number) {return y*6.5}
  /* const initialNodes = [
    { id: '1', type: "ImageNode", position: { x: scalex(10) , y: scaley(50) }, data: { label: 'West Office', image: "/building2trees.svg", color: "green"} },
    { id: '2', type: "ImageNode", position: { x: scalex(20), y: scaley(30) }, data: { label: '', image: "/church.svg" ,color: "black" } },
    { id: '3', type: "ImageNode",position: { x: scalex(20), y: scaley(80) }, data: { label: '' , image: "/skyscraper.svg", color: "black" } },
    { id: '4', type: "ImageNode",position: { x: scalex(50), y: scaley(40) }, data: { label: '', image: "/building2trees.svg", color: "black"  } },
    {id: '5', type: "ImageNode",position: { x: scalex(60), y: scaley(60) }, data: { label: '' , image: "/factory.svg", color: "black" } },
    {id: '6', type: "ImageNode",position: { x: scalex(70), y: scaley(20) }, data: { label: '' , image: "/skyscraper.svg", color: "black" } },
    {id: '7', type: "ImageNode", position: { x: scalex(80), y: scaley(50) }, data: { label: 'East Office', image: "/building2trees.svg", color: "red"  } },
  ]; */
  /**TO DO: add a label to the start node which says how many people need to get accross.  */

  /**TO DO: The data labels in the edges below need to be taken from the live flow (stored in an array?) and the capacities from the array of capacities */
  /**TO DO: implement that the source and targets are taken from the adjacency list generated */
  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, type: "Round1Edge", data: {label: '5/12', flow: flow, flowFunc: setFlow, capacity: capacity}},
    { id: 'e2-4', source: '2', target: '4', animated: true, type: "Round1Edge", data: {label: '4/8'}},
    { id: 'e4-6', source: '4', target: '6', animated: true, type: "Round1Edge", data: {label: '0/2'}},
    { id: 'e4-7', source: '4', target: '7', animated: true, type: "Round1Edge", data: {label: '2/10'}},
    { id: 'e6-7', source: '6', target: '7', animated: true, type: "Round1Edge", data: {label: '5/9'}},
    { id: 'e5-7', source: '5', target: '7', animated: true, type: "Round1Edge", data: {label: '2/3'}},
    { id: 'e2-5', source: '2', target: '5', animated: true, type: "Round1Edge", data: {label: '5/10'}},
    { id: 'e1-3', source: '1', target: '3', animated: true, type: "Round1Edge", data: {label: '1/11'}},
    { id: 'e3-5', source: '3', target: '5', animated: true, type: "Round1Edge", data: {label: '7/7'}},
    { id: 'e5-7', source: '5', target: '7', animated: true, type: "Round1Edge", data: {label: '2/4'}},
  ];



  const nodeTypes = React.useMemo(() => ({ "ImageNode": ImageNode }), []);
  
  /**------------------------------------------------------------------------------------------------------------ */
  

  return (
    <MainWrapper flexDirection="column">
      <div className = "navBar"
      >
        <div
          id="Timer"
          style={{
            margin: "1rem",
            padding: "0.5rem",
            color: "white",
            border: "2px solid rgba(118, 50, 50, 1)",
            backgroundColor: "rgba(170, 70, 70, 1)",
            borderRadius: "5px",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >Time Remaining: {`${Math.floor(time / 60)
          .toString()
          .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}
				`}</div>
        <div style={{ flexGrow: 1 }}></div>
        <ActionButton 
          text="Submit and Move On" 
          onClick={() => {
            const flows: number[][][] = [] // placeholder until we can read from sliders
            const score = round1.getScore(flows, round1.getGraph())
            fetch ('/api/attempt', {
              method: 'POST',
              body: JSON.stringify({
                score: score,
                uid: userId,
                seed: round1.makeSeed()
              })
            })
            navigate("/goodbye");
          }} 
          backcolor = "rgba(80, 180, 80, 1)"
        />
        <ActionButton
          text="Log out"
          onClick={() => {
            auth.signOut();
            navigate("/signup");
          }}
          backcolor= "rgba(0,0,0,0)"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "90%",
          width: "100%",
          position: "relative",
          top: "3%"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            margin: "1rem",
          }}
        >
          <div
            id="PuzzleBox"
            style={{
              width: "100%",
              height: "90%",
              marginBottom: "1rem",
              borderRadius: "5px",
              background: 
                "linear-gradient(180deg, rgba(170,170,170,1) 0%, rgba(243,243,243,1) 100%)",
            }}
          >
          {/** HERE IS WHERE THE GAME DISPLAYING TAKES PLACE */}
       
          <ReactFlow 
            nodes={initialNodes}
            edges={initialEdges} 
            panOnDrag = {true} 
            edgeTypes={edgeTypes} 
            nodeTypes = {nodeTypes}
            fitView
            >
            <Controls/>
            <Background variant= {BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
          {/** the following div covers up the React Flow logo */}
          <div style = {{position: "relative", bottom: "20px", left: "96%", background: "rgba(243,243,243,1)", width: "50px", height: "20px"}}></div>






          </div>
          <div
            id="InstructionBox"
            style={{
              width: "100%",
              borderRadius: "5px",
              background: instructBoxColor,
              height: instructBoxSize,
              
            }}
          >
            <div
              id="InstructionText"
              style={{
                alignItems: "center",
                padding: "5px",
                height: "100%",
                width: "100%",
                textAlign: "left",
              }}
            >
              {collapseButton === "-" && (
                <div style = {{fontSize: "18px", position: "relative", width: "100%"}}>
                  <b>A company owner has two offices in this city. </b> Currently all of her employees are in the West Office. <br/>
                  However, she needs to move <b>as many employees as possible to the East Office within the next 10 minutes </b> for a conference.<br/> <br/>
                  Unfontunatly, the City Council has imposed some <b>strict traffic restrictions</b>, limiting the number of people the company is to allowed to send down any <br/> given road in the city within a 10 minute period. <br/><br/>
                  She has asked you for your help. You need to <b>suggest how many people she sends down each road, in order to get as many emploeyees  from the<br/> West to East Office as possible, without breaking the traffic restrictions.</b> <br/><br/>
                  When you think your suggestion gets as many people to the East Office as possible, press <i><b>Submit and Move On.</b></i>


                </div>
              )}
              {collapseButton === "+" && (
                <div style ={{fontSize: "35px", position: "relative", top: "15%", left: "5%", color: ""}}><i>Click [+] to view </i><b>Instructions</b> </div>
              )}
            </div>

          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0
            }}
          >
            <ActionButton 
              text={collapseButton}
              onClick={toggleCollapse} 
            />
          </div>

        </div>
        <div
          id="ControlsBox"
          style={{
            width: "20%",
            margin: "1rem",
            borderRadius: "5px",
            background:
              "linear-gradient(180deg, rgba(135,219,255,1) 0%, rgba(204,243,255,1) 100%)",
          }}
        >
          <div 
            id="ControlText"
            style={{
              alignItems: "center",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <text style = {{fontSize: "50px", padding: "30px", }}>Controls </text>
            <text style = {{textAlign: "center", fontSize: "20px", position: "relative", top: "40px"}}>
              <br/>
              <b>Traffic limits:</b> where a road displays "5/10", for example, this indicates that the road has a limit of 10 people, and you are currently sending 5 people down it. <br/><br/><br/>
              <b>To edit the number you are sending down a road: </b>click on the road, and then use the slider. <br/> <br/><br/>
              <b> To submit your suggestion: </b>Click <i>Submit and Move On.</i><br/> <br/><br/>
              Remember you <b>must</b> submit before the timer runs out.
            </text>
          </div>
          </div>
      </div>
    </MainWrapper>
  );
};

export default GamePage;
