const api = require('../utils/api');
const Competition = require('../db/models/Competition');
const Team = require('../db/models/Team');
const Player = require('../db/models/Player');
const Coach = require('../db/models/Coach');

module.exports = {
  Query: {
    players: async (_root, { leagueCode, teamName }) => {
      const competition = await Competition.findOne({ code: leagueCode });
      if (!competition) {
        throw new Error('Competition not found');
      }
      const teams = await Team.find({ competitions: competition.externalId });

      const query = { team: { $in: teams.map((team) => team.externalId) } };
      if (teamName) {
        query.teamName = { $regex: new RegExp(teamName, 'i') };
      }
      const players = await Player.find(query);
      if (players.length === 0) {
        const coaches = await Coach.find(query);
        return {
          coaches,
        };
      }
      return {
        players,
      };
    },

    team: async (_root, { name, displayMembers }) => {
      const team = await Team.findOne({ name: { $regex: new RegExp(name, 'i') } });
      if (!team) {
        throw new Error('Team not found');
      }
      const result = {
        team,
      };
      if (displayMembers) {
        const players = await Player.find({ team: team.externalId });
        if (players.length === 0) {
          const coaches = await Coach.find({ team: team.externalId });
          result.coaches = coaches;
        } else {
          result.players = players;
        }
      }
      return result;
    },
  },
  Mutation: {
    importLeague: async (_root, { leagueCode }) => {
      try {
        const [competitionResponse, teamResponse] = await Promise.all([
          api.get(`/competitions/${leagueCode}`),
          api.get(`/competitions/${leagueCode}/teams`),
        ]);

        const newCompetition = {
          externalId: competitionResponse.data.id,
          name: competitionResponse.data.name,
          code: competitionResponse.data.code,
          areaName: competitionResponse.data.area.name,
        };

        const competition = await Competition.findOneAndUpdate(
          {
            externalId: competitionResponse.data.id,
          },
          newCompetition,
          {
            upsert: true,
            new: true,
          },
        );
        const players = [];
        const coaches = [];
        const teams = [];

        teamResponse.data.teams.forEach((team) => {
          const newTeam = {
            updateOne: {
              filter: {
                externalId: team.id,
              },
              update: {
                $addToSet: { competitions: competition.externalId },
                $set: {
                  externalId: team.id,
                  name: team.name,
                  tla: team.tla,
                  shortName: team.shortName,
                  areaName: team.area.name,
                  address: team.address,
                },
              },
              upsert: true,
            },
          };

          if (team.squad?.length === 0) {
            const newCoach = {
              updateOne: {
                filter: {
                  team: team.id,
                },
                update: {
                  $set: {
                    name: team.coach?.name,
                    dateOfBirth: team.coach?.dateOfBirth,
                    nationality: team.coach?.nationality,
                    team: team.id,
                    teamName: team.name,
                  },
                },
                upsert: true,
              },
            };
            coaches.push(newCoach);
          }

          if (team.squad?.length > 0) {
            team.squad.forEach((player) => {
              const newPlayer = {
                updateOne: {
                  filter: {
                    externalId: player.id,
                  },
                  update: {
                    $set: {
                      name: player.name,
                      position: player.position,
                      dateOfBirth: player.dateOfBirth,
                      nationality: player.nationality,
                      externalId: player.id,
                      team: team.id,
                      teamName: team.name,
                    },
                  },
                  upsert: true,
                },
              };

              players.push(newPlayer);
            });
          }

          teams.push(newTeam);
        });

        await Team.bulkWrite(teams);
        await Player.bulkWrite(players);
        await Coach.bulkWrite(coaches);

        return {
          id: competition._id,
          name: competition.name,
          code: leagueCode,
          areaName: competition.areaName,
        };
      } catch (error) {
        throw new Error('Something went wrong');
      }
    },
  },
};
