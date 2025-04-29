package com.example.backend.controller;

import com.example.backend.model.ZoningUpdateRequest;
import com.example.backend.service.AuditLogService;
import com.example.backend.service.ZoningUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ZoningUpdateController {

    @Autowired
    private ZoningUpdateService zoningUpdateService;

    @Autowired
    private AuditLogService auditLogService;

    @PostMapping("/zoning-update")
    public ResponseEntity<String> updateZoning(@RequestBody ZoningUpdateRequest request) {
        List<Integer> parcelIds = request.getParcelIds();
        String zoningType = request.getZoningType();
        int parcelsUpdated = request.getParcelIds().size();

        try {
            zoningUpdateService.updateParcels(parcelIds, zoningType);
            auditLogService.logZoningUpdate(parcelsUpdated, zoningType);
            return ResponseEntity.ok("Zoning update successful.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body("Zoning update failed: " + e.getMessage());
        }
    }
}
