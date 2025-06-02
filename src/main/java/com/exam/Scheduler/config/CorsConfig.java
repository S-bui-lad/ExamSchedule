package com.exam.Scheduler.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // ⚠️ Thay bằng domain thật của bạn (S3 hoặc CloudFront)
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:5173", // để dev local
                "http://172.20.10.2:5173", // nếu test nội bộ
                "https://feadmin.son1311.id.vn",
                "http://fewebserver.s3-website-ap-southeast-2.amazonaws.com",
                "http://52.62.16.185",
                "https://aws.tphongnguyen.id.vn",
                "http://my-static-site-234.s3-website-ap-southeast-2.amazonaws.com"
        ));

        config.setAllowCredentials(true);
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
