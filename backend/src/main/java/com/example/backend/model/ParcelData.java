package com.example.backend.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParcelData {
    private Integer id;
    private List<List<Double>> coordinates;
    private String zoningType;
    private Double area;
    private String fullAddress;
    private String usedesc;
}
