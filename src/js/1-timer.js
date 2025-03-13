import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
const datatime= document.querySelector("#datetime-picker")
const bth= document.querySelector("[data-start]")
const days= document.querySelector("[data-days]")
const hours= document.querySelector("[data-hours]")
const minutes= document.querySelector("[data-minutes]")
const seconds= document.querySelector("[data-seconds]")
let userSelectedDate=null;
let timerId = 0;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {

    userSelectedDate = selectedDates[0];
    if (userSelectedDate < new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future"
      });
      bth.disabled= true;
    }
    else {
      bth.disabled= false;

    }

  },
};
flatpickr(datatime, options);

bth.addEventListener("click",()=>
{
  bth.disabled= true;
  datatime.disabled= true;
  startCountdown();
})

function startCountdown() {
  timerId = setInterval(() => {
    const currentTime = new Date();
    const remainingTime = userSelectedDate - currentTime;

    if (remainingTime <= 0) {
      clearInterval(timerId);
      updateTimerDisplay(0, 0, 0, 0);
      datatime.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(remainingTime);
    updateTimerDisplay(days, hours, minutes, seconds);
  }, 1000);
}


function convertMs(ms) {
  // Number of milliseconds per unit of time

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2} // {days: 0, hours: 6 minutes: 42, seconds: 20}
function updateTimerDisplay(days, hours, minutes, seconds) {
  document.querySelector("[data-days]").textContent = addLeadingZero(days);
  document.querySelector("[data-hours]").textContent = addLeadingZero(hours);
  document.querySelector("[data-minutes]").textContent = addLeadingZero(minutes);
  document.querySelector("[data-seconds]").textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}