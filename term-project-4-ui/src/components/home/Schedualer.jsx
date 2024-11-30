import React from 'react';
import '../../App.css';
import { Inject, ScheduleComponent, Day, Week, Month } from '@syncfusion/ej2-react-schedule';

export default function Schedualer() {
  return (
    <div className='mt-8'>
        <ScheduleComponent>
            <Inject services={[Day, Week, Month]}/>
        </ScheduleComponent>
    </div>
  )
}
