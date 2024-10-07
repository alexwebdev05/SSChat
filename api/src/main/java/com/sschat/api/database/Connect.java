package com.sschat.api.database;

import java.sql.SQLException;

public class Connect {
    public static void connectToDatabase() {
        try (var connection =  DB.connect()){
            System.out.println("Connected to the PostgreSQL database.");
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
    }
}
