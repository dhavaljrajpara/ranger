/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.apache.ranger.usergroupsync;

import org.apache.hadoop.conf.Configuration;
import org.apache.ranger.plugin.util.RangerMetricsUtil;
import org.apache.ranger.unixusersync.config.UserGroupSyncConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;

public class UserSyncMetricsProducer implements Runnable {
    private static final Logger LOG = LoggerFactory.getLogger(UserSyncMetricsProducer.class);

    private boolean shutdownFlag;

    public static void main(String[] args) {
        UserSyncMetricsProducer userSyncMetrics = new UserSyncMetricsProducer();
        userSyncMetrics.run();
        /* TODO
         * try { userSyncMetrics.writeJVMMetrics(); } catch (Throwable e) {
         * Auto-generated catch block e.printStackTrace(); }
         */
    }

    @Override
    public void run() {
        try {
            UserGroupSyncConfig config                        = UserGroupSyncConfig.getInstance();
            long                sleepTimeBetweenCycleInMillis = config.getUserSyncMetricsFrequency();
            String              logFileNameWithPath           = config.getUserSyncMetricsFileName();

            LOG.info("User Sync metrics frequency :  {} and metrics file : {}", sleepTimeBetweenCycleInMillis, logFileNameWithPath);

            if (logFileNameWithPath != null) {
                while (!shutdownFlag) {
                    try {
                        LOG.debug("Sleeping metrics for {} milliSeconds", sleepTimeBetweenCycleInMillis);

                        Thread.sleep(sleepTimeBetweenCycleInMillis);
                    } catch (InterruptedException e) {
                        LOG.error("Failed to wait for [{}] milliseconds before attempting to fetch userSync metrics information", sleepTimeBetweenCycleInMillis, e);
                    }

                    try {
                        writeJVMMetrics(logFileNameWithPath);
                    } catch (Throwable t) {
                        LOG.error("Failed to write user sync metrics into file. Error details: ", t);
                    }
                }
            } else {
                LOG.info("No file directory found for usersync metrics log ");
            }
        } catch (Throwable t) {
            LOG.error("Failed to start user sync metrics. Error details: ", t);
        } finally {
            LOG.info("Shutting down the User Sync metrics producer thread");
        }
    }

    private void writeJVMMetrics(String logFileNameWithPath) throws Throwable {
        try {
            File                userMetricFile = new File(logFileNameWithPath);
            UserGroupSyncConfig userConfig     = UserGroupSyncConfig.getInstance();
            Configuration       config         = userConfig.getUserGroupConfig();

            if (!userMetricFile.exists()) {
                userMetricFile.createNewFile();
            }

            RangerMetricsUtil rangerMetricsUtil = new RangerMetricsUtil();

            if (config.getBoolean(UserGroupSyncConfig.UGSYNC_SERVER_HA_ENABLED_PARAM, false)) {
                if (UserGroupSyncConfig.isUgsyncServiceActive()) {
                    RangerMetricsUtil.setIsRoleActive(1);
                } else {
                    RangerMetricsUtil.setIsRoleActive(0);
                }
            }

            rangerMetricsUtil.writeMetricsToFile(userMetricFile);
        } catch (Throwable t) {
            LOG.error("UserSyncMetricsProducer.writeJVMMetrics() failed to write metrics into file. Error details: ", t);
            throw t;
        }
    }
}
