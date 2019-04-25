import React, {Component} from 'react';
import { Link } from "react-router-dom";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import {firebasePlayers} from "../../../firebase";
import AdminLayout from "../../../Hoc/AdminLayout";
import {firebaseLooper} from "../../UI/misc";

class AdminPlayers extends Component {

  state = {
    isLoading: true,
    players: []
  };

  componentDidMount() {
    firebasePlayers.once('value').then(snapshot => {
      const players = firebaseLooper(snapshot, true);
      this.setState({
        isLoading: false,
        players
      });
    })
  }

  render() {

    const {isLoading, players} = this.state;

    return (
        <AdminLayout>
          <div>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>First name</TableCell>
                    <TableCell>Last name</TableCell>
                    <TableCell>Number</TableCell>
                    <TableCell>Position</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {players && players.map((player,i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Link to={`/admin_players/edit_player/${player.id}`} style={{color: 'darkblue'}}>
                            {player.name}
                          </Link>
                        </TableCell>

                        <TableCell>
                          <Link to={`/admin_players/edit_player/${player.id}`} style={{color: 'darkblue'}}>
                            {player.lastname}
                          </Link>
                        </TableCell>

                        <TableCell>
                          {player.number}
                        </TableCell>

                        <TableCell>
                          {player.position}
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            <div className="admin_progress">
              {isLoading && <CircularProgress thickness={7} style={{color: '#98c5e9'}} size={50}/>}
            </div>
          </div>
        </AdminLayout>
    );
  }
}

export default AdminPlayers;