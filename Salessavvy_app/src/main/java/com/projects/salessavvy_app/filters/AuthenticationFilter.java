package com.projects.salessavvy_app.filters;



import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.projects.salessavvy_app.entities.Role;
import com.projects.salessavvy_app.entities.User;
import com.projects.salessavvy_app.repositories.UserRepository;
import com.projects.salessavvy_app.services.AuthService;

@WebFilter(urlPatterns = {"/api/*", "/admin/*"})
@Component
public class AuthenticationFilter implements Filter {

    private static final Logger logger =
            LoggerFactory.getLogger(AuthenticationFilter.class);

    private final AuthService authService;
    private final UserRepository userRepository;

    // Frontend is running on Vite port 5173
    private static final String ALLOWED_ORIGIN =
            "http://localhost:5173";

    private static final String[] UNAUTHENTICATED_PATHS = {
        "/api/users/register",
        "/api/auth/login"
    };


    public AuthenticationFilter(
            AuthService authService,
            UserRepository userRepository) {

        System.out.println("Filter Started.");

        this.authService = authService;
        this.userRepository = userRepository;
    }


    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {

        try {

            executeFilterLogic(request, response, chain);

        } catch (Exception e) {

            logger.error(
                    "Unexpected error in AuthenticationFilter",
                    e
            );

            sendErrorResponse(
                    (HttpServletResponse) response,
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Internal server error"
            );
        }
    }


    private void executeFilterLogic(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest =
                (HttpServletRequest) request;

        HttpServletResponse httpResponse =
                (HttpServletResponse) response;


        /*
         * =========================================
         * CORS
         * =========================================
         *
         * Add CORS headers to EVERY response.
         */

        setCORSHeaders(httpResponse);


        String requestURI =
                httpRequest.getRequestURI();

        logger.info(
                "Request URI: {}",
                requestURI
        );


        /*
         * =========================================
         * OPTIONS / PREFLIGHT
         * =========================================
         */

        if (httpRequest.getMethod()
                .equalsIgnoreCase("OPTIONS")) {

            return;
        }


        /*
         * =========================================
         * PUBLIC ENDPOINTS
         * =========================================
         */

        if (Arrays.asList(UNAUTHENTICATED_PATHS)
                .contains(requestURI)) {

            chain.doFilter(request, response);

            return;
        }


        /*
         * =========================================
         * GET AUTH TOKEN FROM COOKIE
         * =========================================
         */

        String token =
                getAuthTokenFromCookies(httpRequest);

        System.out.println(token);


        /*
         * =========================================
         * VALIDATE TOKEN
         * =========================================
         */

        if (token == null
                || !authService.validateToken(token)) {

            sendErrorResponse(
                    httpResponse,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Unauthorized: Invalid or missing token"
            );

            return;
        }


        /*
         * =========================================
         * EXTRACT USERNAME
         * =========================================
         */

        String username =
                authService.extractUsername(token);


        /*
         * =========================================
         * FIND USER
         * =========================================
         */

        Optional<User> userOptional =
                userRepository.findByUsername(username);


        if (userOptional.isEmpty()) {

            sendErrorResponse(
                    httpResponse,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Unauthorized: User not found"
            );

            return;
        }


        /*
         * =========================================
         * GET AUTHENTICATED USER
         * =========================================
         */

        User authenticatedUser =
                userOptional.get();

        Role role =
                authenticatedUser.getRole();


        logger.info(
                "Authenticated User: {}, Role: {}",
                authenticatedUser.getUsername(),
                role
        );


        /*
         * =========================================
         * ADMIN ACCESS
         * =========================================
         */

        if (requestURI.startsWith("/admin/")
                && role != Role.ADMIN) {

            sendErrorResponse(
                    httpResponse,
                    HttpServletResponse.SC_FORBIDDEN,
                    "Forbidden: Admin access required"
            );

            return;
        }


        /*
         * =========================================
         * CUSTOMER ACCESS
         * =========================================
         */

        if (requestURI.startsWith("/api/")
                && role != Role.CUSTOMER) {

            sendErrorResponse(
                    httpResponse,
                    HttpServletResponse.SC_FORBIDDEN,
                    "Forbidden: Customer access required"
            );

            return;
        }


        /*
         * =========================================
         * ATTACH USER TO REQUEST
         * =========================================
         */

        httpRequest.setAttribute(
                "authenticatedUser",
                authenticatedUser
        );


        /*
         * =========================================
         * CONTINUE REQUEST
         * =========================================
         */

        chain.doFilter(request, response);
    }


    /*
     * =========================================
     * CORS HEADERS
     * =========================================
     */

    private void setCORSHeaders(
            HttpServletResponse response) {

        response.setHeader(
                "Access-Control-Allow-Origin",
                ALLOWED_ORIGIN
        );

        response.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS"
        );

        response.setHeader(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization"
        );

        response.setHeader(
                "Access-Control-Allow-Credentials",
                "true"
        );

        // DO NOT set response status here
    }


    /*
     * =========================================
     * ERROR RESPONSE
     * =========================================
     */

    private void sendErrorResponse(
            HttpServletResponse response,
            int statusCode,
            String message)
            throws IOException {

        // CORS headers are also needed for error responses
        setCORSHeaders(response);

        response.setStatus(statusCode);

        response.setContentType(
                "application/json"
        );

        response.getWriter().write(
                "{\"error\":\"" + message + "\"}"
        );
    }


    /*
     * =========================================
     * GET AUTH TOKEN FROM COOKIE
     * =========================================
     */

    private String getAuthTokenFromCookies(
            HttpServletRequest request) {

        Cookie[] cookies =
                request.getCookies();

        if (cookies != null) {

            return Arrays.stream(cookies)

                    .filter(cookie ->
                            "authToken"
                            .equals(cookie.getName()))

                    .map(Cookie::getValue)

                    .findFirst()

                    .orElse(null);
        }

        return null;
    }
}