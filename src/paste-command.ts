import { config } from './config.js'

export const pasteCommand = (content: string, executeImmediately = false) => {
  return `tell application "${config.terminalApp}"
    tell application "System Events"
      keystroke "${content}"
      ${executeImmediately ? 'keystroke return' : ''}
    end tell
  end tell
`;
};
