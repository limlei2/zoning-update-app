package com.example.backend.service;

import com.example.backend.model.ParcelData;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class ParcelService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<ParcelData> getAllParcels() {
        String sql = "SELECT id, zoning_typ, mailadd, mail_zip, mail_city, usedesc, ST_AsGeoJSON(geom) AS coords, ST_Area(geom::geography) AS area FROM real_estate_zoning";
        List<ParcelData> parcels = new ArrayList<>();

        Map<Integer, String> updatedZonings = loadZoningTypes();

        jdbcTemplate.query(sql, rs -> {
            Integer id = rs.getInt("id");
            String zoningType = rs.getString("zoning_typ");

            if (updatedZonings.containsKey(id) && updatedZonings.get(id) != null) {
                zoningType = updatedZonings.get(id);
            }

            String coords = rs.getString("coords");
            Double area = rs.getDouble("area");
            String usedesc = rs.getString("usedesc");

            String mailAddress = rs.getString("mailadd");
            String mailCity = rs.getString("mail_city");
            String mailZip = rs.getString("mail_zip");
            String fullAddress = String.format("%s, %s %s", mailAddress, mailCity, mailZip);

            try {
                JsonNode coordsJson = objectMapper.readTree(coords);
                JsonNode coordinatesNode = coordsJson.get("coordinates").get(0);

                List<List<Double>> coordinates = new ArrayList<>();
                coordinatesNode.forEach(point -> {
                    List<Double> latlong = new ArrayList<>();
                    latlong.add(point.get(1).asDouble());
                    latlong.add(point.get(0).asDouble());
                    coordinates.add(latlong);
                });

                parcels.add(new ParcelData(id, coordinates, zoningType, area, fullAddress, usedesc));

            } catch (Exception e) {
                System.err.println("Error while fetching parcels: " + e.getMessage());
                throw new RuntimeException("Database error while fetching parcels");
            }
        });
        return parcels;
    }

    private Map<Integer, String> loadZoningTypes() {
        Map<Integer, String> updatedZonings = new HashMap<>();
        try {
            File file = new File("zoning_updates.json");
            if (file.exists()) {
                JsonNode root = objectMapper.readTree(file);
                root.fields().forEachRemaining(entry -> {
                    Integer id = Integer.parseInt(entry.getKey());
                    String zoningType = entry.getValue().asText();
                    updatedZonings.put(id, zoningType);
                });
            }
        } catch (IOException e) {
            System.err.println("Error reading zoning_updates.json: " + e.getMessage());
        }
        return updatedZonings;
    }

}
