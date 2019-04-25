import React, {Component} from 'react';
import Fade from 'react-reveal/Fade';

import { firebasePlayers, firebase} from "../../firebase";
import Stripes from '../../Resources/images/stripes.png';
import { Promise } from "core-js";
import {firebaseLooper} from "../UI/misc";
import PlayerCard from "../UI/playerCard";

class TheTeam extends Component {

  state = {
    loading: true,
    players: []
  };

  componentDidMount() {
    firebasePlayers.once('value').then(snapshot => {
      const players = firebaseLooper(snapshot);
      let promises = [];
      for(let key in players){
        promises = [...promises ,new Promise((resolve) => {
          firebase.storage().ref('players').child(players[key].image).getDownloadURL()
              .then(url => {
                players[key].url = url;
                resolve();
              })
        })]
      }

      Promise.all(promises).then(() => {
        this.setState({
          players,
          loading: false
        })
      })

    })
  }

  showPlayersByCategory = (category) => (
      this.state.players &&
          this.state.players.map((player,i) => {
            return player.position === category &&
                <Fade left key={i} delay={i*20}>
                  <div className="item">
                    <PlayerCard
                      number={player.number}
                      name={player.name}
                      lastname={player.lastname}
                      bck={player.url}
                    />
                  </div>
                </Fade>
          })
  );

  render() {

    const {loading} = this.state;

    return (
        <div className="the_team_container"
          style={{background: `url(${Stripes})`}}
        >
          {!loading &&
            <div>
              <div className="team_category_wrapper">
                <div className="title">Keepers</div>
                <div className="team_cards">
                  {this.showPlayersByCategory('Keeper')}
                </div>
              </div>

              <div className="team_category_wrapper">
                <div className="title">Defence</div>
                <div className="team_cards">
                  {this.showPlayersByCategory('Defence')}
                </div>
              </div>

              <div className="team_category_wrapper">
                <div className="title">Midfield</div>
                <div className="team_cards">
                  {this.showPlayersByCategory('Midfield')}
                </div>
              </div>

              <div className="team_category_wrapper">
                <div className="title">Strikers</div>
                <div className="team_cards">
                  {this.showPlayersByCategory('Striker')}
                </div>
              </div>
            </div>
          }
        </div>
    );
  }
}

export default TheTeam;