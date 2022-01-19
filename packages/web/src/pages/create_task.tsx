import { NextPage } from "next/types";
import { ChangeEvent, useEffect, } from 'react';
import { useImmerAtom } from 'jotai/immer';
import { creatingTaskDetailAtom } from '../atoms';
import { CronTime } from '@webest/web-page-monitor-helper';

const CreateTaskPage: NextPage = () => {

  const [taskDetail, setTaskDetail] = useImmerAtom(creatingTaskDetailAtom);


  // update input date when first entry
  function updateDate() {
    setTaskDetail(v => {
      let nowDate = new Date();
      v.endLocalMinuteString = CronTime.toLocalISOString(nowDate, 6);
    })
  }

  function handleInputChange(ev: ChangeEvent<HTMLInputElement>) {
    let inputElement = ev.target;
    let index = ev.target.dataset.inputIndex;
    if (index === '0') {
      setTaskDetail(v => {
        v.cronSyntax = inputElement.value;
      })
      let nextArr = CronTime.getNextTimes(inputElement.value);
      let [passed, errorMsg] = CronTime.checkTimes(nextArr);
      console.log(nextArr, passed, errorMsg)
      if (passed) {
        setTaskDetail(v => {
          v.cronMsg = 'cron syntax check passed. ';
        })
      } else {
        setTaskDetail(v => {
          v.cronMsg = Array(errorMsg).join(' ');
        })
      }
    }
    if (index === '1') {
      if (!inputElement.validity.valid) return;
      const dtISO = CronTime.toLocalISOString(new Date(inputElement.value));
      setTaskDetail(v => {
        v.endLocalMinuteString = dtISO;
      })
    }
  }
  useEffect(() => {
    // https://stackoverflow.com/questions/53090432/
    // react-hooks-right-way-to-clear-timeouts-and-intervals
    updateDate();
    // let intervalId = setInterval(updateDate, 60*1000);
    // return ()=>{
    //   clearInterval(intervalId)
    // };
  }, []);

  return (<>
    <div>input cron syntax <br />{taskDetail.cronMsg}<br/>
      <input
        placeholder="cron syntax"
        data-input-index="0"
        value={taskDetail.cronSyntax}
        onChange={handleInputChange}
      >

      </input>
    </div>
    <div>continue loops,  until<br />
      <input
        placeholder="choose a time"
        value={taskDetail.endLocalMinuteString}
        data-input-index="1"
        onChange={handleInputChange}
        type="datetime-local"
        min={taskDetail.endLocalMinuteString}
      >
      </input>
    </div>
  </>);
}

export default CreateTaskPage