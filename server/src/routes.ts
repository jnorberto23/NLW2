import express from 'express';
import db from './database/connection';
import convertHourToMinutes from './utils/convertHourToMinutes';

const routes = express.Router();

interface ScheduleItem {
  week_day: number,
  from: string,
  to: string
}

routes.post('/classes', async (request, response ) =>{
  const {
    name,
    avatar,
    whatsapp,
    bio,
    subject,
    cost,
    schedule
  } = request.body;

  const trx = await db.transaction();

  try {
    const insertedUsersId = await trx('users').insert({
      name,
      avatar, 
      whatsapp,
      bio
    });
  
    const user_id = insertedUsersId[0];
  
    const insertedClassesId = await trx('classes').insert({
      subject,
      cost, 
      user_id
    });
  
    const class_id = insertedClassesId[0];
    const class_schedule = schedule.map((scheduleItem: ScheduleItem) =>{
      return ({
        class_id,
        week_day: scheduleItem.week_day,
        from: convertHourToMinutes(scheduleItem.from),
        to: convertHourToMinutes(scheduleItem.to)
      });
    })
  
    await trx('class_schedule').insert(class_schedule);
    
    await trx.commit();
  
    return response.status(201).send();

  } catch (err){
    await trx.rollback();
    return response.status(400).json({ 
      error: 'Unexpected error while creating new class'
    });
  }
});

export default routes;