package com.example.backend.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AuditLog {
    private Long id;
    private String action;
    private LocalDateTime timestamp;
}
