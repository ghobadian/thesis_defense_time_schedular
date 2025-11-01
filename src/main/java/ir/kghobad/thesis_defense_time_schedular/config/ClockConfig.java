package ir.kghobad.thesis_defense_time_schedular.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;

@Configuration
public class ClockConfig {
    
    @Bean
    public Clock clock() {
        return Clock.systemDefaultZone();
    }
}
