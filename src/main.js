let app = new Vue({
  el: "#app",
  data: {
    newTimerInput: { h: null, m: null, s: null },
    timers: []
  },
  methods: {
    newTimer: function(time) {
      // Exit if maximum number of timers already exist.
      if (this.timers.length >= 3) return;

      let h = Number(time.h);
      let m = Number(time.m);
      let s = Number(time.s);

      // Exit if input is blank.
      if (!h && !m && !s) return;

      // Exit if input is not a number
      if (isNaN(h) || isNaN(m) || isNaN(s)) return;

      // Exit if any input values are less than zero.
      if (h < 0 || m < 0 || s < 0) return;

      // Convert user input to milliseconds.
      let ms = ((h * 60 + m) * 60 + s) * 1000;

      let newTimer = { ms, clock: this.formatClock(ms), interval: true };
      this.timers.push(newTimer);
      this.startTimer(newTimer);

      // Reset inputs to blank.
      this.newTimerInput = { h: null, s: null, m: null };
    },
    pauseResume: function(timer) {
      if (timer.interval) {
        // Pause timer.
        this.clearTimer(timer);
      } else {
        // Resume timer.
        if (timer.ms <= 0) return;
        this.startTimer(timer);
      }
    },
    startTimer: function(timer) {
      let frequency = 10;
      let vm = this;
      let interval = setInterval(function() {
        timer.ms -= frequency;
        timer.clock = vm.formatClock(timer.ms);
        if (timer.ms <= 0) {
          vm.clearTimer(timer);
          timer.ms = 0;
        }
      }, frequency);
      timer.interval = interval;
    },
    clearTimer: function(timer) {
      clearInterval(timer.interval);
      let update = { ...timer, interval: null };
      let index = this.timers.indexOf(timer);
      this.$set(this.timers, index, update);
      // Alternative to Vue instance method:
      // this.timers.splice(index, 1, update);
    },
    deleteTimer: function(timer) {
      clearInterval(timer.interval);
      let index = this.timers.indexOf(timer);
      this.$delete(this.timers, index);
      // Alternative to Vue instance method:
      // this.timers.splice(index, 1);
    },
    formatClock(ms) {
      let seconds = Math.ceil(ms / 1000);
      let h = Math.floor(seconds / 3600);
      let m = Math.floor((seconds - h * 3600) / 60);
      let s = seconds - (h * 3600 + m * 60);
      return { h, m, s };
    },
    pad(num) {
      return num < 10 ? `0${num}` : num;
    }
  },
  created: function() {
    this.newTimer({ h: 0, m: 5, s: 30 });
  }
});
