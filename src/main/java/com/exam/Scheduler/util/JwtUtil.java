package com.exam.Scheduler.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    private static final String SECRET = "your-256-bit-secret-your-256-bit-secret"; // 32 ký tự trở lên
    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes());
    private final long EXPIRATION = 86400000; // 1 ngày

    public String generateToken(long id) {
        return Jwts.builder()
                .claim("id", id)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(SECRET_KEY)
                .compact();
    }

}

