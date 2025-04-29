package com.example.backend.controller;

import com.example.backend.service.ParcelService;
import com.example.backend.model.ParcelData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ParcelController {

    @Autowired
    private ParcelService parcelService;

    @GetMapping("/parcels")
    public ResponseEntity<?> getAllParcels() {
        try {
            List<ParcelData> parcels = parcelService.getAllParcels();
            return ResponseEntity.ok(parcels);
        } catch (Exception e) {
            e.printStackTrace(); // or use a proper logger
            return ResponseEntity
                    .status(503)
                    .body("Failed to fetch parcels. Please try again later.");
        }
    }
}
