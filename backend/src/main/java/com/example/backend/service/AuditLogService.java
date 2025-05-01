package com.example.backend.service;

import com.example.backend.model.AuditLog;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
public class AuditLogService {

    private static final String AUDIT_LOG_PATH = "audit_log.json";
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final AtomicLong logCounter;

    public AuditLogService() {
        this.logCounter = new AtomicLong(getLastId());
    }

    // Get the ID of the last log entry
    private long getLastId() {
        File file = new File(AUDIT_LOG_PATH);
        if (!file.exists()) return 1;

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            String lastLine = null;
            while ((line = reader.readLine()) != null) {
                lastLine = line;
            }
            if (lastLine != null && !lastLine.isBlank()) {
                AuditLog lastLog = objectMapper.readValue(lastLine, AuditLog.class);
                return lastLog.getId() + 1;
            }
        } catch (Exception e) {
            log.error("Could not read audit log for last ID: ", e);
        }
        return 1;
    }

    // Logs an entry of the zoning update
    public boolean logZoningUpdate(int parcelsAffected, String zoningType) {
        FileWriter writer = null;
        File file = new File(AUDIT_LOG_PATH);
        try {
            AuditLog logEntry = new AuditLog();
            logEntry.setId(logCounter.getAndIncrement());
            logEntry.setAction("Updated " + parcelsAffected + " parcels to zoning type: " + zoningType);
            logEntry.setTimestamp(LocalDateTime.now().toString());

            writer = new FileWriter(file, true);
            writer.write(objectMapper.writeValueAsString(logEntry));
            writer.write("\n");
            writer.close();
            return true;
        } catch (Exception e) {
            log.error("Failed to log audit entry: ", e);
            if (writer != null) {
                try { writer.close(); } catch (Exception ignore) {}
            }
            return false;
        }
    }
}