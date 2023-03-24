/**
 * Higher-order function for async/await error handling
 * @param {function} fn an async function
 * @returns {function}
 */
export const catchErrors = fn => {
  return function(...args) {
    return fn(...args).catch((err) => {
      console.error(err);
    })
  }
}

/**
 * Format milliseconds to time duration
 * @param {number} ms number of milliseconds
 * @returns {string} formatted duration string
 * @example 216699 -> '3:36'
 */
export const formatDuration = ms => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor(((ms % 60000) / 1000));
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

/**
 * Format datetime to time elapsed
 * @param {string} datetime format of: 2023-03-23T18:30:46.033Z
 * @returns {string} formatted time elapse: 7 hours ago
 */
export const formatDateTime = datetime => {
  const date = new Date(datetime);
  const timeElapsed =  Date.now() - date;
  const seconds = (timeElapsed / 1000).toFixed(1);
  const minutes = (timeElapsed / (1000 * 60)).toFixed(1);
  const hours = (timeElapsed / (1000 * 60 * 60)).toFixed(1);
  const days = (timeElapsed / (1000 * 60 * 60 * 24)).toFixed(1);
  if (seconds < 60) return Math.floor(seconds) + " sec ago";
  else if (minutes < 60) return Math.floor(minutes) + " min ago";
  else if (hours < 24) return Math.floor(hours) + " hr ago";
  else return Math.floor(days) + " day ago"
}