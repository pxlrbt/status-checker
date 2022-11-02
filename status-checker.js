#!/usr/bin/env node

'use strict';

const meow = require('meow');
const YAML = require('yaml')
const fs = require('fs')
const ora = require('ora')
const puppeteer = require('puppeteer');


async function main() {
    const cli = meow(
        `
        Usage
            $ status-checker [INPUT]

        Options
	        --only-failures, -f  Show only failures
        `, {
            flags: {
                onlyFailures: {
                    type: 'boolean',
                    alias: 'f',
                    default: false,
                }
            }
        },
    );

    if (cli.input.length < 1) {
        cli.showHelp();
        process.exit(0);
    }

    let start = +new Date();
    console.log(`Started: ${new Date().toLocaleTimeString()}\n`)

    let inputFile = cli.input[0];
    let sites = YAML.parse(fs.readFileSync(inputFile, 'utf8'));

    for (let site of sites) {
        const baseUrl = site
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '');

        const siteWithProtocol = `https://${baseUrl}`
        const spinner = ora(`${site}: Crawling`).start();

        spinner.text = `${site}: Checking ...`;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        try {
            let resp = await page.goto(siteWithProtocol);

            if (resp.status().toString().startsWith('2')) {
                if (cli.flags.onlyFailures) {
                    spinner.stop();
                    // spinner.clear();
                } else {
                    spinner.succeed(`${site}: is up (${resp.status()})`);
                }
            } else {
                spinner.fail(`${site}: is down (${resp.status()})`);
            }
        } catch (e) {
            spinner.fail(`${site}: Error while checking: ${e.message}`);
        }

        browser.close();
    }

    console.log(`\nFinished: ${new Date().toLocaleTimeString()} – Total: ${new Date(+new Date() - start).toISOString().substr(11, 8)}`)
}

main();
