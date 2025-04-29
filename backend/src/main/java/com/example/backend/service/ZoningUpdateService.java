package com.example.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ZoningUpdateService {

    private static final String ZONING_UPDATE_PATH = "zoning_updates.json";
    private static final String ZONING_UPDATE_TEMP_PATH = "zoning_updates_temp.json";
    private static final String BACKUP_PATH = "zoning_updates_backup.json";

    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean updateParcels(List<Integer> parcelIds, String newZoningType) {
        File tempFile = new File(ZONING_UPDATE_TEMP_PATH);
        File originalFile = new File(ZONING_UPDATE_PATH);
        File backupFile = new File(BACKUP_PATH);

        try {
            if (originalFile.exists()) {
                Files.copy(originalFile.toPath(), backupFile.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            }

            Map<String, String> parcels = new HashMap<>();
            if (originalFile.exists() && originalFile.length() > 0) {
                parcels = objectMapper.readValue(originalFile, new TypeReference<Map<String, String>>() {});
            }

            for (Integer id : parcelIds) {
                parcels.put(id.toString(), newZoningType);
            }

            objectMapper.writerWithDefaultPrettyPrinter().writeValue(tempFile, parcels);
            Files.move(tempFile.toPath(), originalFile.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            return true;
        } catch (IOException e) {
            System.err.println("Warning: Zoning updates file exists but couldn't be read. Starting fresh.");
            return false;
        }
    }

    public void rollback() {
        File originalFile = new File(ZONING_UPDATE_PATH);
        File backupFile = new File(BACKUP_PATH);

        try {
            if (backupFile.exists()) {
                Files.copy(backupFile.toPath(), originalFile.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                System.out.println("Rollback succeeded: zoning update reverted.");
            }
        } catch (IOException e) {
            System.err.println("Rollback failed: " + e.getMessage());
        }
    }
}
