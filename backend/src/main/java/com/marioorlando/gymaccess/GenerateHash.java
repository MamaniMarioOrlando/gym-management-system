package com.marioorlando.gymaccess;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("HASH: " + encoder.encode("Admin123!"));
    }
}
