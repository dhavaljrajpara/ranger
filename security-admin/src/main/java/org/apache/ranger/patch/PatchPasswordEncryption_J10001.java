/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.apache.ranger.patch;

import org.apache.ranger.common.StringUtil;
import org.apache.ranger.db.RangerDaoManager;
import org.apache.ranger.entity.XXAsset;
import org.apache.ranger.service.XAssetService;
import org.apache.ranger.util.CLIUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PatchPasswordEncryption_J10001 extends BaseLoader {
    private static final Logger logger = LoggerFactory.getLogger(PatchPasswordEncryption_J10001.class);

    int lineCount;

    @Autowired
    RangerDaoManager xaDaoManager;

    @Autowired
    StringUtil stringUtil;

    @Autowired
    XAssetService xAssetService;

    public PatchPasswordEncryption_J10001() {
    }

    public static void main(String[] args) {
        logger.info("main()");

        try {
            PatchPasswordEncryption_J10001 loader = (PatchPasswordEncryption_J10001) CLIUtil.getBean(PatchPasswordEncryption_J10001.class);

            //loader.init();
            while (loader.isMoreToProcess()) {
                loader.load();
            }

            logger.info("Load complete. Exiting!!!");

            System.exit(0);
        } catch (Exception e) {
            logger.error("Error loading", e);

            System.exit(1);
        }
    }

    @Override
    public void printStats() {
        logger.info("Time taken so far:{}, moreToProcess={}", timeTakenSoFar(lineCount), isMoreToProcess());

        print(lineCount, "Processed lines");
    }

    @Override
    public void execLoad() {
        encryptLookupUserPassword();
    }

    private void encryptLookupUserPassword() {
        List<XXAsset> xAssetList = xaDaoManager.getXXAsset().getAll();
        String        oldConfig;
        String        newConfig;

        for (XXAsset xAsset : xAssetList) {
            oldConfig = xAsset.getConfig();
            newConfig = null;

            if (!stringUtil.isEmpty(oldConfig)) {
                newConfig = xAssetService.getConfigWithEncryptedPassword(oldConfig, false);

                xAsset.setConfig(newConfig);

                xaDaoManager.getXXAsset().update(xAsset);
            }

            lineCount++;

            logger.info("Lookup Password updated for Asset : {}", xAsset.getName());
            logger.info("oldconfig : {}", oldConfig);
            logger.info("newConfig : {}", newConfig);

            print(lineCount, "Total updated assets count : ");
        }
    }
}
