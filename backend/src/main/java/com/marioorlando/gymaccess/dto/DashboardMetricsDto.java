package com.marioorlando.gymaccess.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardMetricsDto {
    private long activeMembers;
    private long expiredMembers;
    private BigDecimal dailyRevenue;
    private BigDecimal monthlyRevenue;
    private List<DailyRevenueDto> chartData; // Arreglo para mapear en Recharts
}
