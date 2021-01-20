import {
  Cinema,
  Seat,
  Transaction,
  ShowTime,
  Movie,
  // GroupCinema,
} from 'database/models';
import { Op } from 'sequelize';
import moment from 'moment';

const cinemaService = {};

cinemaService.getAll = async () => {
  return await Cinema.findAll();
};

cinemaService.getOneByShowTimeId = async (showTimeId) => {
  const showTime = await ShowTime.findOne({
    where: {
      id: showTimeId,
    },
  });

  return await Cinema.findOne({
    where: {
      id: showTime.cinemaId,
    },
    include: [
      {
        model: Seat,
        as: 'seat',
        include: [{ model: Transaction, as: 'transaction' }],
      },
    ],
  });
};

cinemaService.getCinemaOfGroupByTimeNMovie = async (data) => {
  const { movieId, startTime, idGroup } = data;
  const tempDate = startTime || Date();
  const timeGet = moment(tempDate).format('YYYY-MM-DD');
  const timeStart = moment(`${timeGet} 00:00:00`);
  const timeEnd = moment(`${timeGet} 23:59:59`);

  const cinemas = await Movie.findAll({
    where: {
      id: movieId,
    },
    include: [
      {
        model: Cinema,
        as: 'cinemas',
        where: {
          idGroup,
        },
        include: [
          {
            model: ShowTime,
            as: 'showTime',
            where: {
              startTime: {
                [Op.between]: [timeStart, timeEnd],
              },
            },
          },
        ],
      },
    ],
  });

  return cinemas;
};

export default cinemaService;
