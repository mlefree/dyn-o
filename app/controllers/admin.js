const axios = require('axios');
const config = require('../config');
const { logger } = require('../factories/logger');
const { AbstractController } = require('./abstract');
const fs = require('node:fs');
const dig = require('node-dig-dns');

class AdminController extends AbstractController {

  static async apiCheckDNS (req, res) {
    try {
      const done = await AdminController.checkIps();
      return res.status(200).jsonp({ done });
    } catch (e) {
      logger.error(e);
    }

    return res.status(500).send();
  }

  static async apiCheckAndUpdateDNS (req, res) {
    try {
      const done = await AdminController.checkAndUpdateIps();
      if (done.all) {
        return res.status(201).jsonp({ done });
      }

      if (done.ok) {
        return res.status(200).jsonp({ done });
      }

    } catch (e) {
      logger.error(e);
    }

    return res.status(500).send();
  }

  static async checkIps () {

    const done = {
      ok: true,
      domains: 0
    };
    const currentIp = await AdminController.fetchCurrentIp();
    if (!currentIp) {
      done.ok = false;
      return done;
    }

    logger.info(`Starting DynHost updates check with IP: ${currentIp}`);

    try {
      const data = fs.readFileSync(config.deploy.confFile, 'utf8');
      const configFile = JSON.parse(data);
      done.domains = configFile.domains.length;
      for (const domainConfig of configFile.domains) {
        const { domain, username, password } = domainConfig;
        const ovhIp = await AdminController.getOvhCurrentIp(domain, username, password);
        if (ovhIp !== currentIp) {
          done.ok = false;
        }
      }
    } catch (parseError) {
      logger.error('Error parsing config.json:', parseError);
      done.ok = false;
    }

    return done;
  }

  static async checkAndUpdateIps () {

    const done = {
      ok: true,
      all: true
    };
    const currentIp = await AdminController.fetchCurrentIp();
    if (!currentIp) {
      done.ok = false;
      done.all = false;
      return done;
    }

    logger.info(`Starting DynHost updates check with IP: ${currentIp}`);

    try {
      const data = fs.readFileSync(config.deploy.confFile, 'utf8');
      const configFile = JSON.parse(data);
      done.domains = configFile.domains.length;
      for (const domainConfig of configFile.domains) {
        const { domain, username, password } = domainConfig;

        const ovhIp = await AdminController.getOvhCurrentIp(domain, username, password);
        if (ovhIp === currentIp) {
          done.all = false;
          continue;
        }

        const ok = await AdminController.updateDynHostConfig(domain, currentIp, username, password);
        if (!ok) {
          done.ok = false;
          done.all = false;
        }
      }
    } catch (parseError) {
      logger.error('Error parsing config.json:', parseError);
      done.ok = false;
      done.all = false;
    }

    return done;
  }

  static async fetchCurrentIp () {
    try {
      const response = await axios.get('https://api4.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      logger.error('Failed to fetch IP address:', error);
      return null;
    }
  }

  static async getOvhCurrentIp (domain, username, password) {
    try {
      return await dig([config.deploy.dnsToDig, '+short', domain, 'A']);
    } catch (error) {
      logger.error(`Failed to fetch IP for ${domain}:`, error.message);
      return null;
    }
  }

  static async updateDynHostConfig (domain, ip, username, password) {
    try {
      const url = `https://www.ovh.com/nic/update?system=dyndns&hostname=${domain}&myip=${ip}`;
      const auth = Buffer.from(`${username}:${password}`).toString('base64');
      await axios.get(url, {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });
      logger.info(`DynHost configuration updated successfully - Domain: ${domain}, IP changed to ${ip}`);
      return true;
    } catch (error) {
      logger.error(`Failed to update DynHost configuration - Domain: ${domain}, IP: ${ip}, Error:`, error.message);
      return false;
    }
  }

}

module.exports = { AdminController };
