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

package org.apache.ranger.plugin.contextenricher;

import org.apache.commons.lang.StringUtils;
import org.apache.ranger.plugin.policyengine.RangerAccessRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.Properties;

/**
 * This is a sample implementation of a Context Enricher.  It works in conjunction with a sample Condition Evaluator
 * <code>RangerSampleSimpleMatcher</code>. It This is how it would be used in service definition:
 * {
 * ... service def
 * ...
 * "contextEnrichers": [
 * {
 * "itemId": 1, "name": "country-provider",
 * "enricher": "org.apache.ranger.plugin.contextenricher.RangerSampleCountryProvider",
 * "enricherOptions": { "contextName" : "COUNTRY", "dataFile":"/etc/ranger/data/userCountry.txt"}
 * }
 * ...
 * }
 * <p>
 * contextName: is used to specify the name under which the enricher would push value into context.
 * For purposes of this example the default value of this parameter, if unspecified is COUNTRY.  This default
 * can be seen specified in <code>init()</code>.
 * dataFile: is the file which contains the lookup data that this particular enricher would use to
 * ascertain which value to insert into the context.  For purposes of this example the default value of
 * this parameter, if unspecified is /etc/ranger/data/userCountry.txt.  This default can be seen specified
 * in <code>init()</code>.  Format of lookup data is in the form of standard java properties list.
 *
 * @see <a href="http://docs.oracle.com/javase/6/docs/api/java/util/Properties.html#load(java.io.Reader)">Java Properties List</a>
 * <p>
 * This Context Enricher is almost identical to another sample enricher <code>RangerSampleProjectProvider</code>.
 */
public class RangerSampleCountryProvider extends RangerAbstractContextEnricher {
    private static final Logger LOG = LoggerFactory.getLogger(RangerSampleCountryProvider.class);

    private String     contextName    = "COUNTRY";
    private Properties userCountryMap;

    @Override
    public void init() {
        LOG.debug("==> RangerSampleCountryProvider.init({})", enricherDef);

        super.init();

        contextName = getOption("contextName", "COUNTRY");

        String dataFile = getOption("dataFile", "/etc/ranger/data/userCountry.txt");

        userCountryMap = readProperties(dataFile);

        LOG.debug("<== RangerSampleCountryProvider.init({})", enricherDef);
    }

    @Override
    public void enrich(RangerAccessRequest request) {
        LOG.debug("==> RangerSampleCountryProvider.enrich({})", request);

        if (request != null && userCountryMap != null) {
            Map<String, Object> context = request.getContext();
            String              country = userCountryMap.getProperty(request.getUser());

            if (context != null && !StringUtils.isEmpty(country)) {
                request.getContext().put(contextName, country);
            } else {
                LOG.debug("RangerSampleCountryProvider.enrich(): skipping due to unavailable context or country. context={}; country={}", context, country);
            }
        }

        LOG.debug("<== RangerSampleCountryProvider.enrich({})", request);
    }
}
