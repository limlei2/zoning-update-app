package com.example.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZoningUpdateRequest {
    private List<Integer> parcelIds;
    private String zoningType;
}
