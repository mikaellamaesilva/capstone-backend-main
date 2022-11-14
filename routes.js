const express = require('express');
const router = express.Router();

const authRoutes = require('~/routes/auth/auth.route');
const adminsRoutes = require('~/routes/admins/admins.route');
const announcementsRoutes = require('~/routes/announcements/announcements.route');
const calendarActivitiesRoutes = require('~/routes/calendar-activities/calendar-activities.route');
const faqsRoutes = require('~/routes/faqs/faqs.route');
const hostsRoutes = require('~/routes/hosts/hosts.route');
const pendingHostsRoutes = require('~/routes/pending-hosts/pending-hosts.route');
const performancesRoutes = require('~/routes/performances/performances.route');
const reportsRoutes = require('~/routes/reports/reports.route');
const auditsRoutes = require('~/routes/audits/audits.route');

module.exports = (app) => {
  authRoutes(router);
  adminsRoutes(router);
  announcementsRoutes(router);
  calendarActivitiesRoutes(router);
  faqsRoutes(router);
  hostsRoutes(router);
  pendingHostsRoutes(router);
  performancesRoutes(router);
  reportsRoutes(router);
  auditsRoutes(router);
  app.use('/api', router);
};