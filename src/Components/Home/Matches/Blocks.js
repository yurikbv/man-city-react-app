import React, {Component} from 'react';
import Slide from 'react-reveal/Slide'

import { firebaseMatches } from "../../../firebase";
import { firebaseLooper } from "../../UI/misc";
import MatchesBlock from "../../UI/matches_block";

class Blocks extends Component {

  state = {
    matches:[]
  };

  componentDidMount() {
    firebaseMatches.limitToLast(6).once('value').then(snapshot => {
      const matches = firebaseLooper(snapshot, true);
      this.setState({matches})
    })
  }


  showMatches = (matches) => (
      matches && matches.map(match => (
          <Slide bottom key={match.id}>
            <div className="item">
              <div className="wrapper">
                <MatchesBlock match={match}/>
              </div>
            </div>
          </Slide>
      ))
  );

  render() {

    const {matches} = this.state;

    return (
        <div className="home_matches">
          {this.showMatches(matches)}
        </div>
    );
  }
}

export default Blocks;