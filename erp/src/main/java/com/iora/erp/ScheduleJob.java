package com.iora.erp;

import java.util.Date;

import com.iora.erp.service.ShippItService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class ScheduleJob {

    @Autowired
    ShippItService shipItService;

    @Scheduled(cron = "*/5 * * * * ?")
    public void showtime() {
        shipItService.fetchStatus();
    }
}
