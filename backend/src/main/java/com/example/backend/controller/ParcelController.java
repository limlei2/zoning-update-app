package com.example.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.backend.model.ParcelData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ParcelController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/parcels")
    public List<ParcelData> getAllParcels() {
        String sql = "SELECT id, zoning_typ, mailadd, mail_zip, mail_city, usedesc, ST_AsGeoJSON(geom) AS coords, ST_Area(geom::geography) AS area FROM real_estate_zoning";
        List<ParcelData> parcels = new ArrayList<>();

        jdbcTemplate.query(sql, rs -> {
            Integer id = rs.getInt("id");
            String zoningType = rs.getString("zoning_typ");
            String coords = rs.getString("coords");
            Double area = rs.getDouble("area");
            String usedesc = rs.getString("usedesc");

            String mailAddress = rs.getString("mailadd");
            String mailCity = rs.getString("mail_city");
            String mailZip = rs.getString("mail_zip");
            String fullAddress = String.format("%s, %s %s", mailAddress, mailCity, mailZip);

            try {
                JsonNode coordsJson = objectMapper.readTree(coords);
                JsonNode coordinatesNode = coordsJson.get("coordinates").get(0); // Polygon outer ring

                List<List<Double>> coordinates = new ArrayList<>();
                coordinatesNode.forEach(point -> {
                    List<Double> latlong = new ArrayList<>();
                    latlong.add(point.get(1).asDouble());
                    latlong.add(point.get(0).asDouble());
                    coordinates.add(latlong);
                });

                parcels.add(new ParcelData(id, coordinates, zoningType, area, fullAddress, usedesc));

            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        return parcels;
    }
}
