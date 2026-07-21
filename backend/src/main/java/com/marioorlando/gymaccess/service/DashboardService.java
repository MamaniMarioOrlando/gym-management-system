package com.marioorlando.gymaccess.service;

import com.marioorlando.gymaccess.dto.DailyRevenueDto;
import com.marioorlando.gymaccess.dto.DashboardMetricsDto;
import com.marioorlando.gymaccess.repository.PaymentRepository;
import com.marioorlando.gymaccess.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    @Transactional(readOnly = true)
    public DashboardMetricsDto getMetrics() {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        // 1. Members
        long active = userRepository.countByMembershipExpiryDateAfter(now);
        long expired = userRepository.countByMembershipExpiryDateBefore(now);

        // 2. Revenue Today
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
        BigDecimal dailyRevenue = paymentRepository.sumRevenueBetweenDates(startOfDay, endOfDay);

        // 3. Revenue Month
        LocalDateTime startOfMonth = today.withDayOfMonth(1).atStartOfDay();
        BigDecimal monthlyRevenue = paymentRepository.sumRevenueBetweenDates(startOfMonth, endOfDay);

        // 4. Last 7 Days Graph Data
        List<DailyRevenueDto> chartData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
        
        for (int i = 6; i >= 0; i--) {
            LocalDate targetDate = today.minusDays(i);
            LocalDateTime start = targetDate.atStartOfDay();
            LocalDateTime end = targetDate.atTime(LocalTime.MAX);
            
            BigDecimal revenue = paymentRepository.sumRevenueBetweenDates(start, end);
            chartData.add(new DailyRevenueDto(targetDate.format(formatter), revenue));
        }

        return DashboardMetricsDto.builder()
                .activeMembers(active)
                .expiredMembers(expired)
                .dailyRevenue(dailyRevenue)
                .monthlyRevenue(monthlyRevenue)
                .chartData(chartData)
                .build();
    }
}
