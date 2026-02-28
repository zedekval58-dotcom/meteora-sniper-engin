// bot/logger.js
import chalk     from 'chalk';
import { supabase } from './supabase.js';

const ts = () => new Date().toISOString().replace('T', ' ').slice(0, 19);

const COLORS = {
  info   : chalk.cyan,
  warn   : chalk.yellow,
  error  : chalk.red,
  success: chalk.green,
};

function print(level, event, message, data) {
  const color = COLORS[level] ?? chalk.white;
  const tag   = color(`[${level.toUpperCase().padEnd(7)}]`);
  const ev    = chalk.bold(event.padEnd(22));
  const extra = data ? chalk.gray('  ' + JSON.stringify(data).slice(0, 100)) : '';
  console.log(`${chalk.gray(ts())} ${tag} ${ev} ${message}${extra}`);
}

async function saveToDb(level, event, message, data, pool_address) {
  try {
    await supabase.from('bot_logs').insert([{ level, event, message, pool_address, data: data ?? null, }]);
  } catch (_) { /* non-fatal — never crash the bot over a log write */ }
}

export const log = {
  info   : (event, msg, data, pool) => { print('info',    event, msg, data); saveToDb('info',    event, msg, data, pool); },
  warn   : (event, msg, data, pool) => { print('warn',    event, msg, data); saveToDb('warn',    event, msg, data, pool); },
  error  : (event, msg, data, pool) => { print('error',   event, msg, data); saveToDb('error',   event, msg, data, pool); },
  success: (event, msg, data, pool) => { print('success', event, msg, data); saveToDb('success', event, msg, data, pool); },
};