package com.example.backend.controller;

import com.example.backend.service.ParcelService;
import com.example.backend.model.ParcelData;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
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
            log.error("Failed to fetch parcels", e);
            return ResponseEntity
                    .status(503)
                    .body("Failed to fetch parcels. Please try again later.");
        }
    }
}
