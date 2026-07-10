package com.marioorlando.gymaccess.service;

import com.marioorlando.gymaccess.model.AccessLog;
import com.marioorlando.gymaccess.model.User;
import com.marioorlando.gymaccess.repository.AccessLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccessLogService {

    private final AccessLogRepository logRepository;

    public AccessLogService(AccessLogRepository logRepository) {
        this.logRepository = logRepository;
    }

    @Transactional
    public void saveLog(User user, String identifier, boolean granted, String reason) {
        AccessLog log = AccessLog.builder()
                .user(user)
                .scannedIdentifier(identifier)
                .accessGranted(granted)
                .rejectionReason(reason)
                .method("KIOSK")
                .build();
        
        logRepository.save(log);
    }
}
