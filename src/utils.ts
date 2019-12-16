/**
 * Parse seconds to days, hours, minutes, seconds string
 * @param {(string | number)} seconds the time in seconds
 * @returns {string} the formatted time
 */
export const parseSeconds = (seconds: string | number): string => {
  seconds = parseInt(String(seconds), 10)
  const days = Math.floor(seconds / (3600 * 24))
  seconds -= days * 3600 * 24
  const hrs = Math.floor(seconds / 3600)
  seconds -= hrs * 3600
  const mnts = Math.floor(seconds / 60)
  seconds -= mnts * 60

  return `${days} days, ${hrs} hours, ${mnts} minutes, ${seconds} seconds`
}

export declare type LogFunction = (...args: any[]) => void;

/**
 * Set up logger
 * @param {boolean} verbose if the logger should be initialized in verbose mode
 * @returns {LogFunction} console.log
 */
export const logger = (verbose: boolean): LogFunction => (...args: any[]) =>
  verbose && console.log(...args)
