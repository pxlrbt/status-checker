# Status Checker

Tool for checking uptime status of websites using puppeteer.

## Installation

```bash
git clone https://github.com/pxlrbt/status-checker.git
cd status-checker
npm install
```

## Usage
- Create a `sites.yml` with a list of all sites.
- Make the file executable `chmod +x status-checker.js`.
- Run `./status-checker.js sites.yml`.

### Options
- `-f`/`--only-failures`: Show only sites that don't return 2xx HTTP code

## Sites.yml
```yml
- domain-a.com
- domain-b.com
```
