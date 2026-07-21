package com.marioorlando.gymaccess.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyRevenueDto {
    private String date; // Fechas formateadas para la UI (ej. "Lu 15")
    private BigDecimal amount;
}
