import React from 'react';
import Featured from "./Featured";
import MatchesHome from "./Matches";
import MeetPlayers from "./MeetPlayers";
import Promotion from "./promotion";

const Home = () => {
  return (
      <div className="bck_blue" style={{overflow: 'hidden'}}>
        <Featured/>
        <MatchesHome/>
        <MeetPlayers/>
        <Promotion/>
      </div>
  );
};

export default Home;