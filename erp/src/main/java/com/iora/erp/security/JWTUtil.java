package com.iora.erp.security;

import java.util.Date;
import java.util.List;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.iora.erp.exception.AuthenticationException;

public class JWTUtil {
    private static final Algorithm algorithm = Algorithm.HMAC256("iora-ERP".getBytes());
    private static final long ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000;
    private static final long REFRESH_TOKEN_EXPIRY = 365 * 24 * 60 * 60 * 1000;

    public static DecodedJWT decodeHeader(String authenticationHeader) throws AuthenticationException {
        if (authenticationHeader == null || !authenticationHeader.startsWith("Bearer ")) {
            throw new AuthenticationException("Invalid authentication header.");
        }
        String token = authenticationHeader.substring("Bearer ".length());
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);
    }

    public static String generateAccessToken(String username, String issuer, List<String> authorities) {
        return JWT.create()
                .withSubject(username)
                .withExpiresAt(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRY))
                .withIssuer(issuer)
                .withClaim("accessRights", authorities)
                .sign(algorithm);
    }

    public static String generateRefreshToken(String username, String issuer) {
        return JWT.create()
                .withSubject(username)
                .withExpiresAt(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRY))
                .withIssuer(issuer)
                .sign(algorithm);
    }
}
