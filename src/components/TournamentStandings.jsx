import React, { useState } from 'react';
import { Lock, UnlockKeyhole } from 'lucide-react';

const ADMIN_PASSWORD = "phi2024";

const initialTeams = {
  red: {
    name: "Team Red",
    players: ["Bruno", "Trevor", "JoJo", "Grant", "Mike", "Sam", "Alex", "Tom"],
    points: 0
  },
  blue: {
    name: "Team Blue", 
    players: ["Gaston", "Brett", "Chris", "Pat", "Ryan", "Joe", "Matt", "Dan"],
    points: 0
  }
};

const initialMatches = {
  fridayFourBall: [],
  saturdayFourBall: [],
  saturdayAlternateShot: [],
  sundaySingles: []
};

const formatLabels = {
  fridayFourBall: "Friday Four-Ball",
  saturdayFourBall: "Saturday Four-Ball",
  saturdayAlternateShot: "Saturday Alternate Shot", 
  sundaySingles: "Sunday Singles"
};

const TournamentStandings = () => {
  const [teams, setTeams] = useState(initialTeams);
  const [matches, setMatches] = useState(initialMatches);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [activeRound, setActiveRound] = useState("fridayFourBall");
  const [newMatch, setNewMatch] = useState({
    team1Players: ["", ""],
    team2Players: ["", ""],
    result: null,
    description: ""
  });

  // Modified to only check existing matches, not current selection
  const isPlayerAlreadyPlaying = (player, format) => {
    return matches[format].some(match => 
      match.team1Players.includes(player) || 
      match.team2Players.includes(player)
    );
  };

  // Separate function to check if player is selected in current form
  const isPlayerSelectedInForm = (player) => {
    return newMatch.team1Players.includes(player) || 
           newMatch.team2Players.includes(player);
  };

  const calculateFormatPoints = (format) => {
    let red = 0;
    let blue = 0;
    matches[format].forEach(match => {
      if (match.result === 1) red += 1;
      else if (match.result === 0) blue += 1;
      else if (match.result === 0.5) {
        red += 0.5;
        blue += 0.5;
      }
    });
    return { red, blue };
  };

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
    } else {
      alert("Incorrect password");
    }
  };

  const handleMatchSubmit = () => {
    const updatedMatches = {
      ...matches,
      [activeRound]: [
        ...matches[activeRound],
        {
          ...newMatch,
          id: Date.now()
        }
      ]
    };
    setMatches(updatedMatches);
    updatePoints(updatedMatches);
    setNewMatch({
      team1Players: ["", ""],
      team2Players: ["", ""],
      result: null,
      description: ""
    });
  };

  const updatePoints = (matchData) => {
    let redPoints = 0;
    let bluePoints = 0;

    Object.values(matchData).flat().forEach(match => {
      if (match.result === 1) redPoints += 1;
      else if (match.result === 0) bluePoints += 1;
      else if (match.result === 0.5) {
        redPoints += 0.5;
        bluePoints += 0.5;
      }
    });

    setTeams({
      ...teams,
      red: { ...teams.red, points: redPoints },
      blue: { ...teams.blue, points: bluePoints }
    });
  };

  const renderMatch = (match) => {
    const resultStyle = match.result === 1 ? 'text-red-600' : match.result === 0 ? 'text-blue-600' : 'text-gray-600';
    const result = match.result === 1 ? 'RED WINS' : 
                  match.result === 0 ? 'BLUE WINS' : 'TIED';
    
    return (
      <div className="py-2 border-b border-gray-200">
        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
          <div className="text-right font-medium">
            {match.team1Players.join(" & ")}
          </div>
          <div className={`px-3 py-1 rounded ${resultStyle} text-sm font-bold`}>
            {result}
          </div>
          <div className="text-left font-medium">
            {match.team2Players.join(" & ")}
          </div>
        </div>
        {match.description && (
          <div className="text-center text-sm text-gray-500 mt-1">
            {match.description}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Main Score Display */}
      <div className="bg-white rounded-lg shadow-lg mb-8">
        <div className="p-6 text-center border-b border-gray-200">
          <div className="text-3xl font-bold mb-4">Phi Ryder Cup 2024</div>
          <div className="flex justify-center items-center gap-8">
            <div className="text-4xl font-bold text-red-600">
              {teams.red.points}
            </div>
            <div className="text-xl font-bold text-gray-400">VS</div>
            <div className="text-4xl font-bold text-blue-600">
              {teams.blue.points}
            </div>
          </div>
        </div>
        
        {/* Format-specific scores */}
        <div className="grid grid-cols-1 gap-4 p-4">
        {Object.keys(matches).map(format => {
            const points = calculateFormatPoints(format);
            return (
              <div key={format} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">{formatLabels[format]}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-red-600 font-bold">{points.red}</span>
                  <span className="text-gray-400">-</span>
                  <span className="text-blue-600 font-bold">{points.blue}</span>
                </div>
                <div className="mt-2 space-y-2">
                  {matches[format].map((match, idx) => renderMatch(match))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin Section */}
      {!isAdmin ? (
        <div className="flex gap-2 mt-4">
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 max-w-xs p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button 
            onClick={handlePasswordSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Lock className="w-4 h-4" />
            Admin Login
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg mt-4">
    <div className="p-4 border-b">
      <h2 className="text-xl font-bold flex items-center">
        <UnlockKeyhole className="w-5 h-5 mr-2" />
        Admin Controls
      </h2>
    </div>
    <div className="p-4">
            <div className="space-y-4">
              <select 
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={activeRound}
                onChange={(e) => setActiveRound(e.target.value)}
              >
                {Object.entries(formatLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Team Red Players</h4>
                  <select 
                    className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newMatch.team1Players[0]}
                    onChange={(e) => setNewMatch({
                      ...newMatch,
                      team1Players: [e.target.value, newMatch.team1Players[1]]
                    })}
                  >
                    <option value="">Select Player 1</option>
                    {teams.red.players.map(player => (
                      <option 
                        key={player} 
                        value={player}
                        disabled={isPlayerAlreadyPlaying(player, activeRound) && !isPlayerSelectedInForm(player)}
                      >
                        {player} {isPlayerAlreadyPlaying(player, activeRound) && !isPlayerSelectedInForm(player) ? '(Already playing)' : ''}
                      </option>
                    ))}
                  </select>
                  {activeRound !== "sundaySingles" && (
                    <select 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={newMatch.team1Players[1]}
                      onChange={(e) => setNewMatch({
                        ...newMatch,
                        team1Players: [newMatch.team1Players[0], e.target.value]
                      })}
                    >
                      <option value="">Select Player 2</option>
                      {teams.red.players.map(player => (
                        <option 
                          key={player} 
                          value={player}
                          disabled={isPlayerAlreadyPlaying(player, activeRound) && !isPlayerSelectedInForm(player)}
                        >
                          {player} {isPlayerAlreadyPlaying(player, activeRound) && !isPlayerSelectedInForm(player) ? '(Already playing)' : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Team Blue Players</h4>
                  <select 
                    className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newMatch.team2Players[0]}
                    onChange={(e) => setNewMatch({
                      ...newMatch,
                      team2Players: [e.target.value, newMatch.team2Players[1]]
                    })}
                  >
                    <option value="">Select Player 1</option>
                    {teams.blue.players.map(player => (
                      <option 
                        key={player} 
                        value={player}
                        disabled={isPlayerAlreadyPlaying(player, activeRound) && !isPlayerSelectedInForm(player)}
                      >
                        {player} {isPlayerAlreadyPlaying(player, activeRound) && !isPlayerSelectedInForm(player) ? '(Already playing)' : ''}
                      </option>
                    ))}
                  </select>
                  {activeRound !== "sundaySingles" && (
                    <select 
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={newMatch.team2Players[1]}
                      onChange={(e) => setNewMatch({
                        ...newMatch,
                        team2Players: [newMatch.team2Players[0], e.target.value]
                      })}
                    >
                      <option value="">Select Player 2</option>
                      {teams.blue.players.map(player => (
                        <option 
                          key={player} 
                          value={player}
                          disabled={isPlayerAlreadyPlaying(player, activeRound) && !isPlayerSelectedInForm(player)}
                        >
                          {player} {isPlayerAlreadyPlaying(player, activeRound) && !isPlayerSelectedInForm(player) ? '(Already playing)' : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

        <div>
          <h4 className="font-medium mb-2">Match Result</h4>
          <div className="flex gap-2">
            <button 
              onClick={() => setNewMatch({ ...newMatch, result: 1 })}
              className={`px-4 py-2 rounded transition-colors ${
                newMatch.result === 1 
                  ? 'bg-red-600 text-white' 
                  : 'border border-red-600 text-red-600 hover:bg-red-50'
              }`}
            >
              Red Wins
            </button>
            <button 
              onClick={() => setNewMatch({ ...newMatch, result: 0.5 })}
              className={`px-4 py-2 rounded transition-colors ${
                newMatch.result === 0.5 
                  ? 'bg-gray-600 text-white' 
                  : 'border border-gray-600 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Halved
            </button>
            <button 
              onClick={() => setNewMatch({ ...newMatch, result: 0 })}
              className={`px-4 py-2 rounded transition-colors ${
                newMatch.result === 0 
                  ? 'bg-blue-600 text-white' 
                  : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            >
              Blue Wins
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Match Description</h4>
          <input
            type="text"
            placeholder="e.g., Red wins 5&4 after great putt on 14"
            value={newMatch.description}
            onChange={(e) => setNewMatch({ ...newMatch, description: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button 
          onClick={handleMatchSubmit}
          disabled={!newMatch.team1Players[0] || !newMatch.team2Players[0] || newMatch.result === null}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Submit Match
          </button>
      </div>
    </div>
  </div>
)}    
    </div>  
  );  
};  

export default TournamentStandings;
