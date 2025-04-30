package com.example.backend.model;

import lombok.Data;

@Data
public class AuditLog {
    private Long id;
    private String action;
    private String timestamp;
}
