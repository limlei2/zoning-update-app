package com.example.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ZoningUpdateService {

    private static final String ZONING_UPDATE_PATH = "zoning_updates.json";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void updateParcels(List<Integer> parcelIds, String newZoningType) {
        try {
            File file = new File(ZONING_UPDATE_PATH);

            Map<String, String> parcels = new HashMap<>();
            if (file.exists() && file.length() > 0) {
                try {
                    parcels = objectMapper.readValue(file, new TypeReference<Map<String, String>>() {});
                } catch (IOException e) {
                    System.err.println("Warning: Zoning updates file exists but couldn't be read. Starting fresh.");
                    parcels = new HashMap<>();
                }
            }

            for (Integer id : parcelIds) {
                parcels.put(id.toString(), newZoningType);
            }

            objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, parcels);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
