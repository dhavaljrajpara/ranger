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

package org.apache.ranger.audit.utils;

import org.apache.orc.Writer;
import org.apache.ranger.audit.model.AuthzAuditEvent;
import org.apache.ranger.audit.provider.MiscUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.security.PrivilegedExceptionAction;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import java.util.Properties;

/**
 * This class writes the Ranger audits to HDFS as ORC files
 * Refer README.TXT for enabling ORCWriter.
 */
public class RangerORCAuditWriter extends AbstractRangerAuditWriter {
    private static final Logger logger = LoggerFactory.getLogger(RangerORCAuditWriter.class);

    protected static final String ORC_FILE_EXTENSION = ".orc";

    protected volatile ORCFileUtil orcFileUtil;

    protected Writer orcLogWriter;
    protected String fileType           = "orc";
    protected String compression;
    protected int    orcBufferSize;
    protected int    defaultbufferSize  = 100000;
    protected long   orcStripeSize;
    protected long   defaultStripeSize  = 100000L;

    @Override
    public void init(Properties props, String propPrefix, String auditProviderName, Map<String, String> auditConfigs) {
        logger.debug("==> RangerORCAuditWriter.init()");

        init(props, propPrefix, auditProviderName);

        super.init(props, propPrefix, auditProviderName, auditConfigs);

        logger.debug("<== RangerORCAuditWriter.init()");
    }

    @Override
    public void flush() {
        //For HDFSAuditDestionation with ORC format each file is flushed immediately after writing the ORC batch.
        //So nothing to flush.
    }

    public synchronized boolean logAuditAsORC(final Collection<AuthzAuditEvent> events) throws Exception {
        boolean ret = false;
        Writer  out = null;

        try {
            if (logger.isDebugEnabled()) {
                logger.debug("UGI={}. Will write to HDFS file={}", MiscUtil.getUGILoginUser(), currentFileName);
            }

            out = MiscUtil.executePrivilegedAction((PrivilegedExceptionAction<Writer>) () -> {
                Writer out1 = getORCFileWrite();

                orcFileUtil.log(out1, events);

                return out1;
            });
        } catch (Exception e) {
            orcLogWriter = null;

            logger.error("Error while writing into ORC FileWriter", e);

            throw e;
        } finally {
            logger.debug("Flushing HDFS audit in ORC Format. Event Size:{}", events.size());

            if (out != null) {
                try {
                    //flush and close the ORC batch file
                    orcFileUtil.close(out);

                    ret = true;
                } catch (Exception e) {
                    logger.error("Error while closing the ORC FileWriter", e);

                    throw e;
                }

                orcLogWriter = null;
            }
        }

        return ret;
    }

    @Override
    public boolean log(Collection<String> events) throws Exception {
        return logAsORC(events);
    }

    @Override
    public boolean logFile(File file) throws Exception {
        return false;
    }

    @Override
    public void start() {
        // Nothing to do here. We will open the file when the first log request comes
    }

    @Override
    public synchronized void stop() {
        if (orcLogWriter != null) {
            try {
                orcFileUtil.close(orcLogWriter);
            } catch (Throwable t) {
                logger.error("Error on closing log ORC Writer. Exception will be ignored. name={}, fileName={}", auditProviderName, currentFileName);
            }

            orcLogWriter = null;
        }
    }

    public boolean logAsORC(Collection<String> events) throws Exception {
        Collection<AuthzAuditEvent> authzAuditEvents = getAuthzAuditEvents(events);

        return logAuditAsORC(authzAuditEvents);
    }

    public Collection<AuthzAuditEvent> getAuthzAuditEvents(Collection<String> events) {
        Collection<AuthzAuditEvent> ret = new ArrayList<>();

        for (String event : events) {
            try {
                AuthzAuditEvent authzAuditEvent = MiscUtil.fromJson(event, AuthzAuditEvent.class);

                ret.add(authzAuditEvent);
            } catch (Exception e) {
                logger.error("Error converting to From JSON to AuthzAuditEvent={}", event);

                throw e;
            }
        }
        return ret;
    }

    public void init(Properties props, String propPrefix, String auditProviderName) {
        compression   = MiscUtil.getStringProperty(props, propPrefix + "." + fileType + ".compression");
        orcBufferSize = MiscUtil.getIntProperty(props, propPrefix + "." + fileType + ".buffersize", defaultbufferSize);
        orcStripeSize = MiscUtil.getLongProperty(props, propPrefix + "." + fileType + ".stripesize", defaultStripeSize);

        setFileExtension(ORC_FILE_EXTENSION);

        try {
            orcFileUtil = ORCFileUtil.getInstance();

            orcFileUtil.init(orcBufferSize, orcStripeSize, compression);
        } catch (Exception e) {
            logger.error("Error while doing ORCWriter.init() ", e);
        }
    }

    // Creates ORC Write file
    protected synchronized Writer getORCFileWrite() throws Exception {
        logger.debug("==> RangerORCAuditWriter.getORCFileWrite()");

        if (orcLogWriter == null) {
            // Create the file to write
            createFileSystemFolders();

            logger.info("Creating new log file. hdfPath={}", fullPath);

            orcLogWriter    = orcFileUtil.createWriter(conf, fileSystem, fullPath);
            currentFileName = fullPath;
        }

        logger.debug("<== RangerORCAuditWriter.getORCFileWrite()");

        return orcLogWriter;
    }
}
